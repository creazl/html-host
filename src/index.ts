import { Hono } from "hono";
import { cors } from "hono/cors";
import { ADMIN_HTML } from "./admin";
import { LANDING_HTML } from "./landing";
import { UPLOAD_HTML } from "./upload";
import { EXPLORE_HTML } from "./explore";

type Bindings = {
  PAGES_KV: KVNamespace;
  DB: D1Database;
  ADMIN_PASSWORD: string;
  IMG_HOST?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

// ---------- constants ----------

const PUBLIC_TTL = 30 * 86400; // 30 days
// Size limits are expressed in characters (UTF-16 units), not bytes.
// KV itself allows up to 25 MiB per value, but a Worker invocation is bounded
// by CPU time (JSON.parse of the body) and 128 MB memory, so the JSON API is
// kept at 1M chars while large admin saves use the raw-body endpoint.
const MAX_CONTENT = 1024 * 1024; // 1M chars — JSON API (admin small saves + anonymous uploads)
const MAX_CONTENT_RAW = 4 * 1024 * 1024; // 4M chars — admin raw-body save
const SCAN_MAX = 256 * 1024; // risk scanning samples at most the first 256K chars
const MAX_IMAGE = 8 * 1024 * 1024; // 8 MB
const DAILY_UPLOAD_LIMIT = 20;
const HISTORY_LIMIT = 5;
// Optional TG image host; set via the IMG_HOST binding/variable. Empty means
// image upload is disabled until a host is configured.
const DEFAULT_IMG_HOST = "";

// Cache strategy: static shells are immutable at the edge/browser for a short
// TTL with stale-while-revalidate; public pages get a short cache; admin and
// password-protected pages are never cached.
const SHELL_CACHE = "public, max-age=300, stale-while-revalidate=86400";
const ADMIN_CACHE = "no-store";
const PUBLIC_PAGE_CACHE = "public, max-age=60, stale-while-revalidate=300";
const PRIVATE_PAGE_CACHE = "private, no-store";
const VARY_ENCODING = "Accept-Encoding";

// ---------- helpers ----------

function sanitizePath(p: string): string {
  return p.replace(/^\/+|\/+$/g, "").replace(/[^a-zA-Z0-9-_\/]/g, "-");
}

function randomPath(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const buf = new Uint8Array(6);
  crypto.getRandomValues(buf);
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[buf[i] % chars.length];
  return "p/" + s;
}

function imgHost(c: any): string {
  return (c.env.IMG_HOST || DEFAULT_IMG_HOST).replace(/\/+$/, "");
}

function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as Record<string, string>)[ch]
  );
}

async function getAdminPassword(c: any): Promise<string> {
  const stored = await c.env.PAGES_KV.get("admin:password");
  return stored || c.env.ADMIN_PASSWORD;
}

async function isAdmin(c: any): Promise<boolean> {
  const auth = c.req.header("Authorization") || "";
  const token = auth.replace("Bearer ", "");
  const expected = await getAdminPassword(c);
  return token === expected;
}

// Per-IP daily upload limit for anonymous submissions
async function rateLimited(c: any): Promise<boolean> {
  const ip = c.req.header("CF-Connecting-IP") || "anon";
  const key = `upload-rate:${ip}`;
  const cur = parseInt(await c.env.PAGES_KV.get(key) || "0", 10);
  if (cur >= DAILY_UPLOAD_LIMIT) return true;
  await c.env.PAGES_KV.put(key, String(cur + 1), { expirationTtl: 86400 });
  return false;
}

