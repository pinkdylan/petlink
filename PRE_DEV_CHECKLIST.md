# 宠相随 (PetLink) 开发前期准备清单

在动手写业务代码前，建议按本清单逐项完成，保证技术栈统一、环境可跑、文档可追溯。

---

## 一、技术栈与文档统一

| 项目 | 状态 | 说明 |
|------|------|------|
| **主技术栈确认** | ✅ | 当前以 **Next.js 15 (App Router) + Prisma + Tailwind** 为准（见 `DEVELOPMENT_PLAN.md` 与 `petlink.cursorrules`）。 |
| **旧文档标注** | ✅ | `petlink_mvp1.0.md` 已加主栈说明与「Python/BCS 可单独服务接入」，实现以 Next.js + Prisma 为准。 |
| **PRD 与路线图对齐** | ✅ | `petlinkPRD.md` 已包含功能规格、优先级与 V1.0/V1.5/V2.0 范围，开发时以 PRD 为准。 |

---

## 二、开发环境准备

| 项目 | 建议 | 检查命令/方式 |
|------|------|----------------|
| **Node.js** | 使用 LTS（建议 20.x 或 22.x） | `node -v` |
| **包管理器** | 推荐 **pnpm**（更快、省磁盘、依赖更干净） | `pnpm -v`，与 npm 二选一并统一 |
| **数据库** | **Docker 跑 PostgreSQL**（推荐）：`docker-compose up -d` 或 `docker run` 启动 Postgres，Next.js 连 `localhost:5432`；MVP 跑通后再选部署方案（Vercel+托管 DB 或 VPS+Docker 整栈） | `docker ps` 确认容器运行；`psql` 或 Prisma 连接测试 |
| **Git** | 仓库已初始化 | `git status` |
| **环境变量** | 敏感信息不进 Git | 见下方「环境与密钥」 |

---

## 三、项目脚手架初始化

若尚未创建 Next.js 项目，可按当前规划执行：

```bash
# 创建 Next.js 15 项目（TypeScript, App Router, Tailwind, ESLint）
pnpm create next-app . --typescript --tailwind --eslint --app --src-dir

# 安装 Prisma 与依赖
pnpm add @prisma/client && pnpm add -D prisma && pnpm exec prisma init
pnpm add zod framer-motion
# 若使用 Radix：pnpm add @radix-ui/react-*
```

**目录结构建议**（与 `.cursorrules` 一致）：

- `src/app/` — 页面与路由（App Router）
- `src/components/` — 通用 UI 与业务组件
- `src/lib/` — 工具函数、Prisma 单例、getPetContext 等
- `src/hooks/` — 通用 React Hooks
- `prisma/schema.prisma` — 唯一数据模型定义

---

## 四、环境与密钥

| 项目 | 说明 |
|------|------|
| **.env 不提交** | 确保 `.gitignore` 包含 `.env`、`.env.local`、`.env.*.local`。 |
| **.env.example** | 在仓库中提供 `.env.example`，列出所需变量名（不写真实值），便于新人与 CI 对照。 |

**建议的 .env.example 内容**（与 PRD/技术方案一致）：

```env
# 数据库（Prisma）
DATABASE_URL="postgresql://user:password@localhost:5432/petlink?schema=public"
# 或 SQLite MVP: file:./dev.db

# AI 问诊（OpenAI / DeepSeek 等）
AI_API_KEY=""
AI_BASE_URL=""

# 可选：OSS 上传（V1.5 视频存证）
# OSS_REGION=
# OSS_BUCKET=
# OSS_ACCESS_KEY=
# OSS_SECRET_KEY=
```

每位开发者在本地复制为 `.env.local` 并填入真实值。

---

## 五、数据模型与 API 契约（与 PRD 对齐）

