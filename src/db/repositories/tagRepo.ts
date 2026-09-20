import { getAll, put } from "../database";
import type { Experience, Interview, Job, Mistake, Tag } from "@/types";

const STORE = "tags" as const;

/** tags 表里只存元数据（目前是颜色），不存 count —— 见下面的设计说明 */
interface TagMeta {
  id: string;
  name: string;
  color?: string;
}

function tagId(name: string): string {
  return `tag_${encodeURIComponent(name)}`;
}

/**
 * 标签在这个项目里没有单独的实体：Job.tags / Experience.tags / Interview.qas[].tags /
 * Mistake.tags 各自管理自己的标签数组。如果在 tags 表里单独维护一个 count 字段，
 * 那么任何一处新增、编辑、删除标签（比如在 ProjectCard 里改了标签）都必须记得同步更新
 * 这个 count，一旦漏掉就会出现"标签数量对不上"的 bug，而且很难排查。
 *
 * 所以这里的策略是：count 永远是调用 getTags() 时实时聚合出来的，不持久化、不会过期。
 * tags 这张表只用来存放"你想给某个标签自定义颜色"这类和统计无关的元数据。
 */
export async function getTags(): Promise<Tag[]> {
  const [jobs, experiences, interviews, mistakes, metas] = await Promise.all([
    getAll<Job>("jobs"),
    getAll<Experience>("experiences"),
    getAll<Interview>("interviews"),
    getAll<Mistake>("mistakes"),
    getAll<TagMeta>(STORE),
  ]);

  const counts = new Map<string, number>();
  const bump = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    counts.set(trimmed, (counts.get(trimmed) ?? 0) + 1);
  };

  jobs.forEach((j) => j.tags.forEach(bump));
  experiences.forEach((e) => e.tags.forEach(bump));
  interviews.forEach((iv) => iv.qas.forEach((qa) => qa.tags.forEach(bump)));
  mistakes.forEach((m) => m.tags.forEach(bump));

  const metaByName = new Map(metas.map((meta) => [meta.name, meta]));

  return Array.from(counts.entries())
    .map(([name, count]) => ({
      id: metaByName.get(name)?.id ?? tagId(name),
      name,
      color: metaByName.get(name)?.color,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/** 新增 / 更新一个标签的自定义颜色等元数据（不影响它的使用次数统计） */
export async function createTag(name: string, color?: string): Promise<Tag> {
  const trimmed = name.trim();
  const record: TagMeta = { id: tagId(trimmed), name: trimmed, color };
  await put(STORE, record);
  const tags = await getTags();
  return tags.find((t) => t.name === trimmed) ?? { ...record, count: 0 };
}

/**
 * 重新计算某个标签当前的实时使用次数。
 * 因为 count 从不持久化，这个函数本质上是"重新聚合并返回最新值"，而不是"写入覆盖某个存储字段"。
 */
export async function updateTagCount(name: string): Promise<number> {
  const tags = await getTags();
  return tags.find((t) => t.name === name)?.count ?? 0;
}