// Scan uploaded HTML for risky constructs; returns risk level + warnings
function scanHtml(html: string): { risk: string; warnings: string[] } {
  const warnings: string[] = [];
  if (/<script[\s>]/i.test(html)) warnings.push("包含 <script> 脚本标签");
  if (/on\w+\s*=/i.test(html)) warnings.push("包含内联事件处理器（onclick 等）");
  if (/javascript:/i.test(html)) warnings.push("包含 javascript: 伪协议链接");
  if (/<iframe/i.test(html)) warnings.push("包含 iframe 嵌入");
  if (/<form/i.test(html)) warnings.push("包含表单（可能用于钓鱼）");
  if (/url\(\s*['"]?https?:/i.test(html)) warnings.push("引用了外部资源");

  let risk = "safe";
  if (warnings.length >= 3) risk = "high";
  else if (warnings.length >= 1) risk = "medium";
  return { risk, warnings };
}

// Large documents are sampled (first SCAN_MAX chars) so the regex scan stays
// cheap and the invocation stays inside the CPU budget.
function scanFor(content: string): { risk: string; warnings: string[] } {
  return scanHtml(content.length > SCAN_MAX ? content.slice(0, SCAN_MAX) : content);
}

// ---- version history (stored in KV, latest first) ----


async function snapshotVersion(c: any, path: string, oldContent: string | null): Promise<void> {
  if (oldContent === null || oldContent === undefined) return;
  const metaKey = `histmeta:${path}`;
  const now = Math.floor(Date.now() / 1000);
  let meta: { ts: number; size: number }[] = [];
  try {
    meta = JSON.parse(await c.env.PAGES_KV.get(metaKey) || "[]");
  } catch {
    meta = [];
  }
  await c.env.PAGES_KV.put(`hist:${path}:${now}`, oldContent);
  meta.unshift({ ts: now, size: oldContent.length });
  meta = meta.slice(0, HISTORY_LIMIT);

  const keep = new Set(meta.map((m) => `hist:${path}:${m.ts}`));
  const listed = await c.env.PAGES_KV.list({ prefix: `hist:${path}:` });
  for (const k of listed.keys) {
    if (!keep.has(k.name)) await c.env.PAGES_KV.delete(k.name);
  }
  await c.env.PAGES_KV.put(metaKey, JSON.stringify(meta));
}

async function clearHistory(c: any, path: string): Promise<void> {
  const listed = await c.env.PAGES_KV.list({ prefix: `hist:${path}:` });
  for (const k of listed.keys) await c.env.PAGES_KV.delete(k.name);
  await c.env.PAGES_KV.delete(`histmeta:${path}`);
}

// ---- Open Graph meta injection ----

function buildMetaTags(title: string, description: string, cover: string, url: string): string {
  const t = esc(title), d = esc(description), c = esc(cover), u = esc(url);
  let tags = `<meta property="og:title" content="${t}">`;
  if (d) tags += `<meta property="og:description" content="${d}"><meta name="description" content="${d}">`;
  if (c) tags += `<meta property="og:image" content="${c}">`;
  tags += `<meta property="og:url" content="${u}"><meta property="og:type" content="website">`;
  tags += `<meta name="twitter:card" content="${c ? "summary_large_image" : "summary"}">`;
  return tags;
}

function injectMeta(html: string, tags: string): string {
  if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, (m) => m + tags);
  if (/<!doctype html>/i.test(html)) return html.replace(/<!doctype html>/i, (m) => m + `<head>${tags}</head>`);
  return tags + html;
}

// ---------- pages ----------

app.get("/", (c) => c.html(LANDING_HTML, 200, { "Cache-Control": SHELL_CACHE, "Vary": VARY_ENCODING }));
app.get("/upload", (c) => c.html(UPLOAD_HTML, 200, { "Cache-Control": SHELL_CACHE, "Vary": VARY_ENCODING }));
app.get("/explore", (c) => c.html(EXPLORE_HTML, 200, { "Cache-Control": SHELL_CACHE, "Vary": VARY_ENCODING }));
app.get("/_admin", (c) => c.html(ADMIN_HTML, 200, { "Cache-Control": ADMIN_CACHE, "Vary": VARY_ENCODING }));

// ---------- API: auth ----------

app.post("/_api/auth", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const expected = await getAdminPassword(c);
  if (body.password === expected) {
    return c.json({ ok: true, token: expected });
  }
  return c.json({ ok: false, error: "密码错误" }, 401);
});

// ---------- API: change password ----------

app.post("/_api/change-password", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const expected = await getAdminPassword(c);
  if (body.oldPassword !== expected) {
    return c.json({ ok: false, error: "当前密码错误" }, 401);
  }
  if (!body.newPassword || body.newPassword.length < 6) {
    return c.json({ ok: false, error: "新密码至少6位" }, 400);
  }
  await c.env.PAGES_KV.put("admin:password", body.newPassword);
  return c.json({ ok: true });
});

