# 🔒 安全修复记录：API Key 泄露处置指引

## 问题回顾

`js/paimon-chat.js` 中曾明文写有阿里云百炼（DashScope）API Key：
`sk-8e7b433cb7824a1893049fcf4acbd302`。

该 Key 存在以下暴露面：
- 部署在 GitHub Pages 上的 JS 文件可直接被任何访客下载查看；
- Key 位于 Git 历史中，共涉及 3 次提交（5b44c31 / 0101715 / e9d7fc6）。

**结论：Key 已视为完全泄露，必须吊销并更换。**

---

## 第一步：吊销旧 Key（最紧急，先止损）

1. 登录阿里云百炼控制台 → 右上角头像 → **API-KEY 管理**（或"模型广场 → API-KEY"）。
2. 找到该 Key（`sk-8e7b...`），点击 **删除/禁用**。
3. **重新生成一个新 Key**，用于 Cloudflare Worker 的 `DASHSCOPE_API_KEY` secret（不要写进任何前端代码）。

> ⚠️ 在新代理部署完成、前端改指代理地址之前，网站上的派蒙聊天会暂时不可用，这是正常的。

---

## 第二步：清理 Git 历史（可选但强烈建议）

即使当前文件已删除 Key，`git log` 里仍能翻出它。如果仓库是公开的（GitHub Pages 必须公开），旧提交永远暴露 Key。

推荐用 `git filter-repo`（Git 官方推荐工具，需 Python）：

```bash
# 1. 安装（Windows 用 pip）
pip install git-filter-repo

# 2. 备份！务必先整体备份仓库
git clone --mirror https://github.com/YCC-06/YCC-06.github.io.git backup-repo.git

# 3. 用 git-filter-repo 把该 Key 从所有历史中替换成占位符
cd 你的项目目录
git filter-repo --replace-text <(echo 'sk-8e7b433cb7824a1893049fcf4acbd302==>sk-REVOKED')

# 4. 强制推送到远端（会重写历史，需在 GitHub 设置里允许 force push）
git push origin --force --all
git push origin --force --tags
```

⚠️ 重写历史会改变所有提交 hash：
- 如果是**多人协作**的仓库，先和协作者沟通（他们需要重新 clone）；
- 本仓库目前是单人维护（仅 3 个提交），风险很小。

### 替代方案（不想重写历史时）

只在 GitHub 上把旧提交"藏"起来不可行——公开仓库任何 commit 都能被检索。
如果实在不想动历史，至少确保 Key 已吊销，让泄露的 Key 失效，损失可控。

---

## 第三步：确认没有其他密钥残留

```bash
# 检查整个仓库（含历史）是否还有 Key 字样
git grep -n 'sk-' $(git rev-list --all) | grep -v REVOKED
# 检查当前工作区
grep -rn 'sk-' --include='*.js' --include='*.html' .
```

---

## 当前已完成的安全改造

| 项目 | 状态 |
|---|---|
| 明文 Key 从前端移除 | ✅ 已完成 |
| Cloudflare Workers 代理（Key 放服务端 secret） | ✅ 已编写，待部署 |
| CORS 来源校验 / 限流 / 请求体校验 | ✅ 代理内已内置 |
| 吊销旧 Key 并生成新 Key | ⏳ 需要你在控制台操作 |
| 部署代理 + 更新前端 `API_URL` | ⏳ 需要部署后填写真实地址 |
| Git 历史清理 | ⏳ 可选，按上述指引操作 |
