import { importBackup, readBackupFile, type ImportMode } from "@/db/exportImport";
import type { CareerBackup } from "@/types";

/**
 * 从用户选择的 career-backup.json 文件恢复数据到 IndexedDB。
 * 具体的读取 / 写入逻辑复用 src/db/exportImport.ts，避免在 utils 层重复实现。
 *
 * @param file  用户通过 <input type="file"> 选择的备份文件
 * @param mode  "merge"（默认，按 id 合并覆盖）| "overwrite"（先清空再导入）
 */
export async function importData(file: File, mode: ImportMode = "merge"): Promise<CareerBackup> {
  const backup = await readBackupFile(file);
  await importBackup(backup, mode);
  return backup;
}