// ---------- API: list pages (admin) ----------

app.get("/_api/list", async (c) => {
  if (!(await isAdmin(c))) return c.json({ error: "未授权" }, 401);
  const { results } = await c.env.DB.prepare(
    `SELECT path, title, views, owner, risk, expires_at, description, cover, status,
            created_at, updated_at, password != '' as has_password
     FROM pages ORDER BY updated_at DESC`
  ).all();
  return c.json({ pages: results });
});

// ---------- API: get page content (admin) ----------

app.get("/_api/page/:path{.+}", async (c) => {
  if (!(await isAdmin(c))) return c.json({ error: "未授权" }, 401);
  const path = sanitizePath(c.req.param("path"));
  const content = await c.env.PAGES_KV.get(`page:${path}`);
  if (content === null) return c.json({ error: "页面不存在" }, 404);
  const meta = await c.env.DB.prepare(
    `SELECT path, title, password, views, owner, risk, expires_at, description, cover, status,
            created_at, updated_at FROM pages WHERE path = ?`
  ).bind(path).first();
  return c.json({ path, content, meta });
});

// ---------- API: upload / save (admin) ----------

// Shared save path: KV content + version snapshot + D1 metadata upsert.
async function saveManagedPage(c: any, content: string, meta: any) {
  const path = sanitizePath(meta.path || "");
  if (!path) return c.json({ error: "请填写 URL 路径" }, 400);
  if (!content) return c.json({ error: "内容不能为空" }, 400);

  const title = String(meta.title || "").slice(0, 100);
  const password = String(meta.password || "").slice(0, 100);
  const description = String(meta.description || "").slice(0, 200);
  const cover = String(meta.cover || "").slice(0, 500);

  const { risk, warnings } = scanFor(content);
  const now = Math.floor(Date.now() / 1000);

  // snapshot the previous version before overwriting
  const previous = await c.env.PAGES_KV.get(`page:${path}`);
  await snapshotVersion(c, path, previous);
  await c.env.PAGES_KV.put(`page:${path}`, content);

  await c.env.DB.prepare(
    `INSERT INTO pages (path, title, password, risk, owner, expires_at, description, cover, status, views, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'admin', 0, ?, ?, 'approved', COALESCE((SELECT views FROM pages WHERE path = ?), 0), ?, ?)
     ON CONFLICT(path) DO UPDATE SET title=?, password=?, risk=?, description=?, cover=?, updated_at=?`
  ).bind(path, title || path, password || "", risk, description, cover, path, now, now,
        title || path, password || "", risk, description, cover, now).run();

  return c.json({ ok: true, path, url: `/${path}`, risk, warnings });
}

app.post("/_api/upload", async (c) => {
  if (!(await isAdmin(c))) return c.json({ error: "未授权" }, 401);
  const body = await c.req.json().catch(() => ({}));
  const content = String(body.content || "");
  if (content.length > MAX_CONTENT) {
    return c.json(
      { error: `内容超过 ${MAX_CONTENT / 1024}K 字符限制，超大文件请用后台编辑器保存` },
      413
    );
  }
  return saveManagedPage(c, content, body);
});

