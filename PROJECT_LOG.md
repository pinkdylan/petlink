# 宠相随 (PetLink) 项目进度日志

## 2025-02 进度快照

### 已完成
- **技术栈与文档**：主栈确认为 Next.js 15 (App Router) + Prisma + Tailwind；PRD、DEVELOPMENT_PLAN、PRE_DEV_CHECKLIST、petlink_mvp1.0 已对齐。
- **项目脚手架**：Next.js 已初始化，pnpm 管理依赖，`src/app`、`src/components`、`src/lib`、`src/hooks` 结构就绪。
- **前端迁移**：原 zip（Vite + React Router）已迁入 `src/`：首页、记一笔(/record)、AI 问诊(/ai-clinic)、品种(/breed)、BCS(/bcs)、我的(/profile)、BottomNav；/record/new 重定向至 /record。
- **样式与规范**：Tailwind 扩展 PRD 设计 Token（燕麦色、mGreen/mRed/mBlue、morandi 等）；globals.css 含 material-symbols、no-scrollbar、glass 等；layout 430px 容器、字体、BottomNav。
- **环境与占位**：`.env.example` 已建；`src/lib/prisma.ts`、`utils.ts`、`constants.ts`（四类标签）为占位/就绪；`src/hooks/index.ts` 占位。
- **质量**：tsconfig 排除 zip；TypeScript/ESLint 通过；首页使用 next/image，类型与 lint 已修。

### 前端界面定型（2025-02，同步审计官记录）
- **宠志 (首页)**：左上用户头像/名称跳转「我的」；右上设置跳转「偏好设置」全页；宠物轮播点击滑动居中；日历支持年/月切换；今日记录区已移除 AI 入口与消息提醒。
- **问诊 (/ai-clinic)**：入口先进入「选择宠物」列表，选宠后进入 Dr. Paw 对话；底部「获取近 30 天健康记录」触发 `ScanningOverlay` 机械感扫描动效（Framer Motion，2.5s easeInOut），结束后展示「数据分析完成」卡片；支持图片/文件上传与输入聚焦。
- **体重/品种 (/breed)**：品种选项为「本喵大人」「汪汪队」及对应简笔图标；上传正脸照（请求相机/相册权限）完成品种识别后才可点击「下一步」进入 BCS。
- **我的 (/profile)**：VIP 支持「连续包月」「年度会员」双模式选择，会员介绍已与 PRD §70–72 一致（无限次 AI 智慧问诊、多模态视频云端无限存储、一键导出 PDF）；多宠物管理、导出就医病历、Paywall、添加宠物、开通 VIP 等**居中弹窗**统一为 **max-w-[360px]**，左右留白不占满屏；多宠物弹窗滑动到底可「添加宠物」，点击后弹出基本信息表单（名字、品种、年龄）。
- **设计规范**：居中弹窗尺寸统一、Framer Motion 用于扫描与转场，符合 cursorrules 中 Apple 极简美学与 Bauhaus 克制。
- **文档同步**：按 cursorrules 专家视角更新 `DEVELOPMENT_PLAN.md`（第一阶段 UI 完成项）、`PRE_DEV_CHECKLIST.md`（设计 Token/响应式已勾选）、`src/README.md`（目录含 ScanningOverlay、UI 规范）、`petlink.cursorrules`（居中弹窗 max-w-[360px] 规范）。

### 数据库与部署策略（2025-02）
- **本地开发**：使用 Docker 跑 PostgreSQL（`docker-compose` 或 `docker run`），专注 Prisma + 数据流 + AI 调用。
- **部署时机**：MVP 跑通后再选：Vercel + 托管 DB，或 VPS + Docker 整栈；两种均支持，到时根据需求选。已记录于 `DEVELOPMENT_PLAN.md` 与 `PRE_DEV_CHECKLIST.md`。

### 第一个数据流（2025-02）
- **记一笔**：`src/app/record/actions.ts` 中 `createRecord` Server Action 提交记录并写入数据库；`ensureDemoUserAndPet` 在无用户/宠物时自动创建演示数据。
- 表单绑定 `useActionState`，成功后跳转宠志首页。

