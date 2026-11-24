export const UPLOAD_HTML = `<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark-purple">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>投稿 · HTML Host</title>
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
body{font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;
  background:var(--bg);color:var(--text);min-height:100vh;-webkit-font-smoothing:antialiased;transition:background .3s,color .3s}
body::before{content:'';position:fixed;inset:0;z-index:-1;
  background:radial-gradient(800px 400px at 20% -10%,color-mix(in srgb,var(--primary) 14%,transparent),transparent 60%),
             radial-gradient(600px 300px at 85% 100%,color-mix(in srgb,var(--accent) 8%,transparent),transparent 55%)}
.wrap{max-width:760px;margin:0 auto;padding:1.5rem}
nav{display:flex;align-items:center;justify-content:space-between;padding:1rem 0 1.5rem}
.logo{display:flex;align-items:center;gap:.6rem;font-weight:700}
.logo-mark{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,var(--primary),var(--pink));
  display:flex;align-items:center;justify-content:center;font-size:.9rem}
.nav-links{display:flex;gap:1rem;align-items:center}
.nav-links a{color:var(--muted);text-decoration:none;font-size:.88rem}
.nav-links a:hover{color:var(--text)}
.theme-select{background:var(--panel);border:1px solid var(--border);color:var(--text);
  border-radius:10px;padding:.45rem .7rem;font-size:.82rem;outline:none;cursor:pointer}
.theme-select option{background:var(--bg);color:var(--text)}

.card{background:var(--panel);border:1px solid var(--border);border-radius:20px;
  padding:1.8rem;backdrop-filter:blur(12px)}
h1{font-size:1.5rem;font-weight:800;margin-bottom:.4rem}
.sub{color:var(--muted);font-size:.9rem;line-height:1.7;margin-bottom:1.5rem}
.notice{background:color-mix(in srgb,var(--yellow) 10%,transparent);border:1px solid color-mix(in srgb,var(--yellow) 30%,transparent);
  color:var(--yellow);border-radius:12px;padding:.8rem 1rem;font-size:.8rem;line-height:1.6;margin-bottom:1.5rem}

.drop-zone{border:2px dashed var(--border);border-radius:14px;padding:1.5rem;text-align:center;
  color:var(--muted);cursor:pointer;margin-bottom:1rem;transition:.2s}
.drop-zone:hover,.drop-zone.dragover{border-color:var(--primary);color:var(--primary-2);
  background:color-mix(in srgb,var(--primary) 5%,transparent)}
.drop-zone svg{width:28px;height:28px;margin-bottom:.5rem;opacity:.5}

.form-group{margin-bottom:1rem}
.form-group label{display:block;font-size:.75rem;color:var(--muted);margin-bottom:.35rem;font-weight:500}
.form-group input,.form-group textarea{width:100%;padding:.7rem .95rem;border-radius:12px;
  border:1px solid var(--border);background:color-mix(in srgb,var(--bg) 60%,transparent);
  color:var(--text);font-size:.9rem;outline:none;transition:.2s}
.form-group input:focus,.form-group textarea:focus{border-color:var(--primary);
  box-shadow:0 0 0 3px color-mix(in srgb,var(--primary) 18%,transparent)}
.form-group textarea{font-family:'SF Mono',Monaco,Consolas,monospace;font-size:.8rem;
  line-height:1.6;min-height:260px;resize:vertical;tab-size:2}

.risk-box{border-radius:11px;padding:.85rem 1rem;margin-bottom:1rem;font-size:.82rem;line-height:1.6;display:none}
.risk-box.warn-medium{display:block;background:color-mix(in srgb,var(--yellow) 10%,transparent);
  border:1px solid color-mix(in srgb,var(--yellow) 30%,transparent);color:var(--yellow)}
.risk-box.warn-high{display:block;background:color-mix(in srgb,var(--red) 10%,transparent);
  border:1px solid color-mix(in srgb,var(--red) 30%,transparent);color:var(--red)}
.risk-box ul{margin:.3rem 0 0 1.1rem}

.tool-row{display:flex;gap:.5rem;align-items:center;flex-wrap:wrap;margin-bottom:.6rem}
.tool-btn{background:var(--panel);border:1px solid var(--border);color:var(--muted);
  border-radius:9px;padding:.4rem .8rem;font-size:.78rem;cursor:pointer;transition:.15s}
.tool-btn:hover{color:var(--text);border-color:var(--muted)}
.row{display:flex;gap:.75rem;justify-content:space-between;align-items:center;flex-wrap:wrap}
.btn{padding:.75rem 1.5rem;border:none;border-radius:12px;font-size:.9rem;font-weight:600;
  cursor:pointer;transition:.2s;display:inline-flex;align-items:center;gap:.4rem}
.btn-primary{background:linear-gradient(135deg,var(--primary),#6a4be0);color:#fff}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 20px color-mix(in srgb,var(--primary) 35%,transparent)}
.hint{font-size:.75rem;color:var(--faint)}

.result{display:none;margin-top:1.5rem;padding:1.3rem;border-radius:14px;
  background:var(--panel-2);border:1px solid var(--border)}
.result.show{display:block;animation:fadeIn .25s}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.result h3{font-size:1rem;margin-bottom:.6rem}
.result-link{display:flex;gap:.5rem;align-items:center;flex-wrap:wrap}
.result-link a{color:var(--accent);text-decoration:none;font-weight:600;word-break:break-all}
.copy-btn{background:var(--panel);border:1px solid var(--border);color:var(--muted);
  border-radius:8px;padding:.35rem .7rem;font-size:.78rem;cursor:pointer}
.badge{font-size:.68rem;padding:.2rem .6rem;border-radius:7px;font-weight:600}
.badge-safe{background:color-mix(in srgb,var(--green) 13%,transparent);color:var(--green)}
.badge-medium{background:color-mix(in srgb,var(--yellow) 15%,transparent);color:var(--yellow)}
.badge-high{background:color-mix(in srgb,var(--red) 15%,transparent);color:var(--red)}
.result-meta{font-size:.78rem;color:var(--muted);margin-top:.6rem}
.result-qr{margin-top:1rem;display:none}
.result-qr img{width:140px;height:140px;border-radius:12px;background:#fff;padding:8px}
.result-qr .qr-hint{font-size:.75rem;color:var(--faint);margin-top:.4rem}

.my-posts{margin-top:1.6rem}
.mp-title{font-size:.85rem;font-weight:600;color:var(--muted);margin-bottom:.7rem}
.mp-item{display:flex;align-items:center;gap:.8rem;padding:.8rem 1rem;
  border:1px solid var(--border);border-radius:12px;margin-bottom:.6rem;background:var(--panel)}
.mp-info{flex:1;min-width:0}
.mp-name{font-size:.88rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mp-meta{font-size:.75rem;color:var(--muted);margin-top:.2rem;display:flex;gap:.6rem;flex-wrap:wrap;align-items:center}
.mp-on{color:var(--green)}
.mp-off{color:var(--red)}
.mp-actions{display:flex;gap:.4rem;flex-shrink:0;align-items:center}
.mp-link{color:var(--accent);text-decoration:none;font-size:.8rem;font-weight:600}
.mp-del{background:transparent;border:none;color:var(--faint);font-size:.78rem;cursor:pointer}
.mp-del:hover{color:var(--red)}

.toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(10px);
  background:var(--panel-2);padding:.7rem 1.3rem;border-radius:11px;border:1px solid var(--border);
  font-size:.85rem;opacity:0;transition:.3s;z-index:200}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}

.preview-overlay{position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.6);display:none;align-items:center;justify-content:center;padding:1rem}
.preview-overlay.active{display:flex}
.preview-box{background:var(--bg);border:1px solid var(--border);border-radius:18px;width:100%;max-width:860px;height:85vh;display:flex;flex-direction:column;overflow:hidden}
.preview-head{display:flex;justify-content:space-between;align-items:center;padding:.8rem 1rem;border-bottom:1px solid var(--border)}
.preview-head span{font-weight:600;font-size:.9rem}
.preview-frame{flex:1;border:none;width:100%;background:#fff}

@media(max-width:640px){
  .wrap{padding:1.1rem}
  .card{padding:1.3rem;border-radius:16px}
  h1{font-size:1.25rem}
  .drop-zone{padding:1.1rem}
  .row{flex-direction:column;align-items:stretch;gap:.8rem}
  .btn-primary{justify-content:center}
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
    <a href="/">返回首页</a>
    <a href="/explore">目录</a>
    <a href="/_admin">管理</a>
  </div>
</nav>

<main class="wrap">
  <div class="card">
    <h1>匿名投稿</h1>
    <p class="sub">无需登录即可发布一个临时 HTML 页面。系统自动分配随机访问路径，页面保留 <strong>30 天</strong>后自动过期清理。</p>
    <div class="notice">⚠ 请不要提交钓鱼、恶意脚本或违法内容。所有页面会经过风险扫描并被标记，管理员可随时删除违规页面。</div>

    <div class="drop-zone" id="dropZone">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
      <div>拖拽 HTML 文件到此处，或点击选择</div>
      <input type="file" id="fileInput" accept=".html,.htm" hidden>
    </div>

    <div class="form-group">
      <label>页面标题（可选，80 字以内）</label>
      <input id="f-title" maxlength="80" placeholder="给页面起个名字" oninput="saveDraft()">
    </div>
    <div class="form-group">
      <label>页面描述（可选，用于分享卡片摘要）</label>
      <input id="f-description" maxlength="200" placeholder="一句话介绍这个页面" oninput="saveDraft()">
    </div>
    <div class="form-group">
      <label>HTML 内容</label>
      <div class="tool-row">
        <button type="button" class="tool-btn" onclick="pickImage()">🖼 插入图片</button>
        <button type="button" class="tool-btn" onclick="openPreview()">👁 预览</button>
        <button type="button" class="tool-btn" onclick="clearDraft()">🗑 清空草稿</button>
        <span class="hint">图片将上传到图床并以直链插入 · 草稿自动保存在本机</span>
      </div>
      <textarea id="f-content" placeholder="<!DOCTYPE html>..." oninput="scanRisk();saveDraft()"></textarea>
    </div>
    <input type="file" id="imgInput" accept="image/*" hidden>
    <div class="risk-box" id="riskBox"></div>

    <div class="row">
      <span class="hint">单页不超过 1MB（约 100 万字符） · 每日投稿有数量限制</span>
      <button class="btn btn-primary" id="submitBtn" onclick="submitPage()">发布页面</button>
    </div>

    <div class="result" id="resultBox">
      <h3>✅ 发布成功</h3>
      <div class="result-link">
        <a id="resultUrl" href="#" target="_blank"></a>
        <button class="copy-btn" onclick="copyUrl()">复制链接</button>
        <span id="resultBadge"></span>
      </div>
      <div class="result-meta" id="resultMeta"></div>
      <div class="result-qr" id="resultQr">
        <img id="resultQrImg" alt="分享二维码">
        <div class="qr-hint">扫码即可在手机上打开该页面</div>
      </div>
    </div>

    <div class="my-posts" id="myPosts"></div>
  </div>
</main>

<div class="toast" id="toast"></div>

<div class="preview-overlay" id="previewModal">
  <div class="preview-box">
    <div class="preview-head"><span>👁 预览（沙箱隔离）</span><button class="copy-btn" onclick="closePreview()">✕ 关闭</button></div>
    <iframe class="preview-frame" id="previewFrame" sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"></iframe>
  </div>
</div>

<script>
var QR_API='https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=4&data=';
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

function scanHtml(html){
  const warnings=[];
  if(/<script[\\s>]/i.test(html)) warnings.push('包含 <script> 脚本标签');
  if(/on\\w+\\s*=/i.test(html)) warnings.push('包含内联事件处理器（onclick 等）');
  if(/javascript:/i.test(html)) warnings.push('包含 javascript: 伪协议链接');
  if(/<iframe/i.test(html)) warnings.push('包含 iframe 嵌入');
  if(/<form/i.test(html)) warnings.push('包含表单（可能用于钓鱼）');
  if(/url\\(\\s*[\\'\\\"]?https?:/i.test(html)) warnings.push('引用了外部资源');
  let risk='safe';
  if(warnings.length>=3) risk='high'; else if(warnings.length>=1) risk='medium';
  return {risk,warnings};
}
function scanRisk(){
  const html=document.getElementById('f-content').value;
  const box=document.getElementById('riskBox');
  if(!html.trim()){box.className='risk-box';box.innerHTML='';return;}
  const r=scanHtml(html);
  if(r.risk==='safe'){box.className='risk-box';box.innerHTML='';return;}
  const cls=r.risk==='high'?'warn-high':'warn-medium';
  const title=r.risk==='high'?'⚠ 高风险内容，请确认来源可信':'◐ 包含潜在风险元素';
  box.className='risk-box '+cls;
  box.innerHTML='<strong>'+title+'</strong><ul>'+r.warnings.map(w=>'<li>'+w+'</li>').join('')+'</ul>';
}

// ---- draft autosaved in localStorage (this browser only) ----
let draftTimer;
function saveDraft(){
  clearTimeout(draftTimer);
  draftTimer=setTimeout(function(){
    var title=document.getElementById('f-title').value;
    var description=document.getElementById('f-description').value;
    var content=document.getElementById('f-content').value;
    try{
      if(!title && !description && !content.trim()){ localStorage.removeItem('hh-draft'); return; }
      localStorage.setItem('hh-draft', JSON.stringify({title:title,description:description,content:content}));
    }catch(e){}
  },500);
}
function restoreDraft(){
  try{
    var raw=localStorage.getItem('hh-draft');
    if(!raw) return false;
    var d=JSON.parse(raw);
    if(!d || !d.content) return false;
    document.getElementById('f-title').value=d.title||'';
    document.getElementById('f-description').value=d.description||'';
    document.getElementById('f-content').value=d.content||'';
    scanRisk();
    return true;
  }catch(e){return false}
}
function clearDraft(){
  document.getElementById('f-title').value='';
  document.getElementById('f-description').value='';
  document.getElementById('f-content').value='';
  try{localStorage.removeItem('hh-draft')}catch(e){}
  scanRisk();toast('草稿已清空');
}
function dropDraft(){
  try{localStorage.removeItem('hh-draft')}catch(e){}
}

const dropZone=document.getElementById('dropZone');
const fileInput=document.getElementById('fileInput');
dropZone.onclick=()=>fileInput.click();
dropZone.ondragover=e=>{e.preventDefault();dropZone.classList.add('dragover')};
dropZone.ondragleave=()=>dropZone.classList.remove('dragover');
dropZone.ondrop=e=>{e.preventDefault();dropZone.classList.remove('dragover');
  if(e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0])};
fileInput.onchange=e=>{if(e.target.files[0]) readFile(e.target.files[0])};
function readFile(f){
  const reader=new FileReader();
  reader.onload=()=>{
    document.getElementById('f-content').value=reader.result;
    if(!document.getElementById('f-title').value)
      document.getElementById('f-title').value=f.name.replace(/\\.html?$/i,'');
    scanRisk();toast('已加载：'+f.name);
  };
  reader.readAsText(f);
}

async function submitPost(payload, attempt){
  const ctrl=new AbortController();
  const timer=setTimeout(function(){ctrl.abort()},18000);
  try{
    const r=await fetch('/_api/public-upload',{method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload),signal:ctrl.signal});
    clearTimeout(timer);
    const d=await r.json().catch(function(){return {ok:false,error:'响应解析失败'}});
    if(d.ok) return {d, retryable:false};
    // 400/413/429 为确定性错误，不重试
    const retryable = !(r.status===400||r.status===413||r.status===429);
    return {d, retryable};
  }catch(e){
    clearTimeout(timer);
    return {d:{ok:false,error:'网络较慢或连接中断，已重试仍失败'}, retryable:true};
  }
}

async function submitPage(){
  const title=document.getElementById('f-title').value.trim();
  const description=document.getElementById('f-description').value.trim();
  const content=document.getElementById('f-content').value;
  if(!content.trim()){toast('请填写 HTML 内容');return}
  const btn=document.getElementById('submitBtn');
  btn.disabled=true;btn.textContent='发布中…';
  const payload={title,description,content};
  let result=null;
  for(let attempt=1; attempt<=2; attempt++){
    btn.textContent=attempt>1?'重试中…':'发布中…';
    const res=await submitPost(payload,attempt);
    result=res;
    if(res.d.ok || !res.retryable) break;
    await new Promise(function(r){setTimeout(r,1200)});
  }
  const d=result?result.d:{ok:false,error:'网络错误，请重试'};
  if(!d.ok){toast(d.error||'发布失败')}
  else{
    const url=location.origin+d.url;
    document.getElementById('resultUrl').textContent=url;
    document.getElementById('resultUrl').href=d.url;
    const badgeMap={safe:['badge-safe','✓ 安全'],medium:['badge-medium','◐ 中风险'],high:['badge-high','⚠ 高风险']};
    const b=badgeMap[d.risk]||badgeMap.safe;
    document.getElementById('resultBadge').innerHTML='<span class="badge '+b[0]+'">'+b[1]+'</span>';
    const exp=new Date(d.expires_at*1000).toLocaleDateString('zh-CN');
    document.getElementById('resultMeta').textContent='链接将于 '+exp+' 过期 · 随机路径，无法自选';
    document.getElementById('resultQrImg').src=QR_API+encodeURIComponent(url);
    document.getElementById('resultQr').style.display='block';
    document.getElementById('resultBox').classList.add('show');
    addPost({path:d.path,title:title,risk:d.risk,exp:d.expires_at,ts:Math.floor(Date.now()/1000)});
    dropDraft();
    renderMyPosts(null);refreshMeta();
  }
  btn.disabled=false;btn.textContent='发布页面';
}
function copyUrl(){
  const url=document.getElementById('resultUrl').textContent;
  navigator.clipboard.writeText(url).then(()=>toast('链接已复制')).catch(()=>toast('复制失败，请手动复制'));
}

// ---- my posts remembered in a cookie (this browser only) ----
function getMyPosts(){
  try{
    const m=document.cookie.match(/(?:^|; )hh-my-posts=([^;]*)/);
    if(!m) return [];
    const arr=JSON.parse(decodeURIComponent(m[1]));
    return Array.isArray(arr)?arr:[];
  }catch(e){return []}
}
function saveMyPosts(arr){
  document.cookie='hh-my-posts='+encodeURIComponent(JSON.stringify(arr))+
    '; path=/; max-age='+(30*86400)+'; SameSite=Lax';
}
function addPost(rec){
  const arr=getMyPosts().filter(function(p){return p.path!==rec.path});
  arr.unshift(rec);
  saveMyPosts(arr.slice(0,20));
}
function forgetPost(path){
  saveMyPosts(getMyPosts().filter(function(p){return p.path!==path}));
  renderMyPosts(lastMeta);
  toast('已移除本地记录');
}
function escHtml(s){
  return String(s==null?'':s).replace(/[&<>"']/g,function(ch){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
  });
}
let lastMeta=null;
function renderMyPosts(meta){
  lastMeta=meta||lastMeta;
  const box=document.getElementById('myPosts');
  const arr=getMyPosts();
  if(!arr.length){box.innerHTML='';return}
  const now=Date.now()/1000;
  let html='<div class="mp-title">📁 我投过的稿件（'+arr.length+'）</div>';
  arr.forEach(function(p){
    let status;
    if(lastMeta&&lastMeta[p.path]===null){status='<span class="mp-off">已删除/过期</span>'}
    else if(lastMeta&&lastMeta[p.path]&&lastMeta[p.path].status==='hidden'){status='<span class="mp-off">已下架</span>'}
    else if(p.exp&&p.exp<now){status='<span class="mp-off">已过期</span>'}
    else{status='<span class="mp-on">在线</span>'}
    const expDate=p.exp?new Date(p.exp*1000).toLocaleDateString('zh-CN'):'-';
    const title=escHtml(p.title||p.path);
    const path=escHtml(p.path);
    html+='<div class="mp-item">'+
      '<div class="mp-info"><div class="mp-name">'+title+'</div>'+
      '<div class="mp-meta"><span>/'+path+'</span><span>⏳ '+expDate+' 过期</span>'+status+'</div></div>'+
      '<div class="mp-actions">'+
      '<a class="mp-link" href="/'+path+'" target="_blank">打开</a>'+
      '<button class="copy-btn" onclick="copyPost(\\''+path+'\\')">复制</button>'+
      '<button class="mp-del" onclick="forgetPost(\\''+path+'\\')">移除</button>'+
      '</div></div>';
  });
  box.innerHTML=html;
}
async function refreshMeta(){
  const arr=getMyPosts();
  if(!arr.length) return;
  try{
    const r=await fetch('/_api/public/meta',{method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({paths:arr.map(function(p){return p.path})})});
    const d=await r.json();
    renderMyPosts(d.items||{});
  }catch(e){renderMyPosts(null)}
}
function copyPost(path){
  navigator.clipboard.writeText(location.origin+'/'+path)
    .then(function(){toast('链接已复制')}).catch(function(){toast('复制失败，请手动复制')});
}
renderMyPosts(null);
refreshMeta();
if(restoreDraft()) toast('已恢复上次未发布的草稿');

function insertAtCursor(ta,text){
  const s=ta.selectionStart||0,e=ta.selectionEnd||0;
  ta.value=ta.value.slice(0,s)+text+ta.value.slice(e);
  ta.focus();
}
function pickImage(){document.getElementById('imgInput').click()}
function openPreview(){
  const content=document.getElementById('f-content').value;
  if(!content.trim()){toast('请先填写 HTML 内容');return}
  document.getElementById('previewFrame').srcdoc=content;
  document.getElementById('previewModal').classList.add('active');
}
function closePreview(){document.getElementById('previewModal').classList.remove('active')}
document.getElementById('imgInput').onchange=async e=>{
  const f=e.target.files[0];e.target.value='';if(!f)return;
  try{
    const fd=new FormData();fd.append('file',f);
    const r=await fetch('/_api/upload-image',{method:'POST',body:fd});
    const d=await r.json();
    if(!d.ok){toast(d.error||'图片上传失败');return}
    insertAtCursor(document.getElementById('f-content'), '<img src="' + d.url + '" alt="">');
    scanRisk();toast('图片已插入');
  }catch(err){toast('图片上传失败，请重试')}
};

let toastTimer;
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),2500);
}
</script>
</body>
</html>`;