// Raw-body save for large documents: content travels as the request body so it
// is never JSON.parse'd, keeping CPU low; small metadata rides in X-Meta.
app.post("/_api/upload-raw", async (c) => {
  if (!(await isAdmin(c))) return c.json({ error: "未授权" }, 401);
  let meta: any = {};
  try {
    const h = c.req.header("x-meta") || "";
    if (h) meta = JSON.parse(decodeURIComponent(h));
  } catch {
    meta = {};
  }
  const content = await c.req.text();
  if (content.length > MAX_CONTENT_RAW) {
    return c.json({ error: `内容超过 ${MAX_CONTENT_RAW / 1024 / 1024}M 字符限制` }, 413);
  }
  return saveManagedPage(c, content, meta);
});

// ---------- API: public anonymous upload ----------

app.post("/_api/public-upload", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const content = body.content || "";
  const title = String(body.title || "").slice(0, 80);
  const description = String(body.description || "").slice(0, 200);
  if (!content) return c.json({ error: "内容不能为空" }, 400);
  if (content.length > MAX_CONTENT) {
    return c.json({ error: `内容超过 ${MAX_CONTENT / 1024}K 字符限制` }, 413);
  }
  if (await rateLimited(c)) return c.json({ error: "今日投稿已达上限，请明天再试" }, 429);

  const { risk, warnings } = scanHtml(content);
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + PUBLIC_TTL;

  // random path with a few collision retries
  let path = randomPath();
  for (let i = 0; i < 5; i++) {
    if (await c.env.PAGES_KV.get(`page:${path}`) === null) break;
    path = randomPath();
  }

  await c.env.PAGES_KV.put(`page:${path}`, content);
  await c.env.DB.prepare(
    `INSERT INTO pages (path, title, password, risk, owner, expires_at, description, cover, status, views, created_at, updated_at)
     VALUES (?, ?, '', ?, 'public', ?, ?, '', 'approved', 0, ?, ?)
     ON CONFLICT(path) DO UPDATE SET title=?, risk=?, owner='public', description=?, expires_at=?, status='approved', updated_at=?`
  ).bind(path, title, risk, expiresAt, description, now, now, title, risk, description, expiresAt, now).run();

  return c.json({ ok: true, path, url: `/${path}`, risk, warnings, expires_at: expiresAt });
});

// ---------- API: public meta lookup (anonymous, by explicit paths only) ----------

app.post("/_api/public/meta", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const paths: string[] = Array.isArray(body.paths)
    ? body.paths.slice(0, 50).map(String).map(sanitizePath).filter(Boolean)
    : [];
  if (!paths.length) return c.json({ items: {} });
  const placeholders = paths.map(() => "?").join(",");
  const res = await c.env.DB.prepare(
    `SELECT path, title, risk, expires_at, status FROM pages WHERE path IN (${placeholders})`
  ).bind(...paths).all();
  const items: Record<string, any> = {};
  for (const row of res.results as any[]) {
    items[row.path] = {
      title: row.title, risk: row.risk,
      expires_at: row.expires_at, status: row.status,
    };
  }
  for (const p of paths) if (!(p in items)) items[p] = null;
  return c.json({ items }, 200, { "Cache-Control": "public, max-age=30", "Vary": VARY_ENCODING });
});

// ---------- API: public directory (anonymous, public non-private pages only) ----------

app.get("/_api/public/directory", async (c) => {
  const now = Math.floor(Date.now() / 1000);
  const { results } = await c.env.DB.prepare(
    `SELECT path, title, description, cover, views, risk, owner, updated_at, expires_at
     FROM pages
     WHERE status = 'approved' AND password = ''
       AND (expires_at = 0 OR expires_at > ?)
     ORDER BY updated_at DESC
     LIMIT 200`
  ).bind(now).all();
  return c.json({ pages: results }, 200, { "Cache-Control": "public, max-age=30", "Vary": VARY_ENCODING });
});

// ---------- API: image upload forwarded to TG image host ----------

