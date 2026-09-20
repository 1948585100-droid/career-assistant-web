import type { Experience, Interview, Job, Mistake, Resume } from "@/types";

export type SearchEntryType = "resume" | "job" | "interview" | "mistake";

/** 统一搜索索引里的一条记录 */
export interface SearchIndexEntry {
  id: string;
  type: SearchEntryType;
  title: string;
  content: string; // 拼接后的可搜索正文，用于关键词匹配
  tags: string[];
  route: string;
}

export interface SearchIndexSources {
  resume?: Resume;
  experiences: Experience[];
  jobs: Job[];
  interviews: Interview[];
  mistakes: Mistake[];
}

function join(...parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * 把 Resume / Job / Interview / Mistake 四类数据拍平成统一格式的搜索索引。
 * 面试记录会拆成"面试本身"一条 + "每个问题"各一条，方便直接搜到某道具体的问题。
 * 这个函数只负责"建索引"，真正的关键词匹配和结果整理在 services/searchService.ts。
 */
export function buildSearchIndex(sources: SearchIndexSources): SearchIndexEntry[] {
  const index: SearchIndexEntry[] = [];

  // 1. Resume：姓名 / 目标岗位 / 总结
  if (sources.resume) {
    const r = sources.resume;
    index.push({
      id: r.id,
      type: "resume",
      title: r.name || "基础简历",
      content: join(r.name, r.school, r.major, r.targetPosition, r.summary),
      tags: [],
      route: `/resume/${r.id}`,
    });
  }

  // 2. Resume 的经历库：项目名称 / 技能
  sources.experiences.forEach((e) => {
    if (e.type !== "project" && e.type !== "skill") return;
    index.push({
      id: e.id,
      type: "resume",
      title: e.title,
      content: join(e.title, e.org, e.background, e.responsibility, e.result, e.description),
      tags: e.tags,
      route: sources.resume ? `/resume/${sources.resume.id}` : "/resume",
    });
  });

  // 3. Jobs：公司 / 岗位 / JD / 标签
  sources.jobs.forEach((j) => {
    index.push({
      id: j.id,
      type: "job",
      title: `${j.company} · ${j.position}`,
      content: join(j.company, j.position, j.jd, j.location),
      tags: j.tags,
      route: `/jobs/${j.id}`,
    });
  });

  // 4. Interviews：问题 / 回答 / 公司（面试本身一条 + 每个问题各一条）
  sources.interviews.forEach((iv) => {
    index.push({
      id: iv.id,
      type: "interview",
      title: `${iv.company} · ${iv.position} · ${iv.round}`,
      content: join(iv.company, iv.position, iv.round, iv.interviewer, iv.notes),
      tags: [],
      route: `/interviews/${iv.id}`,
    });

    iv.qas.forEach((qa) => {
      index.push({
        id: qa.id,
        type: "interview",
        title: qa.question || "未命名问题",
        content: join(qa.question, qa.answer, qa.feedback, qa.review, qa.improvement, iv.company),
        tags: qa.tags,
        route: `/interviews/${iv.id}`,
      });
    });
  });

  // 5. Mistakes：问题 / 我的回答 / 优化答案 / 标签
  sources.mistakes.forEach((m) => {
    index.push({
      id: m.id,
      type: "mistake",
      title: m.question,
      content: join(m.question, m.myAnswer, m.problem, m.betterAnswer, m.company),
      tags: m.tags,
      route: `/mistakes/${m.id}`,
    });
  });

  return index;
}
