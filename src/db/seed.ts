import { getById, put, bulkPut } from "./database";
import { makeId, nowISO } from "@/lib/utils";
import { ensureUser } from "./repositories/userRepo";
import type {
  CompanyNote,
  Experience,
  Interview,
  Job,
  Mistake,
  Resume,
  TaskItem,
} from "@/types";

const SEED_FLAG_ID = "seeded_v1";

interface SeedFlag {
  id: string;
  done: boolean;
}

/**
 * 首次打开应用时写入一批与 PRD 示例一致的演示数据，方便直接体验各个页面。
 * 之后用户的增删改都会持久化在 IndexedDB 中，不会被再次覆盖
 * （通过 meta 表里的 seeded_v1 标记位判断是否已经播种过）。
 */
export async function ensureSeeded(): Promise<void> {
  const existingSeedFlag = await getById<SeedFlag>(
    "meta",
    SEED_FLAG_ID
  );

  if (existingSeedFlag?.done) return;

  await ensureUser("张三");

  const now = nowISO();

  const resume: Resume = {
    id: makeId("resume"),
    title: "基础简历",
    fileName: "resume.pdf",
    name: "张三",
    school: "XX大学",
    major: "计算机科学与技术",
    targetPosition: "产品经理",
    phone: "138****0000",
    email: "zhangsan@example.com",
    summary: "计算机专业应届生，有用户增长与数据分析项目经验，擅长结构化表达与复盘。",
    updatedAt: "2026-09-20T00:00:00.000Z",
  };

  const experiences: Experience[] = [
    {
      id: makeId("exp"),
      type: "education",
      title: "XX大学",
      org: "XX大学",
      role: "计算机科学与技术",
      startDate: "2022-09",
      endDate: "2026-06",
      description: "本科，GPA 3.7/4.0，辅修数据科学。",
      tags: ["计算机", "本科"],
      updatedAt: now,
    },
    {
      id: makeId("exp"),
      type: "internship",
      title: "产品经理实习生",
      org: "某互联网公司",
      role: "产品经理实习生",
      startDate: "2025-06",
      endDate: "2025-12",
      responsibility: "负责用户增长相关功能的需求梳理与数据复盘。",
      result: "推动新用户次日留存提升 6%。",
      tags: ["产品", "增长"],
      updatedAt: now,
    },
    {
      id: makeId("exp"),
      type: "project",
      title: "用户增长分析系统",
      org: "课程项目",
      background: "校内创业团队需要一套轻量的用户增长数据看板。",
      responsibility: "独立负责需求调研、指标体系设计与数据可视化方案。",
      result: "上线后帮助团队每周决策效率提升，获评优秀项目。",
      tags: ["SQL", "数据分析"],
      updatedAt: now,
    },
    {
      id: makeId("exp"),
      type: "skill",
      title: "SQL",
      tags: [],
      updatedAt: now,
    },
    {
      id: makeId("exp"),
      type: "skill",
      title: "Python",
      tags: [],
      updatedAt: now,
    },
    {
      id: makeId("exp"),
      type: "skill",
      title: "数据分析",
      tags: [],
      updatedAt: now,
    },
    {
      id: makeId("exp"),
      type: "skill",
      title: "Axure",
      tags: [],
      updatedAt: now,
    },
    {
      id: makeId("exp"),
      type: "skill",
      title: "用户研究",
      tags: [],
      updatedAt: now,
    },
    {
      id: makeId("exp"),
      type: "skill",
      title: "PPT",
      tags: [],
      updatedAt: now,
    },
  ];

  const jobByte: Job = {
    id: makeId("job"),
    company: "字节跳动",
    position: "产品经理",
    jd: "负责用户增长相关产品功能的设计与迭代，推动核心指标增长……",
    status: "interview1",
    deadline: "2026-10-20",
    appliedDate: "2026-09-01",
    location: "北京",
    url: "https://jobs.bytedance.com/experienced/position",
    tags: ["产品", "增长"],
    createdAt: now,
    updatedAt: now,
  };

  const jobTencent: Job = {
    id: makeId("job"),
    company: "腾讯",
    position: "产品运营",
    jd: "负责社区内容运营策略制定与用户活跃度提升。",
    status: "applied",
    deadline: "2026-10-15",
    location: "深圳",
    url: "https://careers.tencent.com/",
    tags: ["运营"],
    createdAt: now,
    updatedAt: now,
  };

  const jobAli: Job = {
    id: makeId("job"),
    company: "阿里巴巴",
    position: "数据分析",
    jd: "负责业务数据分析与经营指标监控。",
    status: "written_test",
    deadline: "2026-10-25",
    location: "杭州",
    url: "https://campus.alibaba.com/",
    tags: ["数据分析"],
    createdAt: now,
    updatedAt: now,
  };

  const jobs: Job[] = [jobByte, jobTencent, jobAli];

  const interviewByte: Interview = {
    id: makeId("iv"),
    jobId: jobByte.id,
    company: "字节跳动",
    position: "产品经理",
    round: "一面",
    date: "2026-09-20",
    interviewer: "李面试官",
    qas: [
      {
        id: makeId("qa"),
        question: "介绍一下你的项目",
        answer: "我负责了一个用户增长分析系统的项目……",
        feedback: "面试官追问了具体的数据指标口径。",
        review: "没有突出业务价值，讲得偏技术实现。",
        improvement: "增加数据指标，先说清楚项目为业务带来的价值再讲实现。",
        tags: ["项目经历"],
      },
      {
        id: makeId("qa"),
        question: "为什么想做产品经理？",
        answer: "因为我喜欢和用户打交道，喜欢解决问题。",
        feedback: "",
        review: "回答比较空泛，缺少个人经历支撑。",
        improvement: "结合具体经历说明转产品的契机。",
        tags: ["动机", "转岗"],
      },
    ],
    overallReview: {
      performance: "整体表现中规中矩，逻辑清晰但缺少数据支撑。",
      strengths: "沟通顺畅，能主动追问澄清题意。",
      weaknesses: "项目介绍偏技术实现，没有突出业务价值。",
      nextSteps: "准备 2-3 个可以量化的项目成果，用 STAR 结构重新梳理。",
    },
    createdAt: now,
    updatedAt: now,
  };

  const interviewTencent: Interview = {
    id: makeId("iv"),
    jobId: jobTencent.id,
    company: "腾讯",
    position: "产品运营",
    round: "一面",
    date: "2026-09-15",
    interviewer: "王经理",
    qas: [
      {
        id: makeId("qa"),
        question: "如何制定一次站内活动的运营策略？",
        answer: "先明确活动目标，再拆解用户路径……",
        feedback: "面试官认可思路，但希望听到具体案例。",
        review: "缺少真实数据佐证效果。",
        improvement: "补充上一份实习中活动的具体转化数据。",
        tags: ["运营策略"],
      },
    ],
    overallReview: {
      performance: "表达自然，思路完整。",
      strengths: "对运营方法论掌握扎实。",
      weaknesses: "案例细节不够具体。",
      nextSteps: "整理 2 个可以讲清楚数据的运营案例。",
    },
    createdAt: now,
    updatedAt: now,
  };

  const interviewAli: Interview = {
    id: makeId("iv"),
    jobId: jobAli.id,
    company: "阿里巴巴",
    position: "数据分析",
    round: "一面",
    date: "2026-09-25",
    interviewer: "",
    qas: [
      {
        id: makeId("qa"),
        question: "笔试中的 SQL 题你是怎么想的？",
        answer: "我用窗口函数做了分组排序……",
        feedback: "",
        review: "",
        improvement: "",
        tags: ["SQL", "笔试复盘"],
      },
    ],
    notes: "笔试通过后约的一面，还没进行，先占位记录时间。",
    createdAt: now,
    updatedAt: now,
  };

  const interviews: Interview[] = [interviewByte, interviewTencent, interviewAli];

  const mistakes: Mistake[] = [
    {
      id: makeId("mis"),
      question: "介绍一下你自己",
      myAnswer: "我叫张三，来自XX大学……（流水账式介绍）",
      problem: "缺少亮点提炼，没有针对岗位做定制。",
      betterAnswer: "按照'专业背景 + 核心项目亮点 + 岗位匹配度'的结构组织回答。",
      source: "自己总结",
      tags: ["自我介绍"],
      frequency: 5,
      importance: "高",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: makeId("mis"),
      question: "介绍一下你的项目",
      myAnswer: "我负责了一个用户增长分析系统的项目……",
      problem: "没有突出业务价值，讲得偏技术实现。",
      betterAnswer: "增加数据指标，先说清楚项目为业务带来的价值再讲实现。",
      source: "面试",
      sourceInterviewId: interviewByte.id,
      company: "字节跳动",
      tags: ["项目经历"],
      frequency: 4,
      importance: "高",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: makeId("mis"),
      question: "为什么做这个项目？",
      myAnswer: "因为老师安排的课程作业。",
      problem: "缺少业务背景介绍，动机显得被动。",
      betterAnswer: "先讲清楚业务背景与需求痛点，再说明自己主动承担的原因。",
      source: "面试",
      sourceInterviewId: interviewByte.id,
      company: "字节跳动",
      tags: ["产品", "项目"],
      frequency: 3,
      importance: "中",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: makeId("mis"),
      question: "为什么选择这个岗位？",
      myAnswer: "因为我喜欢和用户打交道，喜欢解决问题。",
      problem: "回答比较空泛，缺少个人经历支撑，也没有结合具体公司。",
      betterAnswer: "结合具体经历说明转岗契机，再补充为什么是这家公司 / 这个方向。",
      source: "面试",
      sourceInterviewId: interviewByte.id,
      company: "字节跳动",
      tags: ["动机", "转岗"],
      frequency: 3,
      importance: "中",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: makeId("mis"),
      question: "如何看待这个产品的竞品？",
      myAnswer: "还没有系统整理过，临场只能说个大概。",
      problem: "对竞品缺乏结构化认知，容易讲得零散。",
      betterAnswer: "面试前按'定位 - 核心功能 - 差异点 - 数据表现'整理 2-3 家竞品笔记。",
      source: "面经",
      tags: ["竞品分析", "产品"],
      frequency: 2,
      importance: "中",
      createdAt: now,
      updatedAt: now,
    },
  ];

  const companyNotes: CompanyNote[] = [
    {
      id: makeId("note"),
      company: "字节跳动",
      position: "产品经理",
      source: "牛客网",
      process: ["笔试", "一面", "二面", "HR面"],
      frequentQuestions: ["介绍一下你的项目", "为什么转产品", "如何看待某个产品的竞品"],
      summary: "字节偏好逻辑清晰、数据驱动的表达方式，面试节奏较快，建议提前准备好量化成果。",
      tags: ["互联网大厂", "产品"],
      createdAt: now,
      updatedAt: now,
    },
  ];

  const tasks: TaskItem[] = [
    { id: makeId("task"), title: "准备字节二面", done: false, relatedJobId: jobByte.id, createdAt: now },
    { id: makeId("task"), title: "修改产品简历", done: false, createdAt: now },
    { id: makeId("task"), title: "整理腾讯面经", done: false, relatedJobId: jobTencent.id, createdAt: now },
  ];

  await Promise.all([
    put("resumes", resume),
    bulkPut("experiences", experiences),
    bulkPut("jobs", jobs),
    bulkPut("interviews", interviews),
    bulkPut("mistakes", mistakes),
    bulkPut("companyNotes", companyNotes),
    bulkPut("tasks", tasks),
  ]);

   const newSeedFlag: SeedFlag = {
    id: SEED_FLAG_ID,
    done: true,
  };

  await put("meta", newSeedFlag);
}