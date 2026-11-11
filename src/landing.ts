export const LANDING_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>HTML Host — 轻量级 HTML 页面托管</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;
  background:#0a0a12;color:#e8e8f0;min-height:100vh;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;z-index:-1;
  background:radial-gradient(ellipse 800px 500px at 30% 0%,rgba(124,92,252,.15),transparent),
             radial-gradient(ellipse 600px 400px at 80% 100%,rgba(77,214,255,.1),transparent)}
.hero{max-width:900px;margin:0 auto;padding:6rem 1.5rem 4rem;text-align:center}
.badge{display:inline-block;padding:.3rem 1rem;border-radius:100px;
  background:rgba(124,92,252,.15);color:#9078ff;font-size:.8rem;font-weight:600;
  border:1px solid rgba(124,92,252,.3);margin-bottom:1.5rem}
h1{font-size:3rem;font-weight:800;line-height:1.2;margin-bottom:1rem;
  background:linear-gradient(135deg,#fff 30%,#9078ff);-webkit-background-clip:text;
  -webkit-text-fill-color:transparent}
.subtitle{font-size:1.15rem;color:#7a7a9e;max-width:560px;margin:0 auto 2.5rem;line-height:1.7}
.cta{display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap}
.btn{padding:.8rem 1.8rem;border-radius:12px;font-size:.95rem;font-weight:600;
  text-decoration:none;transition:.2s;display:inline-block}
.btn-primary{background:linear-gradient(135deg,#7c5cfc,#5a3df0);color:#fff;
  box-shadow:0 4px 20px rgba(124,92,252,.3)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(124,92,252,.4)}
.btn-outline{border:1px solid #262645;color:#a0a0c0}
.btn-outline:hover{border-color:#7c5cfc;color:#fff}
.features{max-width:900px;margin:0 auto;padding:0 1.5rem 5rem}
.features h2{text-align:center;font-size:1.8rem;margin-bottom:2.5rem}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.25rem}
.card{background:linear-gradient(145deg,#16162a,#11111c);border:1px solid #262645;
  border-radius:16px;padding:1.5rem;transition:.2s}
.card:hover{border-color:rgba(124,92,252,.4);transform:translateY(-2px)}
.card-icon{font-size:1.8rem;margin-bottom:.8rem}
.card h3{font-size:1rem;margin-bottom:.5rem}
.card p{font-size:.85rem;color:#7a7a9e;line-height:1.6}
.footer{text-align:center;padding:2rem;color:#4a4a6a;font-size:.8rem;
  border-top:1px solid #1a1a2e}
.footer a{color:#7c5cfc;text-decoration:none}
@media(max-width:640px){h1{font-size:2rem}.hero{padding:4rem 1rem 2rem}}
</style>
</head>
<body>
<section class="hero">
  <div class="badge">⚡ Powered by Cloudflare Workers</div>
  <h1>HTML Host</h1>
  <p class="subtitle">轻量级 HTML 页面托管服务。上传你的 HTML 文件，自定义 URL 路径，几秒钟内发布到互联网。</p>
  <div class="cta">
    <a href="/_admin" class="btn btn-primary">进入管理面板</a>
    <a href="https://github.com/creazl/html-host" class="btn btn-outline">GitHub</a>
  </div>
</section>
<section class="features">
  <h2>✨ 功能特性</h2>
  <div class="grid">
    <div class="card"><div class="card-icon">📤</div><h3>拖拽上传</h3><p>直接拖入 HTML 文件，或在编辑器中编写代码，一键发布。</p></div>
    <div class="card"><div class="card-icon">🔗</div><h3>自定义路径</h3><p>任意 URL 路径，支持多级目录，如 /blog/post-1。</p></div>
    <div class="card"><div class="card-icon">🔒</div><h3>密码保护</h3><p>每页可设独立密码，私密页面仅授权用户可访问。</p></div>
    <div class="card"><div class="card-icon">👁</div><h3>访问统计</h3><p>自动统计每个页面的浏览量，管理面板一目了然。</p></div>
    <div class="card"><div class="card-icon">⚡</div><h3>全球加速</h3><p>基于 Cloudflare 全球边缘网络，毫秒级响应。</p></div>
    <div class="card"><div class="card-icon">🆓</div><h3>免费使用</h3><p>免费额度足够个人使用，无需信用卡。</p></div>
  </div>
</section>
<div class="footer">
  HTML Host · 基于 Cloudflare Workers + KV + D1 构建
</div>
</body>
</html>`;
