export const LANDING_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>HTML Host — 轻量级 HTML 页面托管</title>
<style>
:root{
  --bg:#0b0d14;--panel:rgba(255,255,255,.04);--panel-2:rgba(255,255,255,.06);
  --border:rgba(255,255,255,.08);--border-hi:rgba(124,92,252,.35);
  --text:#f2f3f7;--muted:#9aa0b4;--faint:#626880;
  --purple:#8b6dff;--cyan:#4dd6ff;--pink:#ff6b9d;
  --radius:18px;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;
  background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
body::before{content:'';position:fixed;inset:0;z-index:-2;
  background:
    radial-gradient(900px 500px at 15% -10%,rgba(139,109,255,.18),transparent 60%),
    radial-gradient(700px 400px at 85% 10%,rgba(77,214,255,.12),transparent 55%),
    radial-gradient(700px 500px at 50% 110%,rgba(255,107,157,.1),transparent 60%);
}
body::after{content:'';position:fixed;inset:0;z-index:-1;opacity:.35;
  background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);
  background-size:56px 56px;
  mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,#000,transparent);
}

.wrap{max-width:1020px;margin:0 auto;padding:0 1.5rem}

nav{display:flex;align-items:center;justify-content:space-between;
  padding:1.6rem 0}
.logo{display:flex;align-items:center;gap:.6rem;font-weight:700;font-size:1rem}
.logo-mark{width:32px;height:32px;border-radius:9px;
  background:linear-gradient(135deg,var(--purple),var(--pink));
  display:flex;align-items:center;justify-content:center;font-size:.95rem;
  box-shadow:0 4px 16px rgba(139,109,255,.4)}
.nav-links{display:flex;gap:1.5rem;align-items:center}
.nav-links a{color:var(--muted);text-decoration:none;font-size:.88rem;transition:.2s}
.nav-links a:hover{color:var(--text)}

.hero{text-align:center;padding:5.5rem 0 3.5rem}
.badge{display:inline-flex;align-items:center;gap:.45rem;padding:.4rem 1rem;
  border-radius:100px;background:var(--panel-2);border:1px solid var(--border);
  color:var(--purple);font-size:.8rem;font-weight:600;margin-bottom:1.8rem;
  backdrop-filter:blur(10px)}
.badge .dot{width:6px;height:6px;border-radius:50%;background:var(--cyan);
  box-shadow:0 0 8px var(--cyan)}
h1{font-size:clamp(2.4rem,5.5vw,3.6rem);font-weight:800;line-height:1.15;
  letter-spacing:-.02em;margin-bottom:1.25rem}
h1 .grad{background:linear-gradient(120deg,#fff 20%,var(--purple) 60%,var(--cyan));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent}
.subtitle{font-size:1.12rem;color:var(--muted);max-width:540px;margin:0 auto 2.5rem;
  line-height:1.75}
.cta{display:flex;gap:.8rem;justify-content:center;flex-wrap:wrap}
.btn{padding:.85rem 1.8rem;border-radius:13px;font-size:.95rem;font-weight:600;
  text-decoration:none;transition:.22s;display:inline-flex;align-items:center;gap:.5rem}
.btn-primary{background:linear-gradient(135deg,var(--purple),#6a4be0);color:#fff;
  box-shadow:0 8px 24px rgba(139,109,255,.35)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(139,109,255,.5)}
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
.card{background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);
  padding:1.6rem;backdrop-filter:blur(12px);transition:.22s;position:relative;overflow:hidden}
.card::before{content:'';position:absolute;inset:0 0 auto 0;height:1px;
  background:linear-gradient(90deg,transparent,var(--border-hi),transparent);opacity:0;transition:.22s}
.card:hover{transform:translateY(-3px);border-color:var(--border-hi);background:var(--panel-2)}
.card:hover::before{opacity:1}
.card-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;
  justify-content:center;font-size:1.25rem;margin-bottom:1rem;
  background:rgba(139,109,255,.12);border:1px solid rgba(139,109,255,.2)}
.card h3{font-size:1rem;font-weight:600;margin-bottom:.5rem}
.card p{font-size:.87rem;color:var(--muted);line-height:1.65}

footer{border-top:1px solid var(--border);padding:2rem 0;text-align:center;
  color:var(--faint);font-size:.82rem}
footer a{color:var(--purple);text-decoration:none}
</style>
</head>
<body>
<nav class="wrap">
  <div class="logo"><div class="logo-mark">⚡</div>HTML Host</div>
  <div class="nav-links">
    <a href="#features">功能</a>
    <a href="/_admin">管理面板</a>
  </div>
</nav>

<header class="hero wrap">
  <div class="badge"><span class="dot"></span>Powered by Cloudflare Workers</div>
  <h1>把 HTML 变成<br><span class="grad">全球可访问的页面</span></h1>
  <p class="subtitle">轻量级自托管 HTML 页面发布服务。上传文件、自定义路径、即刻上线，无需 Git、无需构建。</p>
  <div class="cta">
    <a href="/_admin" class="btn btn-primary">进入管理面板 →</a>
    <a href="#features" class="btn btn-ghost">查看功能</a>
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
    <div class="card"><div class="card-icon">🔗</div><h3>自定义路径</h3><p>任意 URL 路径，支持多级目录，如 /blog/post-1、/docs/guide。</p></div>
    <div class="card"><div class="card-icon">✏️</div><h3>在线编辑</h3><p>内置编辑器随时修改已发布页面，保存即时生效，无需重新部署。</p></div>
    <div class="card"><div class="card-icon">🔒</div><h3>密码保护</h3><p>每页可设独立密码，私密页面凭密码访问，链接不公开。</p></div>
    <div class="card"><div class="card-icon">📊</div><h3>访问统计</h3><p>自动记录浏览量，面板展示页面总数、总浏览量与私密页面数。</p></div>
    <div class="card"><div class="card-icon">🛡️</div><h3>风险扫描</h3><p>上传时自动识别脚本、表单、iframe 等风险项并分级标记。</p></div>
  </div>
</section>

<footer>
  HTML Host · 基于 Cloudflare Workers + KV + D1 构建 · <a href="https://github.com/creazl/html-host">GitHub</a>
</footer>
</body>
</html>`;
