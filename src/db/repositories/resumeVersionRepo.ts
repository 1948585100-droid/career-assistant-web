import { getAll, put, remove as removeRecord } from "../database";
import { publish } from "../events";
import { makeId, nowISO } from "@/lib/utils";
import type { ResumeVersion } from "@/types";

const STORE = "resumeVersions" as const;

export async function listResumeVersions(): Promise<ResumeVersion[]> {
  const all = await getAll<ResumeVersion>(STORE);
  return all.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function saveResumeVersion(
  input: Omit<ResumeVersion, "id" | "updatedAt"> & { id?: string }
): Promise<ResumeVersion> {
  const record: ResumeVersion = {
    id: input.id ?? makeId("ver"),
    name: input.name,
    jobId: input.jobId,
    experienceIds: input.experienceIds ?? [],
    note: input.note,
    updatedAt: nowISO(),
  };
  await put(STORE, record);
  publish(STORE);
  return record;
}

export async function deleteResumeVersion(id: string): Promise<void> {
  await removeRecord(STORE, id);
  publish(STORE);
}
