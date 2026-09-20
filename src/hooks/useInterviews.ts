import { useCallback, useEffect, useState } from "react";
import {
  getInterviews,
  createInterview,
  updateInterview,
  deleteInterview,
  makeEmptyQA,
} from "@/db/repositories/interviewRepo";
import { subscribe } from "@/db/events";
import type { Interview } from "@/types";

/**
 * 面试中心 Hook：页面 → useInterviews → Repository → IndexedDB。
 * 页面（Interviews.tsx / InterviewDetail.tsx / JobDetail.tsx）只允许通过这个 Hook
 * 读写面试数据，不直接 import db/repositories/interviewRepo。
 */
export function useInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await getInterviews();
    setInterviews(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    return subscribe("interviews", refresh);
  }, [refresh]);

  return {
    interviews,
    loading,
    refresh,
    createInterview,
    updateInterview,
    deleteInterview,
    makeEmptyQA,
  };
}
