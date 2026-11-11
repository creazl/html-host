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

### 6. 设置管理密码

编辑 `wrangler.toml`，修改 `ADMIN_PASSWORD` 为你的密码：

```toml
[vars]
ADMIN_PASSWORD = "your-strong-password"
```

### 7. 部署

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
├── src/
│   ├── index.ts        # Worker 入口（Hono 路由）
│   ├── admin.ts        # 管理面板 HTML（内嵌）
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

## 📄 License

MIT
