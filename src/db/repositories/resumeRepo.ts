import { getAll, getById, put, remove as removeRecord } from "../database";
import { publish } from "../events";
import { makeId, nowISO } from "@/lib/utils";
import type { Resume } from "@/types";

const STORE = "resumes" as const;

/** 读取全部简历（当前阶段业务上只维护一份"基础简历"） */
export async function getAllResumes(): Promise<Resume[]> {
  const all = await getAll<Resume>(STORE);
  return all.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function getResumeById(id: string): Promise<Resume | undefined> {
  return getById<Resume>(STORE, id);
}

/** 取列表中最新的一份，作为"基础简历"使用 */
export async function getPrimaryResume(): Promise<Resume | undefined> {
  const all = await getAllResumes();
  return all[0];
}

export async function createResume(input: Omit<Resume, "id" | "updatedAt">): Promise<Resume> {
  const record: Resume = { ...input, id: makeId("resume"), updatedAt: nowISO() };
  await put(STORE, record);
  publish(STORE);
  return record;
}

export async function updateResume(id: string, patch: Partial<Omit<Resume, "id">>): Promise<Resume> {
  const existing = await getById<Resume>(STORE, id);
  if (!existing) throw new Error(`未找到 id 为 ${id} 的简历`);
  const record: Resume = { ...existing, ...patch, id, updatedAt: nowISO() };
  await put(STORE, record);
  publish(STORE);
  return record;
}

export async function removeResume(id: string): Promise<void> {
  await removeRecord(STORE, id);
  publish(STORE);
}
