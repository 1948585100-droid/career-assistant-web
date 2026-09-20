import { useCallback, useEffect, useState } from "react";
import {
  getPrimaryResume,
  createResume as createResumeRepo,
  updateResume as updateResumeRepo,
} from "@/db/repositories/resumeRepo";
import {
  getAllExperiences,
  createExperience as createExperienceRepo,
  removeExperience as removeExperienceRepo,
} from "@/db/repositories/experienceRepo";
import { subscribe } from "@/db/events";
import type { Experience, Resume } from "@/types";

/**
 * 简历中心的主 Hook：页面 → useResume → Repository → IndexedDB。
 * 提供：获取简历、更新简历、添加经历、删除经历。
 * 更细粒度的经历分组（教育/实习/项目/技能）见 useExperiences()。
 */
export function useResume() {
  const [resume, setResume] = useState<Resume | undefined>(undefined);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [resumeData, experienceData] = await Promise.all([getPrimaryResume(), getAllExperiences()]);
    setResume(resumeData);
    setExperiences(experienceData);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const unsubResume = subscribe("resumes", refresh);
    const unsubExperiences = subscribe("experiences", refresh);
    return () => {
      unsubResume();
      unsubExperiences();
    };
  }, [refresh]);

  /** 更新基础简历；如果本地还没有任何简历，会用传入的字段直接创建一份 */
  const updateResume = useCallback(
    async (patch: Partial<Omit<Resume, "id">>) => {
      if (resume) {
        return updateResumeRepo(resume.id, patch);
      }
      return createResumeRepo({
        title: "基础简历",
        name: "",
        ...patch,
      });
    },
    [resume]
  );

  const addExperience = useCallback((input: Omit<Experience, "id" | "updatedAt">) => {
    return createExperienceRepo(input);
  }, []);

  const removeExperience = useCallback((id: string) => {
    return removeExperienceRepo(id);
  }, []);

  return { resume, experiences, loading, updateResume, addExperience, removeExperience, refresh };
}