app.post("/_api/upload-image", async (c) => {
  const admin = await isAdmin(c);
  if (!admin && await rateLimited(c)) return c.json({ error: "今日投稿已达上限，请明天再试" }, 429);

  const form = await c.req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return c.json({ error: "未收到图片文件" }, 400);
  if (!file.type.startsWith("image/")) return c.json({ error: "仅支持图片文件" }, 400);
  if (file.size > MAX_IMAGE) return c.json({ error: "图片不超过 8MB" }, 413);

  const fd = new FormData();
  fd.append("file", file, file.name || "image.png");

  const host = imgHost(c);
  if (!host) return c.json({ error: "图床未配置，请在环境变量 IMG_HOST 中设置图床地址" }, 501);

  let upstream: Response;
  try {
    upstream = await fetch(`${host}/upload`, { method: "POST", body: fd });
  } catch {
    return c.json({ error: "图床连接失败，请稍后重试" }, 502);
  }
  if (!upstream.ok) return c.json({ error: "图床上传失败" }, 502);

  const data: any = await upstream.json().catch(() => null);
  const src: string | undefined = Array.isArray(data) ? data[0]?.src : data?.src;
  if (!src) return c.json({ error: "图床未返回图片地址" }, 502);

  const url = src.startsWith("http") ? src : `${host}${src}`;
  return c.json({ ok: true, url });
});

// ---------- API: toggle page visibility (admin) ----------

app.post("/_api/page/:path{.+}/status", async (c) => {
  if (!(await isAdmin(c))) return c.json({ error: "未授权" }, 401);
  const path = sanitizePath(c.req.param("path"));
  const body = await c.req.json().catch(() => ({}));
  const status = body.status === "hidden" ? "hidden" : "approved";
  const now = Math.floor(Date.now() / 1000);
  await c.env.DB.prepare("UPDATE pages SET status = ?, updated_at = ? WHERE path = ?")
    .bind(status, now, path).run();
  return c.json({ ok: true, status });
});

// ---------- API: version history (admin) ----------

app.get("/_api/history/:path{.+}", async (c) => {
  if (!(await isAdmin(c))) return c.json({ error: "未授权" }, 401);
  const path = sanitizePath(c.req.param("path"));
  let meta: { ts: number; size: number }[] = [];
  try {
    meta = JSON.parse(await c.env.PAGES_KV.get(`histmeta:${path}`) || "[]");
  } catch {
    meta = [];
  }
  return c.json({ path, history: meta });
});

app.get("/_api/history/:path{.+}/:ts", async (c) => {
  if (!(await isAdmin(c))) return c.json({ error: "未授权" }, 401);
  const path = sanitizePath(c.req.param("path"));
  const ts = c.req.param("ts");
  const content = await c.env.PAGES_KV.get(`hist:${path}:${ts}`);
  if (content === null) return c.json({ error: "版本不存在" }, 404);
  return c.json({ path, ts, content });
});

app.post("/_api/history/:path{.+}/restore", async (c) => {
  if (!(await isAdmin(c))) return c.json({ error: "未授权" }, 401);
  const path = sanitizePath(c.req.param("path"));
  const body = await c.req.json().catch(() => ({}));
  const ts = String(body.ts || "");
  const snapshot = await c.env.PAGES_KV.get(`hist:${path}:${ts}`);
  if (snapshot === null) return c.json({ error: "版本不存在" }, 404);

  // keep the current version before rolling back
  const current = await c.env.PAGES_KV.get(`page:${path}`);
  await snapshotVersion(c, path, current);

  await c.env.PAGES_KV.put(`page:${path}`, snapshot);
  const now = Math.floor(Date.now() / 1000);
  await c.env.DB.prepare("UPDATE pages SET updated_at = ? WHERE path = ?").bind(now, path).run();
  return c.json({ ok: true, path });
});

// ---------- API: delete page (admin) ----------

app.delete("/_api/page/:path{.+}", async (c) => {
  if (!(await isAdmin(c))) return c.json({ error: "未授权" }, 401);
  const path = sanitizePath(c.req.param("path"));
  await c.env.PAGES_KV.delete(`page:${path}`);
  await clearHistory(c, path);
  await c.env.DB.prepare("DELETE FROM pages WHERE path = ?").bind(path).run();
  return c.json({ ok: true });
});

