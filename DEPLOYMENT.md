# 宠相随 PetLink 部署指南

## 概述

推荐使用 **Vercel + Neon** 部署，约 15 分钟可完成，复杂度低。

| 方案 | 复杂度 | 适用场景 |
|------|--------|----------|
| Vercel + Neon | 低 | 首选，零运维 |
| Vercel + Supabase | 低 | 需要更多 DB 功能时 |
| VPS + Docker | 中高 | 需要完全自控时 |

---

## 方案一：Vercel + Neon（推荐）

### 前置条件

- [ ] GitHub 账号
- [ ] 代码已推送到 GitHub 仓库（若未推送：`git init` → `git add .` → `git commit -m "init"` → 在 GitHub 新建仓库 → `git remote add origin <url>` → `git push -u origin main`）
- [ ] [Vercel 账号](https://vercel.com/signup)（可用 GitHub 登录）
- [ ] [Neon 账号](https://neon.tech)（免费 tier 足够）

### 步骤

#### 1. 创建 Neon 数据库

1. 登录 [Neon Console](https://console.neon.tech)
2. 新建项目，选择区域（如 `Asia Pacific (Singapore)`）
3. 创建完成后，在 Dashboard 复制 **Connection string**
4. 使用 **Pooled connection**（带 `-pooler` 的地址），适合 Serverless

示例格式：
```
postgresql://user:password@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

#### 2. 在 Vercel 部署

1. 登录 [Vercel](https://vercel.com)，点击 **Add New** → **Project**
2. 导入你的 GitHub 仓库
3. 配置：
   - **Framework Preset**: Next.js（自动识别）
   - **Root Directory**: 留空
   - **Build Command**: `pnpm build`（或默认）
   - **Output Directory**: 默认

4. **Environment Variables** 添加：

   | 名称 | 值 | 说明 |
   |------|-----|------|
   | `DATABASE_URL` | Neon 提供的连接串 | 必填 |
   | `AI_API_KEY` | 你的 AI 密钥 | 必填（问诊功能） |
   | `AI_BASE_URL` | AI API 地址 | 必填（如 DashScope） |
   | `AI_MODEL` | 模型名 | 可选，默认 gpt-4o-mini |

5. 点击 **Deploy**

#### 3. 部署后：执行数据库迁移

首次部署完成后，需要跑迁移和种子数据。在本地执行（确保 `DATABASE_URL` 指向 Neon）：

```bash
# 临时设置生产库地址（或新建 .env.production 仅本地用）
export DATABASE_URL="postgresql://..."  # 你的 Neon 连接串

pnpm exec prisma migrate deploy
pnpm db:seed
```

或使用 Neon 的 SQL Editor 执行迁移 SQL（从 `prisma/migrations` 中复制）。

---

## 方案二：Vercel + Supabase

1. 在 [Supabase](https://supabase.com) 创建项目
2. 在 **Settings → Database** 复制连接串（使用 **Transaction** 模式，适合 Prisma）
3. 在 Vercel 中设置 `DATABASE_URL` 为该连接串
4. 其余步骤同方案一

---

## 环境变量清单

| 变量 | 必填 | 说明 |
|------|------|------|
| `DATABASE_URL` | 是 | PostgreSQL 连接串（Neon/Supabase 等） |
| `AI_API_KEY` | 是 | AI 问诊 API 密钥 |
| `AI_BASE_URL` | 是 | API 基础地址，如 `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `AI_MODEL` | 否 | 默认 `gpt-4o-mini` |

---

## 常见问题

### 1. 构建失败：Prisma Client 未生成

项目已配置 `postinstall: "prisma generate"`，Vercel 会在 `pnpm install` 后自动执行。若仍失败，可在 **Build Command** 中改为 `prisma generate && pnpm build`。

### 2. 数据库连接超时

- 使用 **Pooled** 连接串（Neon 的 `-pooler` 地址）
- 检查 Neon/Supabase 的 IP 白名单（通常允许所有）

### 3. PWA 在 HTTPS 下才能完整工作

Vercel 默认提供 HTTPS，无需额外配置。

### 4. 首次访问无数据

执行 `pnpm db:seed` 填充演示数据，或通过应用内「添加宠物」创建数据。

---

## 自定义域名（可选）

1. 在 Vercel 项目 **Settings → Domains** 添加域名
2. 按提示在 DNS 添加 CNAME 记录指向 `cname.vercel-dns.com`
