import { getAll, getById, put, remove as removeRecord } from "../database";
import { publish } from "../events";
import { makeId, nowISO } from "@/lib/utils";
import type { Experience, ExperienceType } from "@/types";

const STORE = "experiences" as const;

export async function getAllExperiences(): Promise<Experience[]> {
  const all = await getAll<Experience>(STORE);
  return all.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function getExperienceById(id: string): Promise<Experience | undefined> {
  return getById<Experience>(STORE, id);
}

/** 按类型筛选（教育 / 实习 / 项目 / 技能），供 useExperiences 分组使用 */
export async function getExperiencesByType(type: ExperienceType): Promise<Experience[]> {
  const all = await getAllExperiences();
  return all.filter((e) => e.type === type);
}

export async function createExperience(input: Omit<Experience, "id" | "updatedAt">): Promise<Experience> {
  const record: Experience = {
    ...input,
    tags: input.tags ?? [],
    id: makeId("exp"),
    updatedAt: nowISO(),
  };
  await put(STORE, record);
  publish(STORE);
  return record;
}

export async function updateExperience(id: string, patch: Partial<Omit<Experience, "id">>): Promise<Experience> {
  const existing = await getById<Experience>(STORE, id);
  if (!existing) throw new Error(`未找到 id 为 ${id} 的经历`);
  const record: Experience = { ...existing, ...patch, id, updatedAt: nowISO() };
  await put(STORE, record);
  publish(STORE);
  return record;
}

export async function removeExperience(id: string): Promise<void> {
  await removeRecord(STORE, id);
  publish(STORE);
}
