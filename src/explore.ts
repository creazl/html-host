export const EXPLORE_HTML = `<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark-purple">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>浏览目录 · HTML Host</title>
<style>
:root, [data-theme="dark-purple"]{
  --bg:#0b0d14;--panel:rgba(255,255,255,.04);--panel-2:rgba(255,255,255,.07);
  --border:rgba(255,255,255,.09);--border-hi:rgba(139,109,255,.4);
  --text:#f2f3f7;--muted:#9aa0b4;--faint:#626880;
  --primary:#8b6dff;--primary-2:#a78bff;--accent:#4dd6ff;--pink:#ff6b9d;
  --green:#3ddc97;--yellow:#ffd166;--red:#ff5c7c;
}
[data-theme="dark-cyan"]{
  --bg:#071014;--panel:rgba(255,255,255,.04);--panel-2:rgba(255,255,255,.06);
  --border:rgba(255,255,255,.08);--border-hi:rgba(77,214,255,.35);
  --text:#eef6f8;--muted:#8fa6ad;--faint:#5a7078;
  --primary:#2ec4e6;--primary-2:#66d8f0;--accent:#8b6dff;--pink:#ff6b9d;
  --green:#3ddc97;--yellow:#ffd166;--red:#ff5c7c;
}
[data-theme="light"]{
  --bg:#f6f7fb;--panel:rgba(255,255,255,.72);--panel-2:#ffffff;
  --border:rgba(15,23,42,.1);--border-hi:rgba(124,92,252,.35);
  --text:#0f172a;--muted:#55607a;--faint:#8a93a8;
  --primary:#6a4be0;--primary-2:#7c5cfc;--accent:#0ea5c4;--pink:#e0487a;
  --green:#16a373;--yellow:#c98a00;--red:#e0486a;
}
[data-theme="oled"]{
  --bg:#000000;--panel:rgba(255,255,255,.03);--panel-2:rgba(255,255,255,.05);
  --border:rgba(255,255,255,.1);--border-hi:rgba(139,109,255,.4);
  --text:#f5f5f7;--muted:#8a8a96;--faint:#55555f;
  --primary:#8b6dff;--primary-2:#a78bff;--accent:#4dd6ff;--pink:#ff6b9d;
  --green:#3ddc97;--yellow:#ffd166;--red:#ff5c7c;
}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;
  background:var(--bg);color:var(--text);min-height:100vh;-webkit-font-smoothing:antialiased;transition:background .3s,color .3s}
body::before{content:'';position:fixed;inset:0;z-index:-1;
  background:radial-gradient(800px 400px at 20% -10%,color-mix(in srgb,var(--primary) 14%,transparent),transparent 60%),
             radial-gradient(600px 300px at 85% 100%,color-mix(in srgb,var(--accent) 8%,transparent),transparent 55%)}
.wrap{max-width:1020px;margin:0 auto;padding:1.5rem}
nav{display:flex;align-items:center;justify-content:space-between;padding:1rem 0 1.5rem}
.logo{display:flex;align-items:center;gap:.6rem;font-weight:700}
.logo-mark{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,var(--primary),var(--pink));
  display:flex;align-items:center;justify-content:center;font-size:.9rem}
.nav-links{display:flex;gap:1rem;align-items:center;flex-wrap:wrap}
.nav-links a{color:var(--muted);text-decoration:none;font-size:.88rem}
.nav-links a:hover{color:var(--text)}
.nav-links a.active{color:var(--primary-2);font-weight:600}
.theme-select{background:var(--panel);border:1px solid var(--border);color:var(--text);
  border-radius:10px;padding:.45rem .7rem;font-size:.82rem;outline:none;cursor:pointer}
.theme-select option{background:var(--bg);color:var(--text)}

.head{margin-bottom:1.5rem}
.head h1{font-size:1.5rem;font-weight:800;margin-bottom:.35rem}
.head p{color:var(--muted);font-size:.9rem}
.search-wrap{position:relative;margin:1.2rem 0}
.search-wrap svg{position:absolute;left:.9rem;top:50%;transform:translateY(-50%);
  width:16px;height:16px;color:var(--faint)}
.search-wrap input{width:100%;padding:.75rem 1rem .75rem 2.6rem;border-radius:12px;
  border:1px solid var(--border);background:var(--panel);color:var(--text);
  font-size:.9rem;outline:none;transition:.2s}
.search-wrap input:focus{border-color:var(--primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--primary) 18%,transparent)}

.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem}
.card{background:var(--panel);border:1px solid var(--border);border-radius:18px;
  overflow:hidden;text-decoration:none;color:var(--text);display:flex;flex-direction:column;
  transition:.2s;backdrop-filter:blur(12px)}
.card:hover{transform:translateY(-3px);border-color:var(--border-hi);background:var(--panel-2)}
.cover{width:100%;height:150px;object-fit:cover;display:block;background:var(--panel-2)}
.card-body{padding:1.1rem 1.2rem;display:flex;flex-direction:column;gap:.5rem;flex:1}
.card-title-row{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}
.card-title{font-weight:600;font-size:.98rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:.65rem;padding:.18rem .55rem;border-radius:7px;font-weight:600}
.badge-safe{background:color-mix(in srgb,var(--green) 13%,transparent);color:var(--green)}
.badge-medium{background:color-mix(in srgb,var(--yellow) 15%,transparent);color:var(--yellow)}
.badge-high{background:color-mix(in srgb,var(--red) 15%,transparent);color:var(--red)}
.badge-public{background:color-mix(in srgb,var(--accent) 13%,transparent);color:var(--accent)}
.badge-admin{background:var(--panel-2);color:var(--muted)}
.card-path{font-size:.78rem;color:var(--faint);word-break:break-all}
.card-desc{font-size:.82rem;color:var(--muted);line-height:1.6;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.card-foot{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:.6rem}
.views{font-size:.75rem;color:var(--muted)}
.qr{width:64px;height:64px;border-radius:8px;background:#fff;padding:4px;flex-shrink:0}

.empty{text-align:center;padding:4rem 2rem;color:var(--muted)}
.empty-icon{font-size:2.6rem;margin-bottom:.8rem;opacity:.5}
.empty p{font-size:.9rem}

.toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(10px);
  background:var(--panel-2);padding:.7rem 1.3rem;border-radius:11px;border:1px solid var(--border);
  font-size:.85rem;opacity:0;transition:.3s;z-index:200}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

@media(max-width:640px){
  .wrap{padding:1.1rem}
  .grid{grid-template-columns:1fr}
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
    <a href="/">首页</a>
    <a href="/upload">投稿</a>
    <a href="/explore" class="active">目录</a>
  </div>
</nav>

<main class="wrap">
  <div class="head">
    <h1>📚 浏览全部页面</h1>
    <p>公开可访问的页面汇集于此，私密与已下架页面不会出现在目录中。</p>
    <div class="search-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input type="text" id="search" placeholder="搜索标题、路径或描述..." oninput="onSearchInput()">
    </div>
  </div>
  <div class="grid" id="grid"></div>
  <div class="empty" id="emptyBox" style="display:none">
    <div class="empty-icon">🔍</div>
    <p id="emptyText">加载中…</p>
  </div>
</main>

<div class="toast" id="toast"></div>

<script>
var QR_API='https://api.qrserver.com/v1/create-qr-code/?size=128x128&margin=2&data=';
var allPages=[];

function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  try{ localStorage.setItem('hh-theme', t); }catch(e){}
}
(function(){
  var t='dark-purple';
  try{ t=localStorage.getItem('hh-theme')||t; }catch(e){}
  document.documentElement.setAttribute('data-theme', t);
  var sel=document.getElementById('themeSelect');
  if(sel) sel.value=t;
})();

function esc(s){
  return String(s==null?'':s).replace(/[&<>"']/g,function(ch){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
  });
}
function qrUrl(path){ return QR_API+encodeURIComponent(location.origin+'/'+path); }
function riskBadge(risk){
  if(risk==='high') return '<span class="badge badge-high">⚠ 高风险</span>';
  if(risk==='medium') return '<span class="badge badge-medium">◐ 中风险</span>';
  return '<span class="badge badge-safe">✓ 安全</span>';
}
function ownerBadge(owner){
  if(owner==='public') return '<span class="badge badge-public">🌐 投稿</span>';
  return '<span class="badge badge-admin">📌 管理员</span>';
}

function renderList(){
  var q=document.getElementById('search').value.toLowerCase();
  var filtered=allPages.filter(function(p){
    return p.path.toLowerCase().indexOf(q)>=0 ||
      (p.title||'').toLowerCase().indexOf(q)>=0 ||
      (p.description||'').toLowerCase().indexOf(q)>=0;
  });
  var grid=document.getElementById('grid');
  var empty=document.getElementById('emptyBox');
  if(!filtered.length){
    grid.innerHTML='';
    empty.style.display='block';
    document.getElementById('emptyText').textContent=allPages.length?'没有匹配「'+q+'」的页面':'目录还没有公开页面';
    return;
  }
  empty.style.display='none';
  grid.innerHTML=filtered.map(function(p){
    var cover=p.cover?'<img class="cover" src="'+esc(p.cover)+'" alt="" loading="lazy">':'';
    var desc=p.description?'<div class="card-desc">'+esc(p.description)+'</div>':'';
    return '<a class="card" href="/'+esc(p.path)+'" target="_blank" rel="noopener">'+cover+
      '<div class="card-body">'+
        '<div class="card-title-row">'+
          '<div class="card-title">'+esc(p.title||p.path)+'</div>'+
          ownerBadge(p.owner)+riskBadge(p.risk)+
        '</div>'+
        '<div class="card-path">/'+esc(p.path)+'</div>'+desc+
        '<div class="card-foot">'+
          '<span class="views">👁 '+(p.views||0)+' 次浏览</span>'+
          '<img class="qr" src="'+esc(qrUrl(p.path))+'" alt="分享二维码" loading="lazy">'+
        '</div>'+
      '</div></a>';
  }).join('');
}

var searchTimer;
function onSearchInput(){ clearTimeout(searchTimer); searchTimer=setTimeout(renderList,150); }

async function loadDirectory(){
  try{
    var r=await fetch('/_api/public/directory');
    var d=await r.json();
    allPages=d.pages||[];
    renderList();
  }catch(e){
    document.getElementById('grid').innerHTML='';
    var empty=document.getElementById('emptyBox');
    empty.style.display='block';
    document.getElementById('emptyText').textContent='目录加载失败，请刷新重试';
  }
}
loadDirectory();

var toastTimer;
function toast(msg){
  var t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){t.classList.remove('show')},2500);
}
</script>
</body>
</html>`;