import { useRef, useState, type ChangeEvent } from "react";
import { DatabaseBackup, Download, Upload, TriangleAlert } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { exportData } from "@/utils/exportData";
import { importData } from "@/utils/importData";

export default function Settings() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      await exportData();
      toast({ title: "导出成功", description: "career-backup-*.json 已开始下载。" });
    } catch (err) {
      toast({ title: "导出失败", description: String(err), variant: "destructive" });
    } finally {
      setExporting(false);
    }
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // 允许连续选择同一个文件
    if (!file) return;

    setImporting(true);
    try {
      await importData(file, "merge");
      toast({ title: "导入成功", description: "本地数据已恢复，各页面会自动刷新为最新数据。" });
    } catch (err) {
      toast({ title: "导入失败", description: String(err), variant: "destructive" });
    } finally {
      setImporting(false);
    }
  }

  return (
    <div>
      <PageHeader title="数据管理" description="导入 / 导出 / 备份你的本地秋招数据" />

      <div className="max-w-xl space-y-4">
        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-primary">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>导出我的秋招数据</CardTitle>
              <CardDescription>包含简历、经历、岗位、面试、错题、任务等全部本地数据</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExport} disabled={exporting} className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              {exporting ? "正在导出…" : "导出 career-backup.json"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-primary">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>导入备份数据</CardTitle>
              <CardDescription>用于换电脑或数据恢复，按 id 与现有数据合并</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" onClick={handleImportClick} disabled={importing} className="gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              {importing ? "正在导入…" : "选择 career-backup.json"}
            </Button>
            <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={handleFileChange} />

            <div className="flex items-start gap-2 rounded-lg bg-[#FFF3E0] px-3 py-2.5 text-xs text-warning">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <p>
                首次打开本应用时会自动写入一份演示数据。如果只想保留导入的数据，建议先在浏览器开发者工具中清空
                IndexedDB（career_os_db）再导入，避免演示数据与你的真实数据混在一起。
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start gap-2 px-1 text-xs text-muted-foreground">
          <DatabaseBackup className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p>所有数据都保存在当前浏览器的 IndexedDB 中，不会上传到任何服务器。清除浏览器数据会一并清除本应用的数据，请定期导出备份。</p>
        </div>
      </div>
    </div>
  );
}
