import { getAll, getById, put, remove as removeRecord } from "../database";
import { publish } from "../events";
import { makeId, nowISO } from "@/lib/utils";
import type { Interview, QA } from "@/types";

const STORE = "interviews" as const;

/**
 * 面试记录 Repository。
 * 命名对齐第六轮的要求：getInterviews / getInterviewById / createInterview /
 * updateInterview / deleteInterview（其他模块用的是 getAllX / removeX，这里按本轮
 * 要求单独保留了这一套命名，两者语义完全一致，只是名字不同，供后续统一时参考）。
 */
export async function getInterviews(): Promise<Interview[]> {
  const all = await getAll<Interview>(STORE);
  return all.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getInterviewById(id: string): Promise<Interview | undefined> {
  return getById<Interview>(STORE, id);
}

export async function createInterview(
  input: Omit<Interview, "id" | "createdAt" | "updatedAt">
): Promise<Interview> {
  const now = nowISO();
  const record: Interview = { ...input, qas: input.qas ?? [], id: makeId("iv"), createdAt: now, updatedAt: now };
  await put(STORE, record);
  publish(STORE);
  return record;
}

export async function updateInterview(
  id: string,
  patch: Partial<Omit<Interview, "id" | "createdAt">>
): Promise<Interview> {
  const existing = await getById<Interview>(STORE, id);
  if (!existing) throw new Error(`未找到 id 为 ${id} 的面试记录`);
  const record: Interview = { ...existing, ...patch, id, updatedAt: nowISO() };
  await put(STORE, record);
  publish(STORE);
  return record;
}

export function makeEmptyQA(): QA {
  return { id: makeId("qa"), question: "", answer: "", feedback: "", review: "", improvement: "", tags: [] };
}

export async function deleteInterview(id: string): Promise<void> {
  await removeRecord(STORE, id);
  publish(STORE);
}
