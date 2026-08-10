# 派蒙聊天 - Cloudflare Workers 代理

把阿里云百炼（DashScope）的 API Key 从前端 JS 挪到服务端，前端只请求本代理，
Key 通过 Workers 环境变量注入，不再暴露给访客。

## 部署步骤

### 1. 安装 wrangler（如未安装）

```bash
npm install -g wrangler
# 或：npx wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

### 3. 创建 Worker 并设置密钥（重要：Key 只在服务端）

```bash
cd cloudflare
npx wrangler deploy
npx wrangler secret put DASHSCOPE_API_KEY
# 提示输入时粘贴你的阿里云百炼 API Key（新生成的，旧的已吊销的那个别用）
```

### 4.（可选）收紧来源限制

编辑 `wrangler.toml` 里的 `ALLOWED_ORIGINS`，改成你自己的站点地址，
例如 `https://ycc-06.github.io`。改完重新 `npx wrangler deploy`。

### 5. 拿到 Worker 地址

部署完成后会输出类似 `https://genshin-chat-proxy.<你的子域>.workers.dev` 的地址，
把它填到前端 `js/paimon-chat.js` 的 `API_URL` 处（见下一步的改造说明）。

## 前端改造

把 `js/paimon-chat.js` 中：

```js
const API_KEY = 'sk-xxxx'; // ← 删除，不再需要
const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'; // ← 改为代理地址
```

改为：

```js
const API_URL = 'https://genshin-chat-proxy.<你的子域>.workers.dev';
```

并把请求头里的 `Authorization: Bearer ${API_KEY}` 那行删掉（代理自己会加）。

## 安全说明

- Key 只存在于 Cloudflare 服务端环境变量（secret），浏览器和访客永远看不到。
- 代理带 CORS 来源校验、限流、请求体校验，防止被陌生人滥用。
- 内存限流只在单个实例内生效；如果站点流量大，建议在 Cloudflare 控制台
  「安全 → WAF → 速率限制规则」里加一条针对该 Worker 路由的规则。
- 若之前 Key 已泄露，务必在阿里云百炼控制台**吊销旧 Key** 并重新生成，
  同时建议清理 Git 历史中的旧 Key（见根目录指引）。
