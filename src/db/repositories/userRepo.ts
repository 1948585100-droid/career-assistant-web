import { getAll, put } from "../database";
import { makeId, nowISO } from "@/lib/utils";
import type { UserProfile } from "@/types";

const STORE = "user" as const;

export async function getUser(): Promise<UserProfile | undefined> {
  const all = await getAll<UserProfile>(STORE);
  return all[0];
}

export async function ensureUser(name = "同学"): Promise<UserProfile> {
  const existing = await getUser();
  if (existing) return existing;
  const record: UserProfile = { id: makeId("user"), name, createdAt: nowISO() };
  await put(STORE, record);
  return record;
}

export async function renameUser(name: string): Promise<UserProfile> {
  const existing = await ensureUser();
  existing.name = name;
  await put(STORE, existing);
  return existing;
}
