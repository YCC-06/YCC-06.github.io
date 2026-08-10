# 派蒙聊天 - 阿里云函数计算（FC）代理

把阿里云百炼（DashScope）的 API Key 从前端 JS 挪到服务端，前端只请求本函数，
Key 通过 FC 环境变量注入，不对外泄露。

## 为什么从 Cloudflare Workers 迁移过来？

`*.workers.dev` 域名在国内网络环境下经常被 DNS 污染/阻断（实测本地完全连不上，
连 `ycc-06.github.io` 也受影响）。而 FC 是阿里云自家的服务，与 DashScope 同属
国内直连，**国内访问无障碍**。

## 部署步骤（约 10 分钟）

### 1. 准备代码

把本目录的 `index.js` 内容准备好（部署时粘贴或用 zip 上传）。

### 2. 创建函数

1. 登录 [函数计算 FC 控制台](https://fcnext.console.aliyun.com/)
2. 左侧「函数」→「创建函数」
3. 选 **内置运行时**：
   - 运行环境：**Node.js 20**
   - 代码上传方式：**通过 ZIP 包上传**（把 `index.js` 打成 zip）或在线编辑粘贴代码
   - 请求处理程序：`index.handler`
4. 创建完成后，函数配置 → **环境变量**，添加：
   - `DASHSCOPE_API_KEY` = 你的阿里云百炼 API Key（新生成的，旧的已吊销的那个别用）
   - `ALLOWED_ORIGINS` = `https://ycc-06.github.io`（可选，收紧来源；留空则允许所有，
     本地 `file://` 测试也能过，因为代码已放行 null Origin）

### 3. 配置 HTTP 触发器

1. 函数详情 →「触发器」→「创建触发器」
2. 类型：**HTTP 触发器**
3. 认证方式：**无需认证**（公网访问）
4. 创建后拿到**公网访问地址**，形如：
   `https://{url-id}.{region}.fcapp.run`

> ⚠️ FC 的 HTTP 触发器中，CORS 由函数代码自行处理（已内置），
> 不需要在触发器配置里重复设置。

### 4. 更新前端

把 `js/paimon-chat.js` 里的 `API_URL` 改为你的 FC 地址：

```js
const API_URL = 'https://{url-id}.{region}.fcapp.run';
```

### 5. 测试

```bash
curl -X POST "https://{url-id}.{region}.fcapp.run" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"你好，派蒙"}]}'
```

正常会返回 DashScope 的 JSON（或 SSE 流）。

## 安全说明

- Key 只存在 FC 环境变量里，浏览器和访客永远看不到。
- 函数内置 CORS 来源校验、IP 限流（30 次/分）、请求体校验。
- 内存限流只在单实例内生效；流量大建议在 FC 控制台配「弹性伸缩」或加 WAF。
- 若之前 Key 已泄露，务必在阿里云百炼控制台**吊销旧 Key** 并重新生成。

## 与 Cloudflare Workers 版的关系

`../cloudflare/worker.js` 是旧版（逻辑相同），国内网络不通时可弃用；
FC 版为当前推荐方案。两者代码结构基本一致，迁移成本低。
