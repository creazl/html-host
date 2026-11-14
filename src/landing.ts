export const LANDING_HTML = `<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark-purple">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>HTML Host — 轻量级 HTML 页面托管</title>
<style>
:root, [data-theme="dark-purple"]{
  --bg:#0b0d14;--panel:rgba(255,255,255,.04);--panel-2:rgba(255,255,255,.06);
  --border:rgba(255,255,255,.08);--border-hi:rgba(124,92,252,.35);
  --text:#f2f3f7;--muted:#9aa0b4;--faint:#626880;
  --primary:#8b6dff;--primary-2:#a78bff;--accent:#4dd6ff;--pink:#ff6b9d;
}
[data-theme="dark-cyan"]{
  --bg:#071014;--panel:rgba(255,255,255,.04);--panel-2:rgba(255,255,255,.06);
  --border:rgba(255,255,255,.08);--border-hi:rgba(77,214,255,.35);
  --text:#eef6f8;--muted:#8fa6ad;--faint:#5a7078;
  --primary:#2ec4e6;--primary-2:#66d8f0;--accent:#8b6dff;--pink:#ff6b9d;
}
[data-theme="light"]{
  --bg:#f6f7fb;--panel:rgba(255,255,255,.72);--panel-2:#ffffff;
  --border:rgba(15,23,42,.1);--border-hi:rgba(124,92,252,.35);
  --text:#0f172a;--muted:#55607a;--faint:#8a93a8;
  --primary:#6a4be0;--primary-2:#7c5cfc;--accent:#0ea5c4;--pink:#e0487a;
}
[data-theme="oled"]{
  --bg:#000000;--panel:rgba(255,255,255,.03);--panel-2:rgba(255,255,255,.05);
  --border:rgba(255,255,255,.1);--border-hi:rgba(139,109,255,.4);
  --text:#f5f5f7;--muted:#8a8a96;--faint:#55555f;
  --primary:#8b6dff;--primary-2:#a78bff;--accent:#4dd6ff;--pink:#ff6b9d;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;
  background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden;
  -webkit-font-smoothing:antialiased;transition:background .3s,color .3s;
}
body::before{content:'';position:fixed;inset:0;z-index:-2;
  background:
    radial-gradient(900px 500px at 15% -10%,color-mix(in srgb,var(--primary) 18%,transparent),transparent 60%),
    radial-gradient(700px 400px at 85% 10%,color-mix(in srgb,var(--accent) 12%,transparent),transparent 55%),
    radial-gradient(700px 500px at 50% 110%,color-mix(in srgb,var(--pink) 10%,transparent),transparent 60%);
}
body::after{content:'';position:fixed;inset:0;z-index:-1;opacity:.3;
  background-image:linear-gradient(color-mix(in srgb,var(--text) 3.5%,transparent) 1px,transparent 1px),
    linear-gradient(90deg,color-mix(in srgb,var(--text) 3.5%,transparent) 1px,transparent 1px);
  background-size:56px 56px;
  mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,#000,transparent);
}

.wrap{max-width:1020px;margin:0 auto;padding:0 1.5rem}

nav{display:flex;align-items:center;justify-content:space-between;
  padding:1.6rem 0;gap:1rem;flex-wrap:wrap}
.logo{display:flex;align-items:center;gap:.6rem;font-weight:700;font-size:1rem}
.logo-mark{width:32px;height:32px;border-radius:9px;
  background:linear-gradient(135deg,var(--primary),var(--pink));
  display:flex;align-items:center;justify-content:center;font-size:.95rem;
  box-shadow:0 4px 16px color-mix(in srgb,var(--primary) 40%,transparent)}
.nav-links{display:flex;gap:1.2rem;align-items:center}
.nav-links a{color:var(--muted);text-decoration:none;font-size:.88rem;transition:.2s}
.nav-links a:hover{color:var(--text)}

.theme-select{background:var(--panel);border:1px solid var(--border);color:var(--text);
  border-radius:10px;padding:.45rem .7rem;font-size:.82rem;outline:none;cursor:pointer}

.hero{text-align:center;padding:5.5rem 0 3.5rem}
.badge{display:inline-flex;align-items:center;gap:.45rem;padding:.4rem 1rem;
  border-radius:100px;background:var(--panel-2);border:1px solid var(--border);
  color:var(--primary);font-size:.8rem;font-weight:600;margin-bottom:1.8rem;
  backdrop-filter:blur(10px)}
.badge .dot{width:6px;height:6px;border-radius:50%;background:var(--accent);
  box-shadow:0 0 8px var(--accent)}
h1{font-size:clamp(2.4rem,5.5vw,3.6rem);font-weight:800;line-height:1.15;
  letter-spacing:-.02em;margin-bottom:1.25rem}
h1 .grad{background:linear-gradient(120deg,var(--text) 20%,var(--primary) 60%,var(--accent));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent}
.subtitle{font-size:1.12rem;color:var(--muted);max-width:540px;margin:0 auto 2.5rem;
  line-height:1.75}
.cta{display:flex;gap:.8rem;justify-content:center;flex-wrap:wrap}
.btn{padding:.85rem 1.8rem;border-radius:13px;font-size:.95rem;font-weight:600;
  text-decoration:none;transition:.22s;display:inline-flex;align-items:center;gap:.5rem}
.btn-primary{background:linear-gradient(135deg,var(--primary),#6a4be0);color:#fff;
  box-shadow:0 8px 24px color-mix(in srgb,var(--primary) 35%,transparent)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 32px color-mix(in srgb,var(--primary) 50%,transparent)}
.btn-ghost{background:var(--panel);border:1px solid var(--border);color:var(--text);
  backdrop-filter:blur(10px)}
.btn-ghost:hover{border-color:var(--border-hi);background:var(--panel-2)}

.strip{display:flex;justify-content:center;gap:2.5rem;margin-top:3rem;flex-wrap:wrap}
.strip-item{text-align:center}
.strip-num{font-size:1.5rem;font-weight:800;font-variant-numeric:tabular-nums}
.strip-label{font-size:.78rem;color:var(--faint);margin-top:.2rem}

.features{padding:3rem 0 5rem}
.features h2{text-align:center;font-size:1.7rem;font-weight:700;margin-bottom:.8rem}
.features .lead{text-align:center;color:var(--muted);font-size:.95rem;margin-bottom:2.5rem}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1rem}
.card{background:var(--panel);border:1px solid var(--border);border-radius:18px;
  padding:1.6rem;backdrop-filter:blur(12px);transition:.22s;position:relative;overflow:hidden}
.card::before{content:'';position:absolute;inset:0 0 auto 0;height:1px;
  background:linear-gradient(90deg,transparent,var(--border-hi),transparent);opacity:0;transition:.22s}
.card:hover{transform:translateY(-3px);border-color:var(--border-hi);background:var(--panel-2)}
.card:hover::before{opacity:1}
.card-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;
  justify-content:center;font-size:1.25rem;margin-bottom:1rem;
  background:color-mix(in srgb,var(--primary) 12%,transparent);border:1px solid color-mix(in srgb,var(--primary) 20%,transparent)}
.card h3{font-size:1rem;font-weight:600;margin-bottom:.5rem}
.card p{font-size:.87rem;color:var(--muted);line-height:1.65}

footer{border-top:1px solid var(--border);padding:2rem 0;text-align:center;
  color:var(--faint);font-size:.82rem}
footer a{color:var(--primary);text-decoration:none}

@media(max-width:640px){
  .wrap{padding:0 1.4rem}
  nav{flex-direction:column;align-items:flex-start;gap:.9rem;padding:1.2rem 0}
  .nav-links{width:100%;flex-wrap:wrap;gap:.9rem}
  .hero{padding:3rem 0 2.5rem}
  h1{font-size:clamp(2rem,8.5vw,2.6rem)}
  .subtitle{font-size:1rem;padding:0 .2rem}
  .cta{gap:.7rem}
  .btn{padding:.8rem 1.4rem}
  .strip{gap:1.4rem;margin-top:2.2rem}
  .features{padding:2rem 0 3.5rem}
  .grid{gap:.85rem}
  .card{padding:1.35rem}
  .card-icon{width:40px;height:40px;font-size:1.15rem;margin-bottom:.8rem}
}
</style>
</head>
<body>
<nav class="wrap">
  <div class="logo"><div class="logo-mark">⚡</div>HTML Host</div>
  <div class="nav-links">
    <select class="theme-select" id="themeSelect" onchange="applyTheme(this.value)">
      <option value="dark-purple">🌙 暗夜紫</option>
      <option value="dark-cyan">🌊 深海青</option>
      <option value="light">☀️ 明亮浅</option>
      <option value="oled">⬛ 纯黑 OLED</option>
    </select>
    <a href="#features">功能</a>
    <a href="/explore">目录</a>
    <a href="/upload">投稿</a>
    <a href="/_admin">管理面板</a>
  </div>
</nav>

<header class="hero wrap">
  <div class="badge"><span class="dot"></span>Powered by Cloudflare Workers</div>
  <h1>把 HTML 变成<br><span class="grad">全球可访问的页面</span></h1>
  <p class="subtitle">轻量级自托管 HTML 页面发布服务。上传文件、自定义路径、即刻上线，无需 Git、无需构建。</p>
  <div class="cta">
    <a href="/upload" class="btn btn-primary">立即投稿 →</a>
    <a href="/explore" class="btn btn-ghost">浏览目录</a>
  </div>
  <div class="strip">
    <div class="strip-item"><div class="strip-num">⚡ 边缘</div><div class="strip-label">全球节点加速</div></div>
    <div class="strip-item"><div class="strip-num">🆓 免费</div><div class="strip-label">个人额度够用</div></div>
    <div class="strip-item"><div class="strip-num">🔒 可控</div><div class="strip-label">密码与风险标记</div></div>
  </div>
</header>

<section class="features wrap" id="features">
  <h2>功能特性</h2>
  <p class="lead">从上传到上线，一个面板搞定</p>
  <div class="grid">
    <div class="card"><div class="card-icon">📤</div><h3>拖拽上传</h3><p>拖入 HTML 文件或直接编写代码，一键发布，自动生成访问链接。</p></div>
    <div class="card"><div class="card-icon">🔗</div><h3>自定义路径</h3><p>管理员可任意 URL 路径；访客投稿自动分配随机路径，30 天有效。</p></div>
    <div class="card"><div class="card-icon">✏️</div><h3>在线编辑</h3><p>内置编辑器随时修改已发布页面，保存即时生效，无需重新部署。</p></div>
    <div class="card"><div class="card-icon">🔒</div><h3>密码保护</h3><p>每页可设独立密码，私密页面凭密码访问，链接不公开。</p></div>
    <div class="card"><div class="card-icon">📊</div><h3>访问统计</h3><p>自动记录浏览量，面板展示页面总数、总浏览量与私密页面数。</p></div>
    <div class="card"><div class="card-icon">🛡️</div><h3>风险扫描</h3><p>上传时自动识别脚本、表单、iframe 等风险项并分级标记。</p></div>
  </div>
</section>

<footer>
  HTML Host · 基于 Cloudflare Workers + KV + D1 构建 · <a href="https://github.com/creazl/html-host">GitHub</a>
</footer>

<script>
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  try{ localStorage.setItem('hh-theme', t); }catch(e){}
}
(function(){
  let t = 'dark-purple';
  try{ t = localStorage.getItem('hh-theme') || t; }catch(e){}
  document.documentElement.setAttribute('data-theme', t);
  const sel = document.getElementById('themeSelect');
  if(sel) sel.value = t;
})();
</script>
</body>
</html>`;
