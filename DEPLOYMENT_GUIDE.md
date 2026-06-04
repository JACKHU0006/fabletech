# FableTech 网站功能配置清单与操作指南

## 当前状态
- ✅ 代码已推送至 GitHub: `JACKHU0006/fabletech`
- ✅ 自动部署工作流已配置
- ⏳ 部分功能需要手动配置 API Keys 和环境变量

---

## 一、需要手动配置的 API Keys

### 1. Google Sheets CRM 集成
**需要的 GitHub Secrets:**

#### `GOOGLE_SERVICE_ACCOUNT_KEY`
**获取步骤:**
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google Sheets API
4. 创建服务账户 (Service Account)
5. 生成 JSON 密钥文件
6. 复制整个 JSON 内容作为 Secret 值

**格式示例:**
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "service-account@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

#### `GOOGLE_SHEET_ID`
**获取步骤:**
1. 打开你的 Google Sheets 表格
2. 复制浏览器地址栏中的 ID
   - URL 格式: `https://docs.google.com/spreadsheets/d/`**`SPREADSHEET_ID`**`/edit`
3. 确保表格中有 "Leads" 工作表（名称必须完全匹配）

**操作:**
```bash
# 在 GitHub 仓库 Settings > Secrets and variables > Actions 中添加:
Name: GOOGLE_SERVICE_ACCOUNT_KEY
Value: [粘贴完整的 JSON 密钥内容]

Name: GOOGLE_SHEET_ID  
Value: [你的表格 ID，如: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms]
```

---

### 2. Resend 邮件通知
**需要的 GitHub Secrets:**

