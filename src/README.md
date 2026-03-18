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
