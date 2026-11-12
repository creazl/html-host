# HTML Host

轻量级 HTML 页面托管服务，基于 Cloudflare Workers + KV + D1 构建。上传 HTML 文件，自定义 URL 路径，几秒内发布到全球网络。

## ✨ 功能特性

- **拖拽上传** — 直接拖入 `.html` 文件，或在编辑器中编写代码
- **自定义路径** — 任意 URL，支持多级目录（如 `/blog/post-1`）
- **在线编辑** — 内置代码编辑器，随时修改已发布页面
- **密码保护** — 每页可设独立密码，私密页面仅授权用户访问
- **访问统计** — 自动统计浏览量，管理面板一目了然
- **搜索管理** — 快速搜索、编辑、删除页面
- **修改密码** — 后台可直接修改管理密码，无需重新部署
- **风险扫描** — 上传时自动识别脚本、表单、iframe 等风险元素并分级标记
- **全球加速** — Cloudflare 边缘网络，毫秒级响应
- **免费使用** — 免费额度足够个人使用

## 🏗 技术架构

| 组件 | 用途 | 免费额度 |
|---|---|---|
| Workers (Hono) | 请求路由与页面渲染 | 10 万请求/天 |
| KV | 存储 HTML 内容 | 10 万次读/天，1000 次写/天 |
| D1 | 存储页面元数据 | 500 万次读/天，10 万次写/天 |

## 🚀 快速部署

### 前置要求

- 一个 Cloudflare 账号（免费即可）
- Node.js 18+

### 1. 克隆项目

```bash
git clone https://github.com/creazl/html-host.git
cd html-host
npm install
```

### 2. 登录 Cloudflare

```bash
npx wrangler login
```

### 3. 创建 KV 命名空间

```bash
npx wrangler kv namespace create PAGES_KV
```

将输出的 `id` 填入 `wrangler.toml` 的 `[[kv_namespaces]]` 中。

### 4. 创建 D1 数据库

```bash
npx wrangler d1 create html-host-db
```

将输出的 `database_id` 填入 `wrangler.toml` 的 `[[d1_databases]]` 中。

### 5. 初始化数据库表

```bash
npx wrangler d1 execute html-host-db --file=./schema.sql
```

### 6. 生成内嵌面板模块

`src/admin.ts` 由 `public/admin.html` 生成，首次拉取代码或修改面板后执行：

```bash
node scripts/gen-admin.mjs
```

### 7. 设置管理密码

编辑 `wrangler.toml`，修改 `ADMIN_PASSWORD` 为你的密码：

```toml
[vars]
ADMIN_PASSWORD = "your-strong-password"
```

### 8. 部署

```bash
npx wrangler deploy
```

部署完成后访问 `https://<your-worker>.workers.dev/_admin` 即可进入管理面板。

## 🌐 绑定自定义域名

1. 在 Cloudflare Dashboard 进入你的域名（Zone）
2. 确保域名已激活并使用 Cloudflare DNS
3. 添加 CNAME 记录：`<subdomain>` → `<worker-name>.<account>.workers.dev`，开启橙色云代理
4. 添加 Worker Route：`<subdomain>.yourdomain.com/*` 指向 `html-host`

或者直接在 Workers 设置中添加 Custom Domain，Cloudflare 会自动配置 DNS 和路由。

## 📖 使用说明

### 发布页面

1. 访问 `https://yourdomain.com/_admin`
2. 输入管理密码登录
3. 点击「新建页面」
4. 选择以下方式之一：
   - **拖拽上传**：将 `.html` 文件拖入上传区域
   - **在线编辑**：在编辑器中直接编写 HTML
5. 填写 URL 路径（如 `my-page` 或 `blog/post-1`）
6. 可选：设置页面密码
7. 点击「保存页面」

### 访问页面

- 公开页面：`https://yourdomain.com/my-page`
- 私密页面：`https://yourdomain.com/my-page?pass=密码`

### 管理页面

- **编辑**：点击页面列表中的「编辑」按钮
- **删除**：点击「删除」按钮（需确认）
- **搜索**：顶部搜索框可按标题或路径搜索
- **统计**：顶部显示页面总数、总浏览量、私密页面数

### 修改密码