### Prisma Schema 初版（2025-02）
- **User**：id, name, email, phone, avatarUrl, petParentId, isPremium（订阅校验）
- **Pet**：id, name, species (cat/dog), breed, birthDate, age, weight, bcs, avatarUrl, ownerId
- **Record**：id, petId, dateTime, category (daily/medical/vitals/anomaly), tagIds (Json), textNote, mediaUrls (Json), bcsScore；`@@index([petId, dateTime])` 用于日历高频查询
- 与 PRD §9.1、cursorrules、`src/lib/constants.ts` 对齐；`prisma migrate dev --name init` 已执行，`src/lib/prisma.ts` 已启用

### 演示数据种子（2025-02）
- **prisma/seed.ts**：运行 `pnpm db:seed` 填充演示数据。
- 数据量：1 用户（Jasper Chen）、2 宠物（巴迪 Buddy、咪咪 Mimi）、20 条健康记录。
- 记录分布：巴迪 12 条（过去 3 周 + 今日）、咪咪 8 条（过去 2 周 + 今日）；涵盖 daily/medical/vitals/anomaly 四类。
- 数据存储在 PostgreSQL，由 seed 脚本生成并写入，无需单独数据文件。

### 首页宠志接入真实数据（2025-02）
- **src/lib/home-data.ts**：`getHomePageData(startDate, endDate)` 从数据库获取用户、宠物、记录，按 petId 与 date 分组。
- **src/components/HomeClient.tsx**：Client 组件，接收 initialData 渲染宠物轮播、日历、今日/历史记录。
- **src/app/page.tsx**：Server Component，拉取近 5 个月范围数据后传给 HomeClient；`dynamic = "force-dynamic"` 确保每次请求获取最新数据。

### 第一个 AI 调用（2025-02）
- **src/lib/get-pet-context.ts**：`getPetContext(petId, days)` 从数据库拉取宠物近 N 天健康记录，格式化为 AI 可读上下文。
- **src/app/ai-clinic/actions.ts**：`fetchPetContext`、`getPetsForClinic`、`consultAI`。`consultAI` 支持 OpenAI/DeepSeek 兼容 API，输出【症状分析】【居家观察建议】【就医红线警示】；未配置 AI_API_KEY 时返回演示文案。
- **问诊页**：宠物列表从数据库读取；「获取近 30 天健康记录」调用 `fetchPetContext` 并展示扫描动效；输入症状后调用 `consultAI` 获取 AI 分析。

### 第一阶段收尾（2025-02）
- **AI 长记忆问诊**：新增 `Conversation` 模型，每宠一会话；`loadConversation` / `saveConversationMessages` 持久化对话；`consultAI` 支持 `messageHistory` 参数，多轮上下文传入 API；AIClinicClient 进入对话时加载历史、发送后保存。
- **多模态 Record 表**：Schema 注释完善（textNote + mediaUrls 支持图/视频）；`getPetContext` 在摘要中输出「含 N 个媒体文件」。
- **标签枚举统一**：新增 `src/lib/record-tags.ts` 为唯一来源，含 `RECORD_CATEGORIES`、`CATEGORY_LABELS`、`TAGS_BY_CATEGORY`、`SUB_CATEGORIES`、`CATEGORY_BUTTONS`、`toPrismaCategory`；`constants.ts` 改为 re-export；记录表单与 actions 使用 `record-tags`；分类 ID 统一为 `anomaly`（兼容旧 `abnormal`）。

### 第二阶段 PWA 化（2025-02）
- **离线缓存与桌面图标**：`app/manifest.ts`（name、icons、theme_color、display: standalone）；`public/sw.js` 预缓存首页与静态资源，fetch 时 NetworkFirst 回退缓存；`ServiceWorkerRegister` 在 production 注册 SW。
- **添加到主屏幕引导**：`PWAInstallPrompt` 监听 `beforeinstallprompt`，满足条件后展示弹窗；iOS 展示「分享 → 添加到主屏幕」指引；支持「稍后」关闭并 session 记忆。
- **侧滑返回**：`useSwipeBack` 左边缘 24px 内右滑 80px 触发 `router.back()`；根路径不触发；`SwipeBackHandler` 挂载于 layout。

### 部署准备（2025-02）
- **DEPLOYMENT.md**：Vercel + Neon/Supabase 部署指南，含环境变量、迁移与种子执行步骤。
- **package.json**：新增 `postinstall: "prisma generate"` 供 Vercel 构建时生成 Prisma Client。

### 待办（按 PRE_DEV_CHECKLIST 与第一阶段）
- 配置 AI_API_KEY 与 AI_BASE_URL（可选 AI_MODEL）以启用真实 AI 问诊。
