import { useCallback, useEffect, useState } from "react";
import { useResume } from "@/hooks/useResume";
import { useJobs } from "@/hooks/useJobs";
import { useInterviews } from "@/hooks/useInterviews";
import { useMistakes } from "@/hooks/useMistakes";
import { globalSearch, type SearchResult } from "@/services/searchService";

const DEBOUNCE_MS = 120;

/**
 * 全局搜索 Hook：不重新打一次 IndexedDB，而是复用 Resume / Jobs / Interviews / Mistakes
 * 已经各自订阅好的数据（这些 Hook 内部都已经是 Page → Hook → Repository → IndexedDB），
 * 在内存里对拍平后的索引做关键词匹配。这样搜索结果永远和列表页看到的数据一致，
 * 也不会因为搜索另外发起一套数据获取逻辑而产生"两份数据不同步"的问题。
 */
export function useSearch() {
  const { resume, experiences } = useResume();
  const { jobs } = useJobs();
  const { interviews } = useInterviews();
  const { mistakes } = useMistakes();

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback((value: string) => {
    setKeyword(value);
  }, []);

  const clear = useCallback(() => {
    setKeyword("");
    setResults([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const found = globalSearch(keyword, { resume, experiences, jobs, interviews, mistakes });
      setResults(found);
      setLoading(false);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [keyword, resume, experiences, jobs, interviews, mistakes]);

  return { keyword, search, results, loading, clear };
}
