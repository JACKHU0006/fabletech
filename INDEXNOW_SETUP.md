# IndexNow SEO 配置指南

## 什么是 IndexNow？

IndexNow 是一个简单的协议，帮助网站立即通知搜索引擎新内容，加快索引速度。

**支持的搜索引擎：**
- Bing
- Yandex
- IndexNow.org (其他搜索引擎会获取)

---

## 已完成配置

### 1. API Key 验证文件 ✅

已创建验证文件：
```
https://www.fabletech.cc.cd/6444d163bf5d40c6a9b00dd95dd64dba.txt
```

该文件包含 API Key，内容为：
```
6444d163bf5d40c6a9b00dd95dd64dba
```

### 2. GitHub Actions 自动提交 ✅

创建了自动工作流：
- **触发时机**：每次推送代码时
- **定时任务**：每天凌晨2点自动提交
- **提交内容**：所有页面URL

---

## Bing Webmaster Tools 配置

### 第一步：登录 Bing Webmaster Tools

1. 打开 [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. 使用 Microsoft/Google 账号登录
3. 点击 **Add Site** 添加网站

### 第二步：添加网站

1. 输入你的网站 URL：`https://www.fabletech.cc.cd`
2. 选择验证方式（推荐选择 **HTML Meta Tag**）
3. 复制提供的 Meta Tag

### 第三步：配置 IndexNow

1. 进入网站后台
2. 点击左侧 **Configure My Site**
3. 选择 **IndexNow**
4. 点击 **Enable IndexNow**
5. 输入 API Key：`6444d163bf5d40c6a9b00dd95dd64dba`
6. 点击 **Submit**

### 第四步：验证配置

1. 在 Bing Webmaster Tools 中点击 **Submit URLs**
2. 输入几个页面 URL 测试
3. 查看是否成功提交

---

## IndexNow 工作原理

```
推送代码 → GitHub Actions → 提交URLs到 IndexNow → 通知 Bing 等搜索引擎 → 快速索引
```

---

## 手动提交 URL（可选）

如果你想手动提交：

### 方法一：Bing Webmaster Tools

1. 登录 [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. 进入网站后台
3. 点击 **Submit URLs**
4. 输入 URL 并提交

### 方法二：直接使用 IndexNow API

```bash
curl -X POST 'https://www.bing.com/indexnow' \
  -H 'Content-Type: application/json' \
  -d '{
    "host": "www.fabletech.cc.cd",
    "key": "6444d163bf5d40c6a9b00dd95dd64dba",
    "keyLocation": "https://www.fabletech.cc.cd/6444d163bf5d40c6a9b00dd95dd64dba.txt",
    "urlList": [
      "https://www.fabletech.cc.cd/",
      "https://www.fabletech.cc.cd/products",
      "https://www.fabletech.cc.cd/news"
    ]
  }'
```

---

## 监控和验证

### 查看索引状态

1. 登录 Bing Webmaster Tools
2. 进入 **Reports & Data → Crawl Reports**
3. 查看索引状态

### 查看提交日志

在 GitHub 仓库 → **Actions** 中查看 IndexNow 工作流日志

---

## 费用

**完全免费！** IndexNow 是免费服务，搜索引擎主动获取内容。

---

## 相关文件

- `public/6444d163bf5d40c6a9b00dd95dd64dba.txt` - API Key 验证文件
- `.github/workflows/indexnow.yml` - 自动提交工作流
- `scripts/indexnow.ts` - IndexNow 提交脚本

---

## 常见问题

### Q: IndexNow 和站点地图有什么区别？
**A:** 站点地图是被动等待搜索引擎抓取，IndexNow 是主动通知搜索引擎立即处理。

### Q: 提交频率有限制吗？
**A:** 目前没有严格限制，但建议每次提交至少间隔5分钟。

### Q: 所有页面都需要提交吗？
**A:** 不需要，每次推送时只需提交新增或更改的页面。工作流会自动处理。

### Q: 如何验证 API Key？
**A:** 打开 `https://www.fabletech.cc.cd/6444d163bf5d40c6a9b00dd95dd64dba.txt`，应显示 API Key 内容。
