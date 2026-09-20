import { useCallback, useEffect, useState } from "react";
import {
  getMistakes,
  getMistakeById,
  createMistake,
  updateMistake,
  bumpMistakeFrequency,
  deleteMistake,
} from "@/db/repositories/mistakeRepo";
import { subscribe } from "@/db/events";
import type { Mistake } from "@/types";

/**
 * 错题集 Hook：页面 → useMistakes → Repository → IndexedDB。
 * 页面（Mistakes.tsx / MistakeDetail.tsx / InterviewDetail.tsx）只允许通过这个
 * Hook 读写错题数据，不直接 import db/repositories/mistakeRepo。
 */
export function useMistakes() {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await getMistakes();
    setMistakes(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    return subscribe("mistakes", refresh);
  }, [refresh]);

  return {
    mistakes,
    loading,
    refresh,
    getMistakeById,
    createMistake,
    updateMistake,
    bumpMistakeFrequency,
    deleteMistake,
  };
}
