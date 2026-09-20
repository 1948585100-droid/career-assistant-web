# AI 秋招助手（Local Edition）

本地优先（Local-first）的秋招知识管理系统。不依赖任何后端 / 数据库 / 登录系统，所有数据保存在浏览器的 IndexedDB 中。

## 技术栈

React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui（手写组件源码，未使用需联网的 CLI）+ IndexedDB。

## 快速开始

```bash
npm install
npm run dev
```

然后打开命令行输出的本地地址（默认 http://localhost:5173）。

## 当前进度（第一轮：项目骨架）

- ✅ `package.json` / `vite.config.ts` / `tsconfig.*.json` / `tailwind.config.ts`
- ✅ `src` 目录结构（components / pages / db / hooks / lib / types）
- ✅ 路由（react-router-dom，Hash 模式，纯前端无需服务器配置）
- ✅ Layout：左侧 Sidebar + 右侧内容区域
- ✅ Sidebar 六个一级入口：首页 / 简历 / 岗位 / 面试 / 错题 / 面经，底部数据管理入口
- ✅ 各页面目前为占位内容（EmptyState），路由与布局已经可以正常运行

后续几轮会依次完善：Dashboard 首页内容与统计卡片 → 简历/岗位/面试/错题四大核心页面 → IndexedDB 数据层接入 → 导入导出/搜索/标签/动画/响应式体验优化。

## 目录结构

```
career-assistant/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── src/
    ├── main.tsx            # 入口，挂载 HashRouter
    ├── App.tsx             # 路由表 + 首次启动播种数据
    ├── index.css           # Tailwind 基础样式 + 设计变量
    ├── lib/
    │   └── utils.ts        # cn() 等通用工具函数
    ├── types/
    │   └── index.ts        # 全部领域类型（Resume / Job / Interview / Mistake ...）
    ├── db/                 # 数据层（IndexedDB，与 UI 完全解耦）
    │   ├── database.ts     # 原生 IndexedDB 封装（增删改查）
    │   ├── events.ts       # 轻量发布订阅，用于跨页面数据同步
    │   ├── seed.ts         # 首次启动写入演示数据
    │   ├── exportImport.ts # 备份导出 / 导入
    │   └── repositories/   # 每个实体一个 Repository
    ├── hooks/              # 对 Repository 的 React Hook 封装（自动订阅刷新）
    ├── components/
    │   ├── ui/             # shadcn/ui 风格基础组件（Button / Card / Dialog ...）
    │   ├── layout/          # Sidebar / AppShell
    │   └── common/          # PageHeader / EmptyState / TagInput 等通用组件
    └── pages/               # Dashboard / Resume / Jobs / Interviews / Mistakes / Library / Settings
```

## 设计规范

- 主色：`#1677FF`
- 卡片：白底 / 圆角 12px / 内边距 24px / 边框 `1px solid #E5E6EB`
- 标签：背景 `#E6F4FF`，文字 `#1677FF`，圆角胶囊
- 风格参考 Notion + Linear：克制的留白、清晰的层级、无多余装饰
