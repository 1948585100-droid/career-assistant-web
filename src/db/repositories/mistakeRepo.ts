import { getAll, getById, put, remove as removeRecord } from "../database";
import { publish } from "../events";
import { makeId, nowISO } from "@/lib/utils";
import type { Mistake } from "@/types";

const STORE = "mistakes" as const;

/**
 * 错题集 Repository。
 * 命名对齐第七轮的要求：getMistakes / getMistakeById / createMistake /
 * updateMistake / deleteMistake（和第六轮的 interviewRepo 用的是同一套命名风格；
 * Job / Resume / Experience / Task 四个模块用的还是 getAllX / removeX，
 * 两套命名目前在项目里并存，下一轮建议统一）。
 */
export async function getMistakes(): Promise<Mistake[]> {
  const all = await getAll<Mistake>(STORE);
  return all.sort((a, b) => b.frequency - a.frequency);
}

export async function getMistakeById(id: string): Promise<Mistake | undefined> {
  return getById<Mistake>(STORE, id);
}

export async function createMistake(
  input: Omit<Mistake, "id" | "createdAt" | "updatedAt" | "frequency"> & { frequency?: number }
): Promise<Mistake> {
  const now = nowISO();
  const record: Mistake = {
    ...input,
    tags: input.tags ?? [],
    frequency: input.frequency ?? 1,
    id: makeId("mis"),
    createdAt: now,
    updatedAt: now,
  };
  await put(STORE, record);
  publish(STORE);
  return record;
}

export async function updateMistake(
  id: string,
  patch: Partial<Omit<Mistake, "id" | "createdAt">>
): Promise<Mistake> {
  const existing = await getById<Mistake>(STORE, id);
  if (!existing) throw new Error(`未找到 id 为 ${id} 的错题`);
  const record: Mistake = { ...existing, ...patch, id, updatedAt: nowISO() };
  await put(STORE, record);
  publish(STORE);
  return record;
}

/** 便捷方法：命中一次同类问题时提升频率，用于"高频问题"排序 */
export async function bumpMistakeFrequency(id: string): Promise<void> {
  const existing = await getById<Mistake>(STORE, id);
  if (!existing) return;
  await updateMistake(id, { frequency: existing.frequency + 1 });
}

export async function deleteMistake(id: string): Promise<void> {
  await removeRecord(STORE, id);
  publish(STORE);
}
