import { useState } from "react";
import { Pencil, Trash2, FolderKanban } from "lucide-react";
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
import { TagInput } from "@/components/common/TagInput";
import { SkillTag } from "@/components/resume/SkillTag";
import { useToast } from "@/components/ui/use-toast";
import type { Experience } from "@/types";

interface ProjectCardProps {
  project: Experience;
  /** 保存到 IndexedDB（由页面注入，内部调用 useExperiences().updateExperience） */
  onSave: (id: string, patch: Partial<Omit<Experience, "id">>) => Promise<unknown>;
  /** 删除该项目（由页面注入，内部调用 useExperiences().removeExperience） */
  onDelete: (id: string) => Promise<unknown>;
}

/** 项目经历卡片：项目名称 / 项目背景 / 我的职责 / 成果 / 标签，对应 PRD「项目经历组件」 */
export function ProjectCard({ project, onSave, onDelete }: ProjectCardProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(project);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  function handleOpenChange(next: boolean) {
    if (next) setDraft(project);
    setOpen(next);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(project.id, draft);
      setOpen(false);
      toast({ title: "已保存", description: "已写入本地 IndexedDB，刷新页面后依然存在。" });
    } catch (err) {
      toast({ title: "保存失败", description: String(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`确定要删除项目「${project.title}」吗？此操作会直接从本地数据中移除，无法撤销。`)) {
      return;
    }
    setDeleting(true);
    try {
      await onDelete(project.id);
      toast({ title: "已删除", description: "该项目经历已从本地数据中移除。" });
    } catch (err) {
      toast({ title: "删除失败", description: String(err), variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="group rounded-lg border border-[#E5E6EB] p-4 transition-colors hover:border-primary/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
            <FolderKanban className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{project.title}</p>
            {project.org && <p className="text-xs text-muted-foreground">{project.org}</p>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenChange(true)}>
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-[#FEECEC] hover:text-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 pl-11 text-sm text-foreground/80">
        {project.background && (
          <p>
            <span className="text-muted-foreground">项目背景：</span>
            {project.background}
          </p>
        )}
        {project.responsibility && (
          <p>
            <span className="text-muted-foreground">我的职责：</span>
            {project.responsibility}
          </p>
        )}
        {project.result && (
          <p>
            <span className="text-muted-foreground">成果：</span>
            {project.result}
          </p>
        )}
      </div>

      {project.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 pl-11">
          {project.tags.map((tag) => (
            <SkillTag key={tag} label={tag} />
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑项目经历</DialogTitle>
            <DialogDescription>保存后会直接写入浏览器本地的 IndexedDB。</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>项目名称</Label>
              <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>所属</Label>
              <Input
                value={draft.org ?? ""}
                placeholder="公司 / 团队 / 个人项目"
                onChange={(e) => setDraft({ ...draft, org: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>项目背景</Label>
              <Textarea
                rows={2}
                value={draft.background ?? ""}
                onChange={(e) => setDraft({ ...draft, background: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>我的职责</Label>
              <Textarea
                rows={2}
                value={draft.responsibility ?? ""}
                onChange={(e) => setDraft({ ...draft, responsibility: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>成果</Label>
              <Textarea
                rows={2}
                value={draft.result ?? ""}
                onChange={(e) => setDraft({ ...draft, result: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>标签</Label>
              <TagInput value={draft.tags} onChange={(tags) => setDraft({ ...draft, tags })} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              取消
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "保存中…" : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
