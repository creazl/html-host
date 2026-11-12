import { Hono } from "hono";
import { cors } from "hono/cors";
import { ADMIN_HTML } from "./admin";
import { LANDING_HTML } from "./landing";

type Bindings = {
  PAGES_KV: KVNamespace;
  DB: D1Database;
  ADMIN_PASSWORD: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

// ---------- helpers ----------

function sanitizePath(p: string): string {
  return p.replace(/^\/+|\/+$/g, "").replace(/[^a-zA-Z0-9-_\/]/g, "-");
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

// ---------- landing page ----------

app.get("/", (c) => c.html(LANDING_HTML));

// ---------- admin panel ----------

app.get("/_admin", (c) => c.html(ADMIN_HTML));

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

// ---------- API: list pages ----------

app.get("/_api/list", async (c) => {
  if (!(await isAdmin(c))) return c.json({ error: "未授权" }, 401);
  const { results } = await c.env.DB.prepare(
    `SELECT path, title, views, created_at, updated_at, risk,
            password != '' as has_password
     FROM pages ORDER BY updated_at DESC`
  ).all();
  return c.json({ pages: results });
});

// ---------- API: get page content ----------

app.get("/_api/page/:path{.+}", async (c) => {
  if (!(await isAdmin(c))) return c.json({ error: "未授权" }, 401);
  const path = sanitizePath(c.req.param("path"));
  const content = await c.env.PAGES_KV.get(`page:${path}`);
  if (content === null) return c.json({ error: "页面不存在" }, 404);
  const meta = await c.env.DB.prepare(
    "SELECT path, title, password, views, risk, created_at, updated_at FROM pages WHERE path = ?"
  ).bind(path).first();
  return c.json({ path, content, meta });
});

// ---------- API: upload / save ----------

app.post("/_api/upload", async (c) => {
  if (!(await isAdmin(c))) return c.json({ error: "未授权" }, 401);
  const body = await c.req.json().catch(() => ({}));
  let { path, title, content, password } = body;
  path = sanitizePath(path || "");
  if (!path) return c.json({ error: "请填写 URL 路径" }, 400);
  if (!content) return c.json({ error: "内容不能为空" }, 400);

  // safety scan
  const { risk, warnings } = scanHtml(content);

  const now = Math.floor(Date.now() / 1000);
  await c.env.PAGES_KV.put(`page:${path}`, content);

  await c.env.DB.prepare(
    `INSERT INTO pages (path, title, password, risk, views, created_at, updated_at)
     VALUES (?, ?, ?, ?, COALESCE((SELECT views FROM pages WHERE path = ?), 0), ?, ?)
     ON CONFLICT(path) DO UPDATE SET title=?, password=?, risk=?, updated_at=?`
  ).bind(path, title || path, password || "", risk, path, now, now,
        title || path, password || "", risk, now).run();

  return c.json({ ok: true, path, url: `/${path}`, risk, warnings });
});

// ---------- API: delete page ----------

app.delete("/_api/page/:path{.+}", async (c) => {
  if (!(await isAdmin(c))) return c.json({ error: "未授权" }, 401);
  const path = sanitizePath(c.req.param("path"));
  await c.env.PAGES_KV.delete(`page:${path}`);
  await c.env.DB.prepare("DELETE FROM pages WHERE path = ?").bind(path).run();
  return c.json({ ok: true });
});

// ---------- render page (catch-all) ----------

app.get("/*", async (c) => {
  const url = new URL(c.req.url);
  const path = sanitizePath(url.pathname.replace(/^\/+/, ""));
  if (!path) {
    return c.html(LANDING_HTML);
  }

  const content = await c.env.PAGES_KV.get(`page:${path}`);
  if (content === null) return c.notFound();

  const meta = await c.env.DB.prepare(
    "SELECT password, views, risk FROM pages WHERE path = ?"
  ).bind(path).first();

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
</div></body></html>`);
    }
  }

  // ---- view counter (fixed) ----
  // Skip counting when admin previews (Authorization header present)
  const auth = c.req.header("Authorization") || "";
  const isPreview = auth.replace("Bearer ", "") !== "";
  if (!isPreview) {
    // Ensure the row exists, then increment. Use waitUntil so the write
    // survives after the response is sent back.
    c.executionCtx.waitUntil(
      c.env.DB.prepare(
        `INSERT INTO pages (path, title, risk, views, created_at, updated_at)
         VALUES (?, ?, '', 1, ?, ?)
         ON CONFLICT(path) DO UPDATE SET views = views + 1`
      ).bind(path, path, Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000)).run()
    );
  }

  // CSP: allow self + inline (admin's own HTML commonly uses inline JS/CSS),
  // but block plugins, restrict object/base/referrer to reduce abuse.
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

  return c.html(content, 200, {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Security-Policy": csp,
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "no-referrer",
    "Cache-Control": "public, max-age=0, must-revalidate",
  });
});

export default app;
