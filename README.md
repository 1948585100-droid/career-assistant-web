<div align="center">

# 🎯 AI 秋招助手 | Career Assistant

### 面向秋招求职场景的 Local-first 求职管理 Web 应用

将 **简历管理、岗位投递、面试记录、错题复盘、面经沉淀** 整合到一个统一的求职工作台中。

<br />

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![IndexedDB](https://img.shields.io/badge/Data-IndexedDB-1677FF)](#-local-first-架构)
[![Deployment](https://img.shields.io/badge/Deployment-EdgeOne-00A4FF)](https://demo.career-assistant-ai.xyz)
[![HTTPS](https://img.shields.io/badge/HTTPS-Enabled-success)](https://demo.career-assistant-ai.xyz)

<br />

### 🌐 [在线体验 → demo.career-assistant-ai.xyz](https://demo.career-assistant-ai.xyz)

</div>

---

## ✨ 项目简介

**AI 秋招助手** 是一个围绕大学生秋招全过程设计的个人求职管理系统。

在实际求职过程中，简历版本、岗位 JD、投递进度、面试问题、复盘记录和面经往往分散在多个文档和平台中，难以形成持续积累。

本项目希望将这些信息统一沉淀到一个系统中，形成完整的求职成长闭环：

```text
简历管理
   ↓
岗位投递
   ↓
面试准备
   ↓
真实面试
   ↓
面试复盘
   ↓
错题沉淀
   ↓
持续优化
```

当前版本采用 **Local-first** 架构，不依赖后端服务器、远程数据库或登录系统，数据直接保存在浏览器的 **IndexedDB** 中。

---

## 🚀 在线体验

> **Production Demo**

### 👉 [https://demo.career-assistant-ai.xyz](https://demo.career-assistant-ai.xyz)

项目已部署至 **Tencent Cloud EdgeOne**，并完成自定义域名、HTTPS 证书及 HTTP → HTTPS 重定向配置。

GitHub `main` 分支更新后，可触发新的生产构建与部署流程。

---

## 🧩 核心功能

| 模块 | 功能 |
| --- | --- |
| 🏠 首页 Dashboard | 汇总投递、面试、Offer、错题、高频问题及近期任务 |
| 📄 简历管理 | 维护基础简历、经历及版本信息 |
| 💼 岗位管理 | 管理公司、岗位、JD、投递状态及标签 |
| 💬 面试管理 | 结构化记录真实面试问题、回答及复盘 |
| ❌ 错题集 | 沉淀回答不理想的问题，形成长期复习记录 |
| 📚 面经知识库 | 整理面试经验、问题及求职知识 |
| 🔍 全局搜索 | 搜索岗位、面试、错题等核心数据 |
| 💾 数据管理 | 支持本地数据持久化及导入导出 |

---

## 🏠 Dashboard

首页用于快速查看当前秋招进度。

主要展示：

- 投递数量
- 面试数量
- Offer 数量
- 错题数量
- 高频问题数量
- 高频标签
- 最近任务
- 最近岗位

帮助用户快速了解自己的整体求职状态。

---

## 📄 简历管理

统一维护个人求职经历和基础简历信息。

当前模块主要承担个人求职资料管理功能，并为未来进一步实现：

- JD 定向简历分析
- 简历版本管理
- AI 简历优化
- 岗位匹配分析

提供数据基础。

---

## 💼 岗位管理

记录目标岗位的完整投递信息。

包括：

- 公司名称
- 岗位名称
- JD 信息
- 投递状态
- 标签
- 投递时间
- 相关任务

通过统一的岗位池管理整个秋招投递过程。

---

## 💬 面试管理

将每一次真实面试结构化保存。

可记录：

- 公司
- 岗位
- 面试时间
- 面试问题
- 用户回答
- 复盘内容
- 问题标签

避免面试结束后信息快速遗忘，为后续复盘提供基础。

---

## ❌ 错题集

将面试过程中回答不理想的问题沉淀为长期可复习的内容。

通过错题积累，可以逐步发现自己的高频薄弱点，例如：

- 项目介绍
- 产品思维
- 数据分析
- 业务理解
- 结构化表达
- 行为面试

最终形成个人专属的面试问题库。

---

## 📚 面经知识库

用于整理秋招过程中积累的：

- 面试经验
- 高频问题
- 公司信息
- 岗位知识
- 复盘总结

让零散的求职经验逐渐形成可长期复用的知识库。

---

## 🛠 技术栈

### Frontend

| 技术 | 用途 |
| --- | --- |
| React 18 | UI 与组件体系 |
| TypeScript | 类型安全 |
| Vite | 开发与生产构建 |
| React Router | 前端路由 |
| Tailwind CSS | 页面样式 |
| shadcn/ui 风格组件 | 基础 UI 组件体系 |

### Data

| 技术 | 用途 |
| --- | --- |
| IndexedDB | 浏览器本地持久化 |
| Repository Pattern | 数据访问层 |
| React Hooks | 页面与数据层连接 |
| Publish / Subscribe | 跨页面数据刷新 |

### Engineering

| 技术 | 用途 |
| --- | --- |
| Git | 版本管理 |
| GitHub | 代码托管 |
| Vite Build | Production Build |
| Tencent Cloud EdgeOne | Git 集成、CI/CD、CDN、自定义域名与 HTTPS 部署 |

---

## 🧠 Local-first 架构

当前版本采用 Local-first 数据架构。

```text
┌─────────────────────┐
│      React UI       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    React Hooks      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Repository Layer   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      IndexedDB      │
└─────────────────────┘
```

页面组件不会直接操作 IndexedDB，而是统一通过 Repository 数据访问层进行读写。

例如：

```text
Jobs Page
    ↓
useJobs()
    ↓
jobRepository
    ↓
IndexedDB
```

这样可以降低 UI 与底层存储之间的耦合。

未来如果需要将 IndexedDB 替换为：

- REST API
- Supabase
- PostgreSQL
- MySQL
- 云端数据库

可以尽量减少对 UI 层的改动。

---

## 💾 数据持久化

当前版本不依赖传统后端服务器或远程数据库。

```text
Browser
   ↓
IndexedDB
```

Local-first 方案具有以下特点：

- ✅ 无需部署后端服务
- ✅ 无需远程数据库
- ✅ 无需用户注册
- ✅ 无需登录系统
- ✅ 数据读取速度快
- ✅ 开发与部署成本低
- ✅ 用户数据保存在本地浏览器
- ✅ 支持数据导入 / 导出

---

## 🏗 项目结构

```text
career-assistant-web/
│
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
│
└── src/
    │
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    │
    ├── components/
    │   ├── common/
    │   ├── dashboard/
    │   ├── interview/
    │   ├── job/
    │   ├── layout/
    │   ├── mistake/
    │   ├── resume/
    │   ├── search/
    │   └── ui/
    │
    ├── db/
    │   ├── database.ts
    │   ├── events.ts
    │   ├── exportImport.ts
    │   ├── seed.ts
    │   │
    │   └── repositories/
    │       ├── companyNoteRepo.ts
    │       ├── experienceRepo.ts
    │       ├── interviewRepo.ts
    │       ├── jobRepo.ts
    │       ├── mistakeRepo.ts
    │       ├── resumeRepo.ts
    │       ├── resumeVersionRepo.ts
    │       ├── tagRepo.ts
    │       ├── taskRepo.ts
    │       └── userRepo.ts
    │
    ├── hooks/
    ├── lib/
    ├── pages/
    ├── services/
    ├── types/
    └── utils/
```

---

## 🗃 数据层设计

项目没有把 CRUD 逻辑直接写在页面组件中，而是建立独立的数据访问层。

```text
db/
│
├── database.ts
│
├── events.ts
│
├── exportImport.ts
│
├── seed.ts
│
└── repositories/
```

### Repository Pattern

```text
React Component
      ↓
React Hook
      ↓
Repository
      ↓
IndexedDB
```

Repository 负责统一管理数据的：

```text
Create
Read
Update
Delete
```

页面只关注业务逻辑和 UI 展示。

---

## 🔄 数据同步机制

项目通过轻量事件机制实现跨页面数据更新。

```text
Page A 修改数据
       ↓
Repository
       ↓
IndexedDB
       ↓
Publish Event
       ↓
Hooks 监听
       ↓
Page B 自动刷新
```

避免不同页面之间直接产生复杂依赖。

---

## 🎨 UI 设计

整体视觉风格参考 **Notion / Linear** 类型的效率工具。

设计目标：

> 清晰、克制、高信息密度。

### Design Tokens

```text
Primary
#1677FF

Card
White Background
12px Border Radius
24px Padding
1px solid #E5E6EB

Tag
Background: #E6F4FF
Text: #1677FF
```

页面整体采用：

```text
┌────────────┬─────────────────────────┐
│            │                         │
│  Sidebar   │      Main Content       │
│            │                         │
│            │                         │
└────────────┴─────────────────────────┘
```

---

## ⚙️ 本地运行

### 1. Clone Repository

```bash
git clone https://github.com/1948585100-droid/career-assistant-web.git
```

### 2. Enter Project

```bash
cd career-assistant-web
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

默认访问：

```text
http://localhost:5173
```

---

## 📦 Production Build

执行：

```bash
npm run build
```

项目通过 TypeScript 检查后，由 Vite 生成生产环境文件：

```text
dist/
```

---

## ☁️ Deployment

项目当前部署于：

### Tencent Cloud EdgeOne

部署链路：

```text
Local Development
        │
        ▼
    Git Commit
        │
        ▼
      GitHub
        │
        ▼
 EdgeOne Git Integration
        │
        ▼
    npm install
        │
        ▼
   npm run build
        │
        ▼
       dist
        │
        ▼
Production Deployment
        │
        ▼
 Custom Domain + HTTPS
```

### Production URL

🌐 https://demo.career-assistant-ai.xyz

### Deployment Features

- ✅ GitHub 仓库接入
- ✅ Production Build
- ✅ EdgeOne 自动部署
- ✅ 自定义域名
- ✅ CNAME DNS 解析
- ✅ 免费 HTTPS 证书
- ✅ HTTP → HTTPS 301 重定向
- ✅ 电脑与移动端公网访问验证

---

## 💡 项目设计亮点

### 1. Local-first 数据架构

使用 IndexedDB 实现浏览器端结构化数据持久化，无需后端即可完成完整 Web MVP。

### 2. Repository Pattern

通过 Repository Layer 将数据访问逻辑与 React UI 解耦。

### 3. Hooks 数据封装

页面通过 React Hooks 获取和修改业务数据，降低组件复杂度。

### 4. 结构化求职数据

将求职过程拆分为：

```text
Resume
Job
Interview
Mistake
Task
Tag
Experience
```

为后续 AI 分析提供结构化数据基础。

### 5. 完整部署链路

项目已完成：

```text
Development
   ↓
Git
   ↓
GitHub
   ↓
Production Build
   ↓
EdgeOne CI/CD
   ↓
Custom Domain
   ↓
HTTPS
   ↓
Online Demo
```

---

## 🤖 AI 能力规划

当前版本主要完成求职管理系统和底层数据架构。

下一阶段计划逐步接入 AI 能力。

```text
PDF 简历上传
      ↓
简历内容解析
      ↓
结构化简历数据库
      ↓
目标岗位 JD
      ↓
JD 关键词解析
      ↓
岗位匹配分析
      ↓
简历优化建议
      ↓
面试问题预测
      ↓
真实面试
      ↓
录音 / 文字稿解析
      ↓
AI 面试复盘
      ↓
自动生成错题
      ↓
持续训练
```

---

## 🗺 Roadmap

### Phase 1 — Web MVP

- [x] Dashboard
- [x] 简历管理
- [x] 岗位管理
- [x] 面试管理
- [x] 错题管理
- [x] 面经知识库
- [x] IndexedDB 数据层
- [x] Repository Pattern
- [x] 数据导入 / 导出
- [x] 搜索与标签
- [x] Production Build
- [x] GitHub 代码管理
- [x] EdgeOne 在线部署
- [x] 自定义域名
- [x] HTTPS 证书
- [x] HTTP → HTTPS 重定向

### Phase 2 — AI Resume

- [ ] PDF 简历上传
- [ ] 简历结构化解析
- [ ] JD 内容解析
- [ ] 岗位关键词提取
- [ ] 简历与 JD 匹配分析
- [ ] AI 简历修改建议

### Phase 3 — AI Interview

- [ ] 面试录音上传
- [ ] Speech-to-Text
- [ ] 面试官 / 候选人角色识别
- [ ] 面试 QA 自动整理
- [ ] AI 回答评价
- [ ] AI 优化答案
- [ ] 自动生成错题

### Phase 4 — Career Copilot

- [ ] 个性化能力画像
- [ ] 高频薄弱问题分析
- [ ] AI 模拟面试
- [ ] 岗位知识库
- [ ] 求职成长趋势
- [ ] 云端数据同步

---

## 🎯 最终目标

项目最终希望形成一套完整的 AI 求职成长系统：

```text
个人简历
    ↓
岗位 JD
    ↓
简历优化
    ↓
面试准备
    ↓
真实面试
    ↓
AI 复盘
    ↓
错题沉淀
    ↓
能力提升
    ↓
下一次面试
```

让用户的每一次投递和面试，都能够转化为下一次求职过程中的有效经验。

---

## 📌 Project Status

```text
Status: Web MVP ✅
Deployment: Production ✅
Custom Domain & HTTPS: ✅
AI Integration: Planned 🚧
```

当前已经完成：

**产品设计 → 前端开发 → 数据架构 → 本地持久化 → Git → GitHub → Production Build → CI/CD → 自定义域名 → HTTPS → Online Demo**

下一阶段将重点完善 AI 能力以及真实求职场景下的数据闭环。

---

<div align="center">

### 🎯 Career Assistant

**让每一次面试，都成为下一次面试的训练数据。**

<br />

### 🌐 [在线体验](https://demo.career-assistant-ai.xyz)

</div>
