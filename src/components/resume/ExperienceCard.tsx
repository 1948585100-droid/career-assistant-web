import { useState } from "react";
import { Pencil, GraduationCap, Building2 } from "lucide-react";
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

interface ExperienceCardProps {
  experience: Experience;
  /** 保存到 IndexedDB（由页面注入，内部调用 useExperiences().updateExperience） */
  onSave: (id: string, patch: Partial<Omit<Experience, "id">>) => Promise<unknown>;
}

/** 教育经历 / 实习经历卡片，两种类型共用同一套结构与编辑弹窗 */
export function ExperienceCard({ experience, onSave }: ExperienceCardProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(experience);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const isEducation = experience.type === "education";

  function handleOpenChange(next: boolean) {
    if (next) setDraft(experience);
    setOpen(next);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(experience.id, draft);
      setOpen(false);
      toast({ title: "已保存", description: "已写入本地 IndexedDB，刷新页面后依然存在。" });
    } catch (err) {
      toast({ title: "保存失败", description: String(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="group rounded-lg border border-[#E5E6EB] p-4 transition-colors hover:border-primary/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
            {isEducation ? <GraduationCap className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{experience.org ?? experience.title}</p>
            <p className="text-xs text-muted-foreground">
              {experience.role}
              {(experience.startDate || experience.endDate) && (
                <span className="ml-1.5">
                  · {experience.startDate ?? ""} - {experience.endDate || "至今"}
                </span>
              )}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => handleOpenChange(true)}
        >
          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </div>

      {(experience.description || experience.responsibility || experience.result) && (
        <div className="mt-3 space-y-1.5 pl-11 text-sm text-foreground/80">
          {experience.description && <p>{experience.description}</p>}
          {experience.responsibility && (
            <p>
              <span className="text-muted-foreground">职责：</span>
              {experience.responsibility}
            </p>
          )}
          {experience.result && (
            <p>
              <span className="text-muted-foreground">成果：</span>
              {experience.result}
            </p>
          )}
        </div>
      )}

      {experience.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 pl-11">
          {experience.tags.map((tag) => (
            <SkillTag key={tag} label={tag} />
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑{isEducation ? "教育经历" : "实习经历"}</DialogTitle>
            <DialogDescription>保存后会直接写入浏览器本地的 IndexedDB。</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{isEducation ? "学校" : "公司"}</Label>
                <Input value={draft.org ?? ""} onChange={(e) => setDraft({ ...draft, org: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>{isEducation ? "专业" : "职位"}</Label>
                <Input value={draft.role ?? ""} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>开始时间</Label>
                <Input
                  placeholder="2025-06"
                  value={draft.startDate ?? ""}
                  onChange={(e) => setDraft({ ...draft, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>结束时间</Label>
                <Input
                  placeholder="至今"
                  value={draft.endDate ?? ""}
                  onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
                />
              </div>
            </div>

            {isEducation ? (
              <div className="space-y-1.5">
                <Label>描述</Label>
                <Textarea
                  rows={3}
                  value={draft.description ?? ""}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </div>
            ) : (
              <>
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
              </>
            )}

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