在管理面板顶部点击「修改密码」，输入当前密码和新密码即可。修改后立即生效，无需重新部署。

## 📁 项目结构

```
html-host/
├── wrangler.toml       # Cloudflare 配置
├── schema.sql          # D1 数据库表结构
├── package.json
├── scripts/
│   └── gen-admin.mjs   # 由 admin.html 生成 admin.ts
├── src/
│   ├── index.ts        # Worker 入口（Hono 路由）
│   ├── admin.ts        # 管理面板 HTML（内嵌，生成产物）
│   └── landing.ts      # 首页介绍页（内嵌）
└── public/
    └── admin.html      # 管理面板源码（用于生成 admin.ts）
```

## 🔌 API 路由

| 路由 | 方法 | 说明 |
|---|---|---|
| `/` | GET | 项目介绍首页 |
| `/_admin` | GET | 管理面板 |
| `/_api/auth` | POST | 登录验证 |
| `/_api/change-password` | POST | 修改管理密码 |
| `/_api/list` | GET | 列出所有页面 |
| `/_api/upload` | POST | 上传/保存页面 |
| `/_api/page/:path` | GET | 获取页面内容 |
| `/_api/page/:path` | DELETE | 删除页面 |
| `/:path` | GET | 渲染 HTML 页面 |

## 🛡️ 安全机制

HTML 托管的核心矛盾：既要能上传任意 HTML（含脚本），又要控制恶意内容带来的风险。本项目采用**分层防御**。

### 已实施

**1. 上传层风险扫描（标记，不拦截）**

保存时自动扫描内容，识别以下风险元素：`<script>`、内联事件 `onclick=` 等、`javascript:` 伪协议、`<iframe>`、`<form>` 表单、外部资源引用。按数量分级：

| 等级 | 判定 | 面板标识 |
|---|---|---|
| `safe` | 无风险元素 | ✓ 安全（绿） |
| `medium` | 1–2 项风险 | ◐ 中风险（黄） |
| `high` | 3 项及以上 | ⚠ 高风险（红） |

扫描结果存入 D1 `risk` 列，列表显示徽章；编辑器内实时列出具体警告项。**默认只标记不拦截**——因为自有的演示页、小工具常依赖内联脚本，硬拦截会导致页面无法使用。

**2. 响应层 CSP 与安全头**

每个托管页面返回：

- `Content-Security-Policy`：`object-src 'none'`（禁 Flash/插件）、`base-uri 'self'`（禁篡改基底链接）、`frame-src 'self'`、`form-action 'self'`（表单只能提交本站）；图片/字体允许 `self` 与外部 https
- `X-Content-Type-Options: nosniff`：禁止 MIME 嗅探
- `X-Frame-Options: SAMEORIGIN`：禁止被第三方站点套帧点击劫持
- `Referrer-Policy: no-referrer`：不向外链泄露来源

**3. 预览层沙箱隔离**

后台「预览」在 `sandbox` iframe 中通过 `srcdoc` 渲染，与线上环境隔离；预览不会计入浏览量。

**4. 访问控制**

- 所有 `/_api/*` 接口必须携带 Bearer 管理密码
- 管理密码存于 KV，可在后台修改，优先于环境变量
- 私密页面凭 `?pass=` 访问

### 已知限制

- 页面与后台当前**同域**：页面内的脚本理论上处于同源上下文。管理 token 存于浏览器 `sessionStorage`（非 Cookie），刷新/关闭标签即失效，能降低被脚本读取后沿用的风险，但不能完全消除同源脚本的能力。
- 扫描是正则启发式判断，不是沙箱执行；绕过写法（如拆分标签、动态拼接）可能漏检。

### 可选加固（按需）

1. **分离子域**：把托管页面放到独立子域（如 `pages.example.com`），后台留在 `admin.example.com`，浏览器按源隔离，页面脚本访问不到后台会话。
2. **严格模式**：若不需要脚本，可在 CSP 中去掉 `unsafe-inline` 与 `script-src`，或在保存前过滤 `<script>`/`on*=`。
3. **强密码 + 入口隐藏**：管理后台使用长随机密码，不在公开渠道传播 `/_admin` 链接。
4. **定期清理**：删除不再使用的页面，减少暴露面。

## 📄 License

MIT
