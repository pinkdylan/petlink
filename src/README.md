# 前端代码目录说明

## 目录结构

```
src/
├── README.md
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # 首页 = 宠志（日历、宠物轮播、今日记录）
│   ├── globals.css
│   ├── ai-clinic/page.tsx    # AI 问诊（选宠 → Dr. Paw 对话 + 扫描动效）
│   ├── breed/page.tsx        # 品种鉴定（本喵大人/汪汪队、上传正脸、下一步→BCS）
│   ├── bcs/page.tsx          # BCS 视觉评估
│   ├── profile/page.tsx      # 我的（VIP、多宠物、导出病历、偏好设置）
│   └── record/
│       ├── page.tsx          # 记一笔（新建记录）
│       └── new/page.tsx      # 重定向到 /record
├── components/
│   ├── BottomNav.tsx         # 底部导航（宠志、问诊、体重、我的）
│   ├── ai/
│   │   └── ScanningOverlay.tsx  # 问诊页「获取近 30 天健康记录」扫描动效（Framer Motion）
│   ├── index.ts              # 业务组件统一导出
│   └── ui/
│       └── index.ts          # 基础 UI 组件导出
├── lib/
│   ├── prisma.ts             # Prisma 单例
│   ├── utils.ts              # 工具函数（如 cn）
│   └── constants.ts          # 标签/分类常量（与 PRD 一致）
└── hooks/
    └── index.ts              # Hooks 统一导出
```

## 页面（路由）

| 路径 | 路由 | 用途 |
|------|------|------|
| `app/page.tsx` | `/` | 首页 = 日历（宠志：宠物卡片、大日历、记录时间轴、FAB） |
| `app/record/page.tsx` | `/record` | 记一笔（新建多模态记录） |
| `app/ai-clinic/page.tsx` | `/ai-clinic` | AI 问诊（对话流、调取档案） |
| `app/breed/page.tsx` | `/breed` | 品种鉴定入口（BottomNav「体重」入口，可进入 BCS） |
| `app/bcs/page.tsx` | `/bcs` | BCS 视觉评估（俯视/侧视引导、拍摄） |
| `app/profile/page.tsx` | `/profile` | 我的（会员、导出病历、多宠物、设置、深色模式） |

新增页面：在 `app/` 下新建文件夹，内含 `page.tsx` 即可。

## 组件

- **`components/`** — 通用与业务组件（如 PetCard、BottomNav、RecordModal）
- **`components/ui/`** — 基础 UI 组件（按钮、输入框、弹窗等）

## 逻辑与工具

- **`lib/prisma.ts`** — Prisma 单例（migrate 就绪后启用）
- **`lib/utils.ts`** — 工具函数（如 `cn()`）
- **`lib/constants.ts`** — 四类与细分标签常量，与 PRD 一致
- **`hooks/`** — 通用 React Hooks（如 usePet、useRecords）

## UI 规范（与 cursorrules Apple 极简美学一致）

- **页面容器**：主内容区 `max-w-[430px] mx-auto`，移动端居中。
- **居中弹窗**：Paywall、导出病历、多宠物管理、添加宠物、开通 VIP 等中间弹窗统一 **`max-w-[360px]`**，外层 `flex items-center justify-center` + `px-4`，左右留白不占满屏。
- **动效**：Framer Motion 用于扫描（`ScanningOverlay`）、转场（`AnimatePresence`）；交互保持丝滑、无多余装饰。
- **设计 Token**：见 `tailwind.config.ts`（oatmeal、mGreen、morandi、bauhaus 等）与 `petlink.cursorrules`。

## 规范

- 与 `petlink.cursorrules` 一致：类型从 Prisma 生成，共享逻辑放 `@/lib` 或 `@/hooks`，校验用 Zod。

---

## 快速开始（本地）

### 1. 安装依赖

```bash
pnpm install
```

### 2. 环境变量

复制 `.env.example` 为 `.env.local`，并填入：

- `DATABASE_URL`（本地 Postgres 或你的云数据库连接串）
- `AI_API_KEY`
- `AI_BASE_URL`
- `AI_MODEL`（可选）

> 说明：不要把 `.env.local` 提交到 Git。

### 3. 启动开发服务器

```bash
pnpm dev
```

默认访问 `http://localhost:3000`。

### 4. 数据库迁移与种子数据（Prisma）

若首次连接数据库，通常需要：

```bash
pnpm exec prisma migrate dev
pnpm db:seed
```

---

## 数据库在哪里、表结构怎么改？

本项目使用云端 PostgreSQL（Neon / Supabase）或本地 Docker Postgres。

- 表结构定义：`/prisma/schema.prisma`
- 迁移历史：`/prisma/migrations/`
- 演示数据：`/prisma/seed.ts`

数据库连接由 `src/lib/prisma.ts` 统一管理（Prisma Client 单例）。

---

## 数据可视化（像 DataGrip / pgAdmin 那样）

你可以用两种方式管理数据：

1. **Neon / Supabase 自带的 Web 工具**
   - Neon：通常有 SQL Editor / 表结构与数据查看界面
   - Supabase：可用 Table Editor 或 SQL Editor
2. **Prisma Studio（更“所见即所得”）**

在本地运行：

```bash
pnpm exec prisma studio
```

浏览器打开 Prisma Studio 后即可查看/筛选数据（能力取决于 Prisma Studio 的当前版本与模型类型）。

> 如果你希望用 SQL 做增删查改：直接在 Neon/Supabase 的 SQL Editor 中执行 `INSERT/UPDATE/DELETE/SELECT` 即可。

---

## 部署到 Vercel（指引）

Vercel 环境变量必须配置以下键（Key 大小写要一致）：

- `DATABASE_URL`
- `AI_API_KEY`
- `AI_BASE_URL`
- `AI_MODEL`（可选）

详细步骤见仓库根目录 `DEPLOYMENT.md`。

---

## PWA 相关（离线缓存与“添加到主屏幕”）

- Manifest：`src/app/manifest.ts`
- Service Worker：`public/sw.js`
- 注册逻辑：`src/components/pwa/ServiceWorkerRegister.tsx`
- 安装引导：`src/components/pwa/PWAInstallPrompt.tsx`
- 侧滑返回：`src/components/pwa/SwipeBackHandler.tsx`

---

## iOS Safari 兼容小贴士（排查白屏/卡住）
如果出现「进度条卡住」「Safari 提示服务器无响应」但桌面浏览器正常：
- 先在 iPad/iPhone 上清除 Safari 网站数据（设置 → Safari → 清除历史记录与网站数据）
- 如果你装过「添加到主屏幕」的 PWA，建议先从主屏幕删除该应用图标，再用 Safari 重新打开网址

---

## 数据模型速览（Prisma）
主要表结构定义在 `prisma/schema.prisma`，当前包含：
- `User`：用户（含 `isPremium`）
- `Pet`：宠物
- `Record`：记录（`category` 四类：daily/medical/vitals/anomaly；多模态 `mediaUrls`；标签数组 `tagIds`）
- `Conversation`：AI 长记忆问诊对话（按 `petId + userId` 唯一）

---

