import { buildSearchIndex, type SearchEntryType, type SearchIndexSources } from "@/utils/searchIndex";

export type SearchResultType = SearchEntryType;

/** 全局搜索返回的一条结果 */
export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  tags: string[];
  route: string;
}

export const SEARCH_TYPE_LABEL: Record<SearchResultType, string> = {
  job: "岗位",
  interview: "面试问题",
  mistake: "错题",
  resume: "简历",
};

/** 结果分组展示时的顺序：岗位 → 面试问题 → 错题 → 简历 */
export const SEARCH_TYPE_ORDER: SearchResultType[] = ["job", "interview", "mistake", "resume"];

const MAX_RESULTS = 50;
const DESCRIPTION_LENGTH = 60;

/**
 * 全局搜索：先用 buildSearchIndex 把四类数据拍平成统一索引，
 * 再对 title / content / tags 做关键词包含匹配。
 * 本地数据量不大，暂时用最简单的"包含匹配"，不做分词或相关度排序。
 */
export function globalSearch(keyword: string, sources: SearchIndexSources): SearchResult[] {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return [];

  const index = buildSearchIndex(sources);

  const matched = index.filter((entry) => {
    const haystack = [entry.title, entry.content, ...entry.tags].join(" ").toLowerCase();
    return haystack.includes(kw);
  });

  return matched.slice(0, MAX_RESULTS).map((entry) => ({
    id: entry.id,
    type: entry.type,
    title: entry.title,
    description:
      entry.content.length > DESCRIPTION_LENGTH ? `${entry.content.slice(0, DESCRIPTION_LENGTH)}…` : entry.content,
    tags: entry.tags,
    route: entry.route,
  }));
}
