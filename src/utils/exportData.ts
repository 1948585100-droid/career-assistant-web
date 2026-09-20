import { exportBackup, downloadBackup } from "@/db/exportImport";
import type { CareerBackup } from "@/types";

/**
 * 导出全部本地数据（简历 / 经历 / 岗位 / 面试 / 错题 / 任务 等）为 CareerBackup 对象。
 * 具体的 IndexedDB 读取逻辑复用 src/db/exportImport.ts，避免在 utils 层重复实现。
 */
export async function getExportSnapshot(): Promise<CareerBackup> {
  return exportBackup();
}

/**
 * 导出并触发浏览器下载 career-backup-YYYY-MM-DD.json。
 * 供「数据管理」页面的"导出数据"按钮调用。
 */
export async function exportData(): Promise<void> {
  await downloadBackup();
}
