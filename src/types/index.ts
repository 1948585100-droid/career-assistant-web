/**
 * 全局领域类型定义。
 * 所有 IndexedDB 表结构、Repository 方法、页面组件均以此为唯一事实来源，
 * 方便未来接入 AI API 时复用同一套类型。
 */

/* ------------------------------- 简历中心 ------------------------------- */

export type ExperienceType = "education" | "internship" | "project" | "skill";

/** 经历库中的一条经历（教育 / 实习 / 项目 / 技能） */
export interface Experience {
  id: string;
  type: ExperienceType;
  title: string; // 项目名称 / 学校名称 / 公司名称 / 技能名称
  org?: string; // 学校、公司等归属主体
  role?: string; // 担任角色，如"产品经理实习生"
  startDate?: string;
  endDate?: string; // 为空表示至今
  background?: string; // 项目背景
  responsibility?: string; // 我的职责
  result?: string; // 成果
  description?: string; // 通用描述（教育/技能）
  tags: string[];
  updatedAt: string;
}

/** 基础简历（个人信息 + 概要） */
export interface Resume {
  id: string;
  title: string; // 例如"基础简历"
  fileName?: string; // 例如 resume.pdf（本地仅记录文件名，不存二进制大文件也可用 fileData）
  fileData?: string; // base64，若用户上传了 PDF/图片
  fileType?: string;
  name: string;
  school?: string;
  major?: string;
  targetPosition?: string;
  phone?: string;
  email?: string;
  summary?: string;
  updatedAt: string;
}

/** 岗位定制版本简历（"岗位版本"） */
export interface ResumeVersion {
  id: string;
  name: string; // 例如"字节-产品经理-v2"
  jobId?: string; // 关联岗位
  experienceIds: string[]; // 引用经历库中挑选的经历
  note?: string; // 针对该岗位的定制说明
  updatedAt: string;
}

/* ------------------------------- 岗位管理 ------------------------------- */

export const JOB_STATUSES = [
  "favorite", // 收藏
  "applied", // 已投递
  "written_test", // 笔试
  "interview1", // 一面
  "interview2", // 二面
  "offer", // Offer
  "rejected", // 已挂
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const JOB_STATUS_LABEL: Record<JobStatus, string> = {
  favorite: "收藏",
  applied: "已投递",
  written_test: "笔试",
  interview1: "一面",
  interview2: "二面",
  offer: "Offer",
  rejected: "已挂",
};

export interface Job {
  id: string;
  company: string;
  position: string;
  jd?: string;
  status: JobStatus;
  deadline?: string;
  appliedDate?: string;
  location?: string;
  salary?: string;
  url?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/** 状态 → Badge 颜色变体的统一映射，Dashboard 的 RecentJobCard 和 Jobs 模块的 StatusBadge 共用，避免各写一份 */
export const JOB_STATUS_VARIANT: Record<JobStatus, "neutral" | "default" | "warning" | "success" | "danger"> = {
  favorite: "neutral",
  applied: "default",
  written_test: "default",
  interview1: "warning",
  interview2: "warning",
  offer: "success",
  rejected: "danger",
};

/** 投递流程的标准顺序（不含"已挂"），用于岗位详情页的进度时间线 */
export const JOB_PIPELINE_STATUSES: JobStatus[] = [
  "favorite",
  "applied",
  "written_test",
  "interview1",
  "interview2",
  "offer",
];

/* ------------------------------- 面试中心 ------------------------------- */

/** 面试轮次的常用选项，允许在表单里自定义输入之外的选择 */
export const INTERVIEW_ROUNDS = ["HR面", "一面", "二面", "终面"] as const;

/** 一次面试中的单个问答条目 */
export interface QA {
  id: string;
  question: string;
  answer: string;
  feedback?: string; // 面试官当场给出的反馈（如果有）
  review?: string; // 复盘：哪里不足
  improvement?: string; // 改进方向 / 优化后的答案
  tags: string[];
}

/** 整体复盘：表现 / 优势 / 不足 / 下一步改进 */
export interface InterviewReview {
  performance?: string;
  strengths?: string;
  weaknesses?: string;
  nextSteps?: string;
}

export interface Interview {
  id: string;
  jobId?: string;
  company: string;
  position: string;
  round: string; // 一面 / 二面 / HR面 / 终面 等，允许自定义，可选项见 INTERVIEW_ROUNDS
  date: string;
  interviewer?: string;
  qas: QA[];
  overallReview?: InterviewReview;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/* -------------------------------- 错题集 -------------------------------- */

/** 错题来源的常用选项，允许在表单里自定义输入之外的选择 */
export const MISTAKE_SOURCES = ["面试", "自己总结", "面经"] as const;
export type MistakeSource = (typeof MISTAKE_SOURCES)[number];

/** 重要程度的常用选项 */
export const MISTAKE_IMPORTANCE_OPTIONS = ["低", "中", "高"] as const;
export type MistakeImportance = (typeof MISTAKE_IMPORTANCE_OPTIONS)[number];

/** 出现次数的分级阈值：>=5 视为"高频"，用于 FrequencyBadge 和 Dashboard 的"高频问题数量"统计，两处保持同一个标准 */
export const HIGH_FREQUENCY_THRESHOLD = 5;
export const MID_FREQUENCY_THRESHOLD = 3;

export interface Mistake {
  id: string;
  question: string;
  myAnswer: string;
  problem: string; // 问题出在哪 / 问题分析
  betterAnswer: string; // 优化后的答案
  source?: string; // 面试 / 自己总结 / 面经，可选项见 MISTAKE_SOURCES
  sourceInterviewId?: string; // 来源面试的 id，点击可跳转到该面试详情
  company?: string; // 冗余存一份来源公司，方便未来全局搜索按公司过滤（手动录入的错题可能没有）
  tags: string[];
  frequency: number; // 出现频率，用于"高频问题"排序
  importance?: string; // 重要程度：低 / 中 / 高，可选项见 MISTAKE_IMPORTANCE_OPTIONS
  createdAt: string;
  updatedAt: string;
}

/* -------------------------------- 面经库 -------------------------------- */

export interface CompanyNote {
  id: string;
  company: string;
  position: string;
  source?: string; // 来源，如"牛客"
  process: string[]; // 面试流程，如 ["一面", "二面", "HR面"]
  frequentQuestions: string[];
  summary?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/* -------------------------------- 待办任务 -------------------------------- */

export interface TaskItem {
  id: string;
  title: string;
  done: boolean;
  relatedJobId?: string;
  dueDate?: string;
  createdAt: string;
}

/* -------------------------------- 标签系统 -------------------------------- */

/**
 * 标签在这个项目里没有单独的实体，而是分散存在于 Job / Experience / Interview(QA) /
 * Mistake 四处的 tags 字段里。这个类型描述的是"聚合统计后"的一个标签，count 永远是
 * 实时计算出来的（见 db/repositories/tagRepo.ts），不是存进数据库的固定值。
 */
export interface Tag {
  id: string;
  name: string;
  color?: string;
  count: number;
}

/* -------------------------------- 用户信息 -------------------------------- */

export interface UserProfile {
  id: string;
  name: string;
  createdAt: string;
}

/* ------------------------------ 备份数据结构 ------------------------------ */

export interface CareerBackup {
  version: number;
  exportedAt: string;
  user: UserProfile[];
  resumes: Resume[];
  experiences: Experience[];
  resumeVersions: ResumeVersion[];
  jobs: Job[];
  interviews: Interview[];
  mistakes: Mistake[];
  companyNotes: CompanyNote[];
  tasks: TaskItem[];
}
