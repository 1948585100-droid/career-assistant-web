import { useCallback, useEffect, useState } from "react";
import { getTags } from "@/db/repositories/tagRepo";
import { subscribe } from "@/db/events";
import type { Tag } from "@/types";

/**
 * 标签统计 Hook：页面 → useTags → tagRepo → IndexedDB。
 * 标签本身没有独立的"新增/删除"事件——它是随着 job / experience / interview / mistake
 * 的增删改自动出现或消失的，所以这里同时订阅这四张表，任意一张变化都重新聚合一次。
 */
export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await getTags();
    setTags(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const unsubJobs = subscribe("jobs", refresh);
    const unsubExperiences = subscribe("experiences", refresh);
    const unsubInterviews = subscribe("interviews", refresh);
    const unsubMistakes = subscribe("mistakes", refresh);
    return () => {
      unsubJobs();
      unsubExperiences();
      unsubInterviews();
      unsubMistakes();
    };
  }, [refresh]);

  return { tags, loading, refresh };
}