#### `RESEND_API_KEY`
**获取步骤:**
1. 访问 [Resend](https://resend.com) 注册账号
2. 进入 Dashboard → API Keys
3. 创建新的 API Key
4. 复制密钥值

#### `RESEND_FROM_EMAIL`
**推荐设置:**
```
notifications@fabletech.cc.cd
```

#### `RESEND_TO_EMAIL`
**推荐设置:**
```
info@fabletech.cc.cd
```
（也可以设置为你的私人邮箱用于接收询盘通知）

**操作:**
```bash
# 在 GitHub 仓库 Settings > Secrets and variables > Actions 中添加:
Name: RESEND_API_KEY
Value: [你的 Resend API Key]

Name: RESEND_FROM_EMAIL
Value: notifications@fabletech.cc.cd

Name: RESEND_TO_EMAIL
Value: info@fabletech.cc.cd
```

---

### 3. Cloudinary CDN 图片优化（可选）
**需要的 GitHub Secrets:**

#### `CLOUDINARY_CLOUD_NAME`
#### `CLOUDINARY_API_KEY`
#### `CLOUDINARY_API_SECRET`

**获取步骤:**
1. 访问 [Cloudinary](https://cloudinary.com) 注册账号（免费）
2. 进入 Dashboard
3. 复制 Cloud Name
4. 进入 Settings → API Keys
5. 复制 API Key 和 API Secret

**操作:**
```bash
Name: CLOUDINARY_CLOUD_NAME
Value: [你的 Cloud Name]

Name: CLOUDINARY_API_KEY
Value: [你的 API Key]

Name: CLOUDINARY_API_SECRET
Value: [你的 API Secret]
```

---

### 4. Cloudflare Pages 部署
**需要的 GitHub Secrets:**

#### `CLOUDFLARE_API_TOKEN`
**获取步骤:**
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 My Profile → API Tokens
3. 点击 "Create Token"
4. 选择 "Edit Cloudflare Workers" 模板或自定义权限
5. 设置账户权限为 "Edit"
6. 生成并复制 Token

#### `CLOUDFLARE_ACCOUNT_ID`
**获取步骤:**
1. 登录 Cloudflare Dashboard
2. 进入你的 Pages 项目或任意域名 Overview
3. 右下角找到 "Account ID"
4. 复制该值

**操作:**
```bash
Name: CLOUDFLARE_API_TOKEN
Value: [你的 Cloudflare API Token]

Name: CLOUDFLARE_ACCOUNT_ID
Value: [你的 Cloudflare Account ID]
```

---

## 二、GitHub Secrets 配置步骤

### 访问 Secrets 设置
1. 进入 GitHub 仓库: `https://github.com/JACKHU0006/fabletech`
2. 点击 "Settings" 标签
3. 在左侧菜单找到 "Secrets and variables" → "Actions"
4. 点击 "New repository secret"

### 添加新的 Secret
1. 点击 "New repository secret" 按钮
2. 输入 Name（如 `GOOGLE_SERVICE_ACCOUNT_KEY`）
3. 在 Value 文本框中粘贴值
4. 点击 "Add secret"
5. 重复以上步骤添加其他 Secrets

---

## 三、GitHub Actions 工作流

### 已配置的工作流

#### 1. **deploy.yml** - 自动部署
- **触发**: push 到 main 分支
- **功能**: 构建并部署到 Cloudflare Pages
- **状态**: ✅ 已就绪（需配置 Cloudflare Secrets）

#### 2. **indexnow.yml** - SEO 索引提交
- **触发**: push 到 main / 每天凌晨2点 / 手动
- **功能**: 自动提交 URLs 到搜索引擎
- **状态**: ✅ 已就绪（IndexNow API Key 已配置）

#### 3. **add-news.yml** - 自动添加新闻
- **触发**: 每月1号 / 手动
- **功能**: 自动添加随机新闻到网站
- **状态**: ✅ 已就绪

#### 4. **rollback.yml** - 紧急回滚
- **触发**: 手动
- **功能**: 一键回滚到指定版本
- **状态**: ✅ 已就绪（需配置 Cloudflare Secrets）

#### 5. **pre-deploy-checks.yml** - 部署前检查
- **触发**: PR 到 main / 手动
- **功能**: 自动检查代码质量
- **状态**: ✅ 已就绪

---

## 四、手动触发部署

### 方法1: GitHub Actions 页面
1. 进入仓库: `https://github.com/JACKHU0006/fabletech/actions`
2. 点击 "deploy" 工作流
3. 点击 "Run workflow" 按钮
4. 选择分支（main）并确认

### 方法2: 推送新代码
```bash
# 任何推送到 main 分支的代码都会自动触发部署
git add .
git commit -m "Your changes"
git push fabletech main
```

---

## 五、功能验证清单

### 完成后请验证以下功能:

- [ ] **询盘表单提交**
  - 访问网站并提交询盘表单
  - 检查是否收到邮件通知
  - 检查 Google Sheets 中是否有新数据

- [ ] **邮件通知**
  - 提交询盘后应收到 HTML 格式邮件
  - 邮件包含客户信息和时间戳

- [ ] **IndexNow 提交**
  - 进入 GitHub Actions 查看 indexnow 工作流
  - 确认 URLs 成功提交到搜索引擎

- [ ] **自动新闻添加**
  - 每月1号会自动添加新闻
  - 可手动触发测试

- [ ] **紧急回滚**
  - 在 Actions 页面测试 rollback 工作流
  - 选择任意历史 commit 进行测试

---

## 六、常用链接

- **GitHub 仓库**: https://github.com/JACKHU0006/fabletech
- **GitHub Actions**: https://github.com/JACKHU0006/fabletech/actions
- **网站地址**: https://www.fabletech.cc.cd
- **Google Cloud Console**: https://console.cloud.google.com/
- **Resend**: https://resend.com
- **Cloudinary**: https://cloudinary.com
- **Cloudflare Dashboard**: https://dash.cloudflare.com/

---

## 七、优先级建议

### 高优先级（立即配置）
1. ✅ `GOOGLE_SERVICE_ACCOUNT_KEY` - CRM 功能核心
2. ✅ `GOOGLE_SHEET_ID` - CRM 功能核心
3. ✅ `RESEND_API_KEY` - 邮件通知核心

### 中优先级（本周内配置）
4. 🔶 `RESEND_FROM_EMAIL` - 需要配置域名邮箱
5. 🔶 `RESEND_TO_EMAIL` - 接收询盘通知

### 低优先级（可选）
6. 🔸 `CLOUDINARY_*` - 图片 CDN 优化
7. 🔸 `CLOUDFLARE_*` - 如需 Cloudflare Pages 部署

---

## 八、故障排查

### 问题1: 部署失败
**检查项:**
- [ ] Cloudflare API Token 是否正确
- [ ] Cloudflare Account ID 是否正确
- [ ] 构建是否有错误

**解决方案:**
```bash
# 在本地运行构建测试
npm run build
```

### 问题2: 询盘表单不工作
**检查项:**
- [ ] GOOGLE_SERVICE_ACCOUNT_KEY 是否完整（包含 private_key）
- [ ] GOOGLE_SHEET_ID 是否正确
- [ ] Google Sheets API 是否启用

**解决方案:**
1. 检查 GitHub Actions 日志中的具体错误
2. 验证服务账户是否有 Sheets 写入权限
3. 确保表格共享给服务账户邮箱

### 问题3: 邮件未发送
**检查项:**
- [ ] RESEND_API_KEY 是否正确
- [ ] 邮箱域名是否已验证（Resend 需要验证域名）

**解决方案:**
1. 在 Resend Dashboard 检查 API Key
2. 添加并验证发件人域名

---

## 九、后续维护建议

### 定期检查
- [ ] 每月1号检查新新闻是否自动添加
- [ ] 每周检查 GitHub Actions 运行日志
- [ ] 定期检查 Google Sheets 数据备份

### 性能监控
- [ ] 使用 Google Analytics 监控流量
- [ ] 使用 Cloudflare Analytics 监控访问
- [ ] 检查错误追踪日志（ErrorTracker）

### 安全建议
- [ ] 定期轮换 API Keys（每90天）
- [ ] 监控异常访问和错误日志
- [ ] 保持依赖包更新

---

## 十、联系支持

如遇到问题:
1. 检查 [GitHub Issues](https://github.com/JACKHU0006/fabletech/issues)
2. 查看 [Actions 日志](https://github.com/JACKHU0006/fabletech/actions)
3. 查阅 [Astro 文档](https://docs.astro.build/)
4. 查阅 [GitHub Actions 文档](https://docs.github.com/en/actions)

---

**文档版本**: v1.0  
**最后更新**: 2026-06-04  
**维护团队**: FableTech Development Team
