import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import type { Resume } from "@/types";

interface ResumeEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resume: Resume;
  /** 保存到 IndexedDB（由页面注入，内部调用 useResume().updateResume） */
  onSave: (patch: Partial<Omit<Resume, "id">>) => Promise<unknown>;
}

/**
 * 基本信息编辑弹窗：姓名 / 学校 / 专业 / 电话 / 邮箱 / 一句话总结。
 * 保存会直接写入 IndexedDB（通过 useResume().updateResume）。
 */
export function ResumeEditor({ open, onOpenChange, resume, onSave }: ResumeEditorProps) {
  const [draft, setDraft] = useState(resume);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) setDraft(resume);
  }, [open, resume]);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(draft);
      onOpenChange(false);
      toast({ title: "基本信息已更新", description: "已写入本地 IndexedDB，刷新页面后依然存在。" });
    } catch (err) {
      toast({ title: "保存失败", description: String(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑基本信息</DialogTitle>
          <DialogDescription>保存后会直接写入浏览器本地的 IndexedDB。</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>姓名</Label>
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>目标岗位</Label>
              <Input
                value={draft.targetPosition ?? ""}
                onChange={(e) => setDraft({ ...draft, targetPosition: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>学校</Label>
              <Input value={draft.school ?? ""} onChange={(e) => setDraft({ ...draft, school: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>专业</Label>
              <Input value={draft.major ?? ""} onChange={(e) => setDraft({ ...draft, major: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>电话</Label>
              <Input value={draft.phone ?? ""} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>邮箱</Label>
              <Input value={draft.email ?? ""} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>一句话总结</Label>
            <Textarea
              rows={3}
              value={draft.summary ?? ""}
              onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "保存中…" : "保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
