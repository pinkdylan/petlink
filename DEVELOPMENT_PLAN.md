# 宠相随 (PetLink) 技术演进与架构文档

## 📌 当前架构状态
- **核心框架**: Next.js 15 (App Router)
- **技术范式**: 全栈 TypeScript (Single-Stack TS)
- **UI 规范**: Apple 极简主义 / Bauhaus (燕麦色系)

## 🚀 三阶段演进路线

### 第一阶段：Web 核心逻辑期 (Current)
**目标**：跑通“记录-存储-问诊”的闭环。
- [ ] 基于 Prisma 实现多模态 Record 表设计。
- [ ] 接入 OpenAI/DeepSeek 实现带长记忆的 AI 问诊逻辑。
- [x] **响应式 Web UI（Apple 风格）**：宠志、问诊（选宠 + 扫描动效）、记一笔、品种/BCS、我的（VIP 双模式、多宠物、导出病历、偏好设置）已按 PRD 与 cursorrules 定型；居中弹窗统一 `max-w-[360px]`，Framer Motion 用于动效与转场（见 `PROJECT_LOG.md`）。
- **注意**：优先使用 Web 标准 API（fetch, navigator.mediaDevices），确保后续兼容性。

### 第二阶段：MVP 验证与 PWA 化
**目标**：极低成本实现“伪 App”体验，获取首批 16 元/月（或 168 元/年）订阅用户。
- [x] 实现离线缓存与桌面图标：`app/manifest.ts`、`public/sw.js`、`ServiceWorkerRegister`。
- [ ] 实现“添加到主屏幕”的引导弹窗。
- [x] 优化移动端触摸交互：`useSwipeBack` 左边缘右滑返回。

### 第三阶段：原生化封装 (Capacitor)
**目标**：正式上架 App Store，品牌职业化。
- [ ] 引入 `@capacitor/core` 和 `@capacitor/ios`。
- [ ] 调用原生 API：BCS 拍摄时锁定曝光/对焦、本地 PDF 导出与分享。
- [ ] 集成 Apple Pay / 微信支付内购链路。

## 数据库与部署策略

- **本地开发**：使用 **Docker 跑 PostgreSQL**（`docker-compose` 或 `docker run`），专注 Prisma + 数据流 + AI 调用；Next.js 照常 `pnpm dev` 在宿主机运行，连接 `localhost:5432`。
- **部署时机**：MVP 跑通后再选部署方案，两种均支持：
  - **Vercel + 托管 DB**：Vercel Postgres / Supabase / Neon 等，改 `DATABASE_URL` 即可，零运维。
  - **VPS + Docker 整栈**：应用与 Postgres 均容器化，本地 Docker Postgres 配置可复用，环境一致。
- 详见 `PRE_DEV_CHECKLIST.md` 与项目根目录 `docker-compose.yml`（若已创建）。

## 📋 开发前期准备
正式写业务代码前，请按 **`PRE_DEV_CHECKLIST.md`** 完成：技术栈统一、环境与密钥、项目脚手架、Prisma Schema 初版、设计 Token、阶段边界与 PROJECT_LOG 约定。

## 🛠 开发工作流约束
- **Figma -> Stitch**: UI 组件优先从 Stitch 导出。
- **Cursor 角色**: 严格遵守 `petlink.cursorrules` 中的专家视角分工。
- **AI 策略**: 每次开启新任务前，需确认当前处于哪一个演进阶段。