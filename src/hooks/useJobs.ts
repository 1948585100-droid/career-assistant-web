import { useCallback, useEffect, useState } from "react";
import {
  getAllJobs,
  createJob,
  updateJob,
  updateJobStatus,
  removeJob,
} from "@/db/repositories/jobRepo";
import { subscribe } from "@/db/events";
import type { Job } from "@/types";

/**
 * 岗位管理 Hook（预留接口，Jobs 页面会在后续开发阶段接入）。
 * 已经打通 Repository → IndexedDB，页面接入时无需再改数据层。
 */
export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await getAllJobs();
    setJobs(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    return subscribe("jobs", refresh);
  }, [refresh]);

  return { jobs, loading, refresh, createJob, updateJob, updateJobStatus, removeJob };
}
