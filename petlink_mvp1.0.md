《宠相随》技术架构与规范文档 (MVP v0.1)

---

## 主技术栈说明（以谁为准、为什么）

**以谁为准**：主技术栈以 **`DEVELOPMENT_PLAN.md`** 与 **`petlink.cursorrules`** 为唯一依据，即 **Next.js 15 + Prisma + Tailwind**。所有新功能与代码实现均按该栈执行，避免出现“两套方案并行”的歧义。

**为什么**：
- **全栈 TypeScript**：前后端同一语言，Cursor 一次上下文即可覆盖 Schema → Server Action / API Route → UI，减少漏改与类型不一致。
- **Prisma 单一数据源**：模型在 `prisma/schema.prisma` 定义一次，类型自动生成，与 PRD 中的 Record/Pet/User 等直接对应。
- **单仓库、单进程**：`pnpm dev` 即可跑通整站，部署与协作更简单。
- **规范已就绪**：`.cursorrules` 已按 Next.js + Prisma 写好分工与工作流，沿用即可。

**关于 Python / BCS**：本文档下文中的 BCS 流程（如 PyTorch 视觉推理）为早期设想。主应用统一用 Next.js 实现；若后续 BCS 需使用 Python/ PyTorch，可**以单独服务或 Serverless 形式接入**，主栈不变。

---

下文为**业务抽象与参考思路**（表结构、接口契约、数据流）。落地时请用 **Prisma Schema** 与 **Next.js Server Actions / API Routes** 实现，数据库可选 PostgreSQL、MySQL 或 SQLite（由 Prisma 支持）。

---

## 1. 数据模型 (Data Model)
数据模型是业务逻辑的骨架。在“宠相随”中，核心是将宠物的非结构化生命活动转化为结构化的数据库记录，以便 AI 能够精确回溯。

表结构设计：

pets (宠物基础信息)：id, name, species, birth_date, owner_id

health_records (核心记录表)：id, pet_id, record_type (如：医疗/生活), bcs_score, tags (JSON存储，如：{"poop": "abnormal", "appetite": "low"}), media_url, created_at

chat_history (AI 问诊对话)：id, pet_id, query_text, ai_response, context_snapshot (引用记录的 snapshot)

## 2. API 设计 (API Design)
API 是前后端协同的契约。**落地实现**：使用 Next.js **Server Actions** 或 **App Router API Routes**（RESTful 风格均可）。

核心接口契约（业务层，实现为 Action 或 Route）：

- **提交记录**：提交宠物健康记录（包含 BCS 分数、标签和图片上传）。
- **获取某宠历史**：获取某宠物的结构化病历列表（供日历与 AI 调取档案使用）。
- **AI 问诊**：问诊接口，后端自动关联该宠近期记录的标签作为上下文。

环境配置规范 (.env)：

- 所有敏感密钥（如 OpenAI Key、数据库链接）均存放于 `.env.local`，严禁提交 Git。
- 变量名规范：`DATABASE_URL`、`AI_API_KEY`、`AI_BASE_URL`（参见项目根目录 `.env.example`）。

## 3. 架构与流程图 (Architecture & Flow)
数据流向（在 Next.js 内实现）：用户输入 → Server Action / API Route → Prisma 读写 + 可选 RAG/LLM → 返回建议。

BCS 检测流程：拍照 → 评分逻辑（MVP 可先规则/简化，或调用外部接口）→ 结果写入 Record → 返回 UI。若后续采用 PyTorch 等 Python 模型，可**以单独服务接入**，主应用仍为 Next.js。

## 4. 第三方集成 (Third-Party Integrations)
在 Next.js 主栈下，保持最精简依赖：

- **OpenAI / DeepSeek API**：用于生成健康建议及问诊（环境变量：`AI_API_KEY`、`AI_BASE_URL`）。
- **数据库**：由 Prisma 管理，可选 PostgreSQL、MySQL 或 SQLite（本地或托管均可）。
- **Stitch / Figma**：作为 UI 原型与组件的输入源（可选）。

## 5. 技术决策记录 (Technical Decisions)
- **为何以 Next.js + Prisma 为主栈**：全栈 TypeScript、单一仓库与数据源，便于 Cursor 全栈开发与类型一致；Server Actions 与 Prisma 配合可快速实现“记录–存储–问诊”闭环。
- **为何用 Prisma**：Schema 即契约，类型自动生成，与 PRD 数据结构对齐；支持多种数据库，MVP 可用 SQLite 或 PostgreSQL。
- **Python/BCS 的定位**：主应用不引入 Python 运行时；若 BCS 需 PyTorch 等，后续以**单独服务或 Serverless** 接入，主栈保持不变。
- **放弃的方案**：不在主仓库内混用 FastAPI + Next.js；不采用微服务拆分，以单体 Next.js 应用换取简单部署与开发速度。