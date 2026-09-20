import { useEffect, useState } from "react";
import { Pencil, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { EmptyState } from "@/components/common/EmptyState";
import type { InterviewReview } from "@/types";

const EMPTY_REVIEW: InterviewReview = { performance: "", strengths: "", weaknesses: "", nextSteps: "" };

interface ReviewPanelProps {
  review?: InterviewReview;
  onSave: (review: InterviewReview) => Promise<unknown>;
}

/** 整体复盘面板：整体表现 / 优势 / 不足 / 下一步改进，支持查看 + 编辑（编辑不直接保存，需点击"保存"） */
export function ReviewPanel({ review, onSave }: ReviewPanelProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<InterviewReview>(review ?? EMPTY_REVIEW);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setDraft(review ?? EMPTY_REVIEW);
  }, [open, review]);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(draft);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  const hasContent = Boolean(
    review && (review.performance || review.strengths || review.weaknesses || review.nextSteps)
  );

  return (
    <div>
      {hasContent ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ReviewField label="整体表现" value={review?.performance} />
          <ReviewField label="优势" value={review?.strengths} tone="success" />
          <ReviewField label="不足" value={review?.weaknesses} tone="warning" />
          <ReviewField label="下一步改进" value={review?.nextSteps} tone="primary" />
        </div>
      ) : (
        <EmptyState
          icon={ClipboardCheck}
          title="还没有整体复盘"
          description="面试结束后，花几分钟写下整体表现、优势、不足和下一步改进。"
          actionLabel="写复盘"
          onAction={() => setOpen(true)}
        />
      )}

      {hasContent && (
        <Button variant="ghost" size="sm" className="mt-3 gap-1.5 text-muted-foreground" onClick={() => setOpen(true)}>
          <Pencil className="h-3.5 w-3.5" />
          编辑复盘
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>整体复盘</DialogTitle>
            <DialogDescription>保存后会直接写入浏览器本地的 IndexedDB。</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>整体表现</Label>
              <Textarea
                rows={2}
                value={draft.performance ?? ""}
                onChange={(e) => setDraft({ ...draft, performance: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>优势</Label>
              <Textarea
                rows={2}
                value={draft.strengths ?? ""}
                onChange={(e) => setDraft({ ...draft, strengths: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>不足</Label>
              <Textarea
                rows={2}
                value={draft.weaknesses ?? ""}
                onChange={(e) => setDraft({ ...draft, weaknesses: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>下一步改进</Label>
              <Textarea
                rows={2}
                value={draft.nextSteps ?? ""}
                onChange={(e) => setDraft({ ...draft, nextSteps: e.target.value })}
              />
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

function ReviewField({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value?: string;
  tone?: "default" | "success" | "warning" | "primary";
}) {
  const toneClass = {
    default: "bg-secondary/60 text-foreground/80",
    success: "bg-[#E7F9F1] text-success",
    warning: "bg-[#FFF3E0] text-warning",
    primary: "bg-primary-light text-primary",
  }[tone];

  return (
    <div className={`rounded-lg px-3 py-2.5 text-sm ${toneClass}`}>
      <p className="mb-1 text-xs font-medium opacity-70">{label}</p>
      <p>{value || "-"}</p>
    </div>
  );
}
