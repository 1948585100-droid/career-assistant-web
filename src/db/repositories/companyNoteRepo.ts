import { getAll, getById, put, remove as removeRecord } from "../database";
import { publish } from "../events";
import { makeId, nowISO } from "@/lib/utils";
import type { CompanyNote } from "@/types";

const STORE = "companyNotes" as const;

export async function listCompanyNotes(): Promise<CompanyNote[]> {
  const all = await getAll<CompanyNote>(STORE);
  return all.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function saveCompanyNote(
  input: Omit<CompanyNote, "id" | "createdAt" | "updatedAt"> & { id?: string }
): Promise<CompanyNote> {
  const existing = input.id ? await getById<CompanyNote>(STORE, input.id) : undefined;
  const record: CompanyNote = {
    id: existing?.id ?? input.id ?? makeId("note"),
    company: input.company,
    position: input.position,
    source: input.source,
    process: input.process ?? [],
    frequentQuestions: input.frequentQuestions ?? [],
    summary: input.summary,
    tags: input.tags ?? [],
    createdAt: existing?.createdAt ?? nowISO(),
    updatedAt: nowISO(),
  };
  await put(STORE, record);
  publish(STORE);
  return record;
}

export async function deleteCompanyNote(id: string): Promise<void> {
  await removeRecord(STORE, id);
  publish(STORE);
}