// ---------- render page (catch-all) ----------

app.get("/*", async (c) => {
  const url = new URL(c.req.url);
  const path = sanitizePath(url.pathname.replace(/^\/+/, ""));
  if (!path) {
    return c.html(LANDING_HTML, 200, { "Cache-Control": SHELL_CACHE, "Vary": VARY_ENCODING });
  }

  const content = await c.env.PAGES_KV.get(`page:${path}`);
  if (content === null) return c.notFound();

  const now = Math.floor(Date.now() / 1000);
  const meta = await c.env.DB.prepare(
    `SELECT password, views, risk, owner, expires_at, description, cover, title, status
     FROM pages WHERE path = ?`
  ).bind(path).first();

  // lazy cleanup: expired public pages are removed on access
  if (meta && meta.expires_at > 0 && now > meta.expires_at) {
    await c.env.PAGES_KV.delete(`page:${path}`);
    await clearHistory(c, path);
    await c.env.DB.prepare("DELETE FROM pages WHERE path = ?").bind(path).run();
    return c.notFound();
  }

  // manually taken down by admin: not visible publicly
  if (meta && meta.status === "hidden") return c.notFound();

  // password gate
  if (meta?.password) {
    const pass = url.searchParams.get("pass") || "";
    if (pass !== meta.password) {
      return c.html(`<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8"><title>需要密码</title>
<style>
body{font-family:system-ui,'PingFang SC','Microsoft YaHei';background:#0a0a12;color:#e8e8f0;display:flex;
align-items:center;justify-content:center;height:100vh;margin:0}
.box{background:#16162a;padding:2rem;border-radius:16px;text-align:center;min-width:300px;
border:1px solid #262645}
input{background:#0a0a12;border:1px solid #262645;padding:0.6rem 1rem;border-radius:10px;
color:#fff;margin:1rem 0;width:200px;outline:none}
input:focus{border-color:#7c5cfc}
button{background:linear-gradient(135deg,#7c5cfc,#5a3df0);color:#fff;border:none;
padding:0.6rem 1.5rem;border-radius:10px;cursor:pointer;font-weight:600}
</style></head><body>
<div class="box">
<h2>🔒 此页面为私密页面</h2>
<form method="get">
<input type="password" name="pass" placeholder="请输入密码" autofocus>
<br><button type="submit">解锁</button>
</form>
</div></body></html>`, 200, { "Cache-Control": PRIVATE_PAGE_CACHE, "Vary": VARY_ENCODING });
    }
  }

  // ---- view counter ----
  const auth = c.req.header("Authorization") || "";
  const isPreview = auth.replace("Bearer ", "") !== "";
  if (!isPreview) {
    c.executionCtx.waitUntil(
      c.env.DB.prepare(
        `INSERT INTO pages (path, title, risk, owner, expires_at, description, cover, status, views, created_at, updated_at)
         VALUES (?, ?, '', 'admin', 0, '', '', 'approved', 1, ?, ?)
         ON CONFLICT(path) DO UPDATE SET views = views + 1`
      ).bind(path, path, now, now).run()
    );
  }

  // ---- Open Graph / share card meta ----
  const absoluteUrl = `${url.origin}/${path}`;
  const tags = buildMetaTags(
    String(meta?.title || path),
    String(meta?.description || ""),
    String(meta?.cover || ""),
    absoluteUrl
  );
  const finalHtml = injectMeta(content, tags);

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-hashes'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  const cacheControl = meta?.password ? PRIVATE_PAGE_CACHE : PUBLIC_PAGE_CACHE;

  return c.html(finalHtml, 200, {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Security-Policy": csp,
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "no-referrer",
    "Cache-Control": cacheControl,
    "Vary": VARY_ENCODING,
  });
});

export default app;
