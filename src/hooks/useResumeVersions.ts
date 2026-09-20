import { useCallback, useEffect, useState } from "react";
import { listResumeVersions } from "@/db/repositories/resumeVersionRepo";
import { subscribe } from "@/db/events";
import type { ResumeVersion } from "@/types";

export function useResumeVersions() {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await listResumeVersions();
    setVersions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    return subscribe("resumeVersions", refresh);
  }, [refresh]);

  return { versions, loading, refresh };
}
