import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllExperiences,
  createExperience as createExperienceRepo,
  updateExperience as updateExperienceRepo,
  removeExperience as removeExperienceRepo,
} from "@/db/repositories/experienceRepo";
import { subscribe } from "@/db/events";
import type { Experience } from "@/types";

/**
 * 经历库 Hook：负责教育经历 / 实习经历 / 项目经历 / 技能标签的读取与增删改。
 * 数据来源统一是 IndexedDB 的 experiences 表，按 type 字段在内存中分组，
 * 避免每种类型各开一张表。
 */
export function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await getAllExperiences();
    setExperiences(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    return subscribe("experiences", refresh);
  }, [refresh]);

  const education = useMemo(() => experiences.filter((e) => e.type === "education"), [experiences]);
  const internships = useMemo(() => experiences.filter((e) => e.type === "internship"), [experiences]);
  const projects = useMemo(() => experiences.filter((e) => e.type === "project"), [experiences]);
  const skills = useMemo(() => experiences.filter((e) => e.type === "skill"), [experiences]);

  const createExperience = useCallback((input: Omit<Experience, "id" | "updatedAt">) => {
    return createExperienceRepo(input);
  }, []);

  const updateExperience = useCallback((id: string, patch: Partial<Omit<Experience, "id">>) => {
    return updateExperienceRepo(id, patch);
  }, []);

  const removeExperience = useCallback((id: string) => {
    return removeExperienceRepo(id);
  }, []);

  return {
    experiences,
    education,
    internships,
    projects,
    skills,
    loading,
    refresh,
    createExperience,
    updateExperience,
    removeExperience,
  };
}
