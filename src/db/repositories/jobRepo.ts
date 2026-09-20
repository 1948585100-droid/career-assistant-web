import { getAll, getById, put, remove as removeRecord } from "../database";
import { publish } from "../events";
import { makeId, nowISO } from "@/lib/utils";
import type { Job, JobStatus } from "@/types";

const STORE = "jobs" as const;

export async function getAllJobs(): Promise<Job[]> {
  const all = await getAll<Job>(STORE);
  return all.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function getJobById(id: string): Promise<Job | undefined> {
  return getById<Job>(STORE, id);
}

export async function createJob(input: Omit<Job, "id" | "createdAt" | "updatedAt">): Promise<Job> {
  const now = nowISO();
  const record: Job = { ...input, tags: input.tags ?? [], id: makeId("job"), createdAt: now, updatedAt: now };
  await put(STORE, record);
  publish(STORE);
  return record;
}

export async function updateJob(id: string, patch: Partial<Omit<Job, "id" | "createdAt">>): Promise<Job> {
  const existing = await getById<Job>(STORE, id);
  if (!existing) throw new Error(`未找到 id 为 ${id} 的岗位`);
  const record: Job = { ...existing, ...patch, id, updatedAt: nowISO() };
  if (patch.status === "applied" && !record.appliedDate) {
    record.appliedDate = nowISO();
  }
  await put(STORE, record);
  publish(STORE);
  return record;
}

/** 便捷方法：只更新投递状态 */
export async function updateJobStatus(id: string, status: JobStatus): Promise<Job> {
  return updateJob(id, { status });
}

export async function removeJob(id: string): Promise<void> {
  await removeRecord(STORE, id);
  publish(STORE);
}
