import { bulkPut, clearAll, getAll } from "./database";
import { nowISO } from "@/lib/utils";
import type {
  CareerBackup,
  CompanyNote,
  Experience,
  Interview,
  Job,
  Mistake,
  Resume,
  ResumeVersion,
  TaskItem,
  UserProfile,
} from "@/types";
import { publishMany } from "./events";

const BACKUP_VERSION = 1;

/** 汇总所有表，导出为一份 career-backup.json，用于换电脑 / 手动备份 */
export async function exportBackup(): Promise<CareerBackup> {
  const [user, resumes, experiences, resumeVersions, jobs, interviews, mistakes, companyNotes, tasks] =
    await Promise.all([
      getAll<UserProfile>("user"),
      getAll<Resume>("resumes"),
      getAll<Experience>("experiences"),
      getAll<ResumeVersion>("resumeVersions"),
      getAll<Job>("jobs"),
      getAll<Interview>("interviews"),
      getAll<Mistake>("mistakes"),
      getAll<CompanyNote>("companyNotes"),
      getAll<TaskItem>("tasks"),
    ]);

  return {
    version: BACKUP_VERSION,
    exportedAt: nowISO(),
    user,
    resumes,
    experiences,
    resumeVersions,
    jobs,
    interviews,
    mistakes,
    companyNotes,
    tasks,
  };
}

/** 触发浏览器下载 career-backup.json */
export async function downloadBackup(): Promise<void> {
  const backup = await exportBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = backup.exportedAt.slice(0, 10);
  a.href = url;
  a.download = `career-backup-${date}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export type ImportMode = "merge" | "overwrite";

/** 从备份 JSON 恢复数据。overwrite 会先清空现有数据，merge 则按 id 合并覆盖 */
export async function importBackup(backup: CareerBackup, mode: ImportMode = "merge"): Promise<void> {
  if (mode === "overwrite") {
    await clearAll();
  }
  await Promise.all([
    bulkPut("user", backup.user ?? []),
    bulkPut("resumes", backup.resumes ?? []),
    bulkPut("experiences", backup.experiences ?? []),
    bulkPut("resumeVersions", backup.resumeVersions ?? []),
    bulkPut("jobs", backup.jobs ?? []),
    bulkPut("interviews", backup.interviews ?? []),
    bulkPut("mistakes", backup.mistakes ?? []),
    bulkPut("companyNotes", backup.companyNotes ?? []),
    bulkPut("tasks", backup.tasks ?? []),
  ]);
  publishMany([
    "user",
    "resumes",
    "experiences",
    "resumeVersions",
    "jobs",
    "interviews",
    "mistakes",
    "companyNotes",
    "tasks",
  ]);
}

/** 读取用户选择的 JSON 文件并解析为 CareerBackup，做基本的格式校验 */
export function readBackupFile(file: File): Promise<CareerBackup> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed || typeof parsed !== "object" || !("version" in parsed)) {
          reject(new Error("文件格式不正确，不是有效的秋招数据备份文件。"));
          return;
        }
        resolve(parsed as CareerBackup);
      } catch {
        reject(new Error("JSON 解析失败，请确认选择的是 career-backup.json 文件。"));
      }
    };
    reader.onerror = () => reject(new Error("读取文件失败。"));
    reader.readAsText(file);
  });
}
