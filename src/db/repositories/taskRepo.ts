import { getAll, getById, put, remove as removeRecord } from "../database";
import { publish } from "../events";
import { makeId, nowISO } from "@/lib/utils";
import type { TaskItem } from "@/types";

const STORE = "tasks" as const;

export async function getAllTasks(): Promise<TaskItem[]> {
  const all = await getAll<TaskItem>(STORE);
  return all.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getTaskById(id: string): Promise<TaskItem | undefined> {
  return getById<TaskItem>(STORE, id);
}

export async function createTask(
  input: Omit<TaskItem, "id" | "createdAt" | "done"> & { done?: boolean }
): Promise<TaskItem> {
  const record: TaskItem = { ...input, done: input.done ?? false, id: makeId("task"), createdAt: nowISO() };
  await put(STORE, record);
  publish(STORE);
  return record;
}

export async function updateTask(id: string, patch: Partial<Omit<TaskItem, "id" | "createdAt">>): Promise<TaskItem> {
  const existing = await getById<TaskItem>(STORE, id);
  if (!existing) throw new Error(`未找到 id 为 ${id} 的任务`);
  const record: TaskItem = { ...existing, ...patch, id };
  await put(STORE, record);
  publish(STORE);
  return record;
}

export async function toggleTask(id: string): Promise<void> {
  const existing = await getById<TaskItem>(STORE, id);
  if (!existing) return;
  await updateTask(id, { done: !existing.done });
}

export async function removeTask(id: string): Promise<void> {
  await removeRecord(STORE, id);
  publish(STORE);
}