| 项目 | 状态 | 说明 |
|------|------|------|
| **Prisma Schema 初版** | ✅ | 已定义 `User`（含 isPremium）、`Pet`（species/breed/age/weight/bcs）、`Record`（category/tagIds/textNote/mediaUrls，JSONB 存标签，PetID+DateTime 复合索引）；与 PRD §9.1、cursorrules、constants.ts 对齐。 |
| **标签枚举** | ⬜ | 四类（生活/医疗/体征/异常）及细分标签用 TypeScript 枚举或常量与 Prisma 一致，便于「调取健康档案」检索。 |
| **API 契约** | ⬜ | 若前后端分工明确，可先写一份 `docs/api-contract.md`（或 OpenAPI），列出 Phase 1 需要的接口（如提交记录、获取某宠历史、AI 问诊）。 |

这样「记录 → 存储 → 问诊」闭环有明确的数据与接口边界。

---

## 六、设计与 UI 规范

| 项目 | 状态 | 说明 |
|------|------|------|
| **设计 Token** | ✅ | 已与 PRD §八 及 cursorrules 一致：`tailwind.config.ts` 中燕麦色（oatmeal-*）、健康绿（mGreen）、morandi/bauhaus 色系；globals.css 含 material-symbols、glass、no-scrollbar 等；主背景与主色已落地。 |
| **Figma / Stitch** | ⬜ | 若使用 Stitch 从 Figma 导出组件，确认与 PRD 四 Tab、日历、记录、AI 对话、BCS 一致；当前已用占位组件完成逻辑与交互定型。 |
| **响应式与目标端** | ✅ | 第一阶段 Web：移动端视口 `max-w-[430px]` 容器、底部 BottomNav 四 Tab（宠志、问诊、体重、我的）；**居中弹窗**统一 `max-w-[360px]`、左右留白；Framer Motion 用于动效（如 ScanningOverlay）与转场。详见 `src/README.md` 与 `PROJECT_LOG.md`。 |

---

## 七、阶段边界与进度记录

| 项目 | 说明 |
|------|------|
| **当前阶段** | 按 `DEVELOPMENT_PLAN.md`，当前为 **第一阶段：Web 核心逻辑期**。不在此阶段引入 PWA、Capacitor、支付等，保持代码库聚焦。 |
| **数据库与部署** | 本地用 **Docker 跑 Postgres**；MVP 跑通后再选部署方案：Vercel + 托管 DB，或 VPS + Docker 整栈；两种均支持，详见 `DEVELOPMENT_PLAN.md`。 |
| **PROJECT_LOG.md** | 每完成一个 Feature 或里程碑，在 `PROJECT_LOG.md` 追加一段简短记录（日期、完成项、涉及文件），便于回溯与交接。 |
| **任务优先级** | 开发顺序建议与 PRD §六「功能清单与优先级」一致：P0 先做（底部导航、日历视图、记录工作台、主动标签、AI 基础对话与档案调取、会员展示与 Paywall 逻辑）。 |

---

## 八、前期准备完成后的建议第一步

1. **跑通本地**：`pnpm dev`、Prisma migrate 能成功，能打开首页。  
2. **第一个数据流**：实现「创建一条记录并写入数据库」的完整链路（含 Prisma 与简单表单），验证 Schema 与 Server Action 或 API 设计。  
3. **第一个 AI 调用**：实现 `getPetContext(petId, days)` + 一次简单的问诊请求，验证环境变量与输出结构（症状分析 / 居家观察 / 就医红线）是否符合 PRD。

完成以上三项后，即可认为「前期准备」收尾，进入按 P0 功能列表的迭代开发。

---

## 九、清单自检汇总

- [x] 技术栈以 Next.js + Prisma + Tailwind 为准，旧文档已标注或更新  
- [x] Node / 包管理 / 数据库 / Git 就绪  
- [x] 项目已脚手架初始化（或已有仓库并安装依赖）  
- [x] `.env.example` 已创建，`.env.local` 已配置且未提交  
- [x] Prisma Schema 初版已定义（Record、Pet、User 等）  
- [x] 设计 Token（颜色、圆角等）已与 PRD 一致并落地到代码  
- [x] 明确当前阶段为「Web 核心逻辑期」，并约定用 `PROJECT_LOG.md` 记录进度  

前端界面已定型；完成 Prisma Schema 与首个数据流/AI 调用后即可进入按 P0 的迭代开发。
