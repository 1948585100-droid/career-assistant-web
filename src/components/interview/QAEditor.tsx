import { useEffect, useState } from "react";
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
import { TagSelector } from "@/components/interview/TagSelector";
import { makeId } from "@/lib/utils";
import type { QA } from "@/types";

function toDraft(qa?: QA): QA {
  return qa ?? { id: makeId("qa"), question: "", answer: "", feedback: "", review: "", improvement: "", tags: [] };
}

interface QAEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 传入已有问题 = 编辑；不传 = 新增一条问题 */
  qa?: QA;
  onSave: (qa: QA) => Promise<unknown>;
}

/** 新增 / 编辑单个面试问答：问题 / 我的回答 / 面试反馈 / 问题复盘 / 优化答案 / 标签 */
export function QAEditor({ open, onOpenChange, qa, onSave }: QAEditorProps) {
  const [draft, setDraft] = useState<QA>(() => toDraft(qa));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(qa);

  useEffect(() => {
    if (open) {
      setDraft(toDraft(qa));
      setError(null);
    }
  }, [open, qa]);

  async function handleSave() {
    if (!draft.question.trim()) {
      setError("请至少填写问题内容。");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(draft);
      onOpenChange(false);
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑问题" : "新增问题"}</DialogTitle>
          <DialogDescription>保存后会直接写入浏览器本地的 IndexedDB。</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>问题</Label>
            <Textarea
              rows={2}
              value={draft.question}
              onChange={(e) => setDraft({ ...draft, question: e.target.value })}
              placeholder="例如：介绍一下你的项目"
            />
          </div>
          <div className="space-y-1.5">
            <Label>我的回答</Label>
            <Textarea
              rows={3}
              value={draft.answer}
              onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>面试反馈</Label>
            <Textarea
              rows={2}
              value={draft.feedback ?? ""}
              onChange={(e) => setDraft({ ...draft, feedback: e.target.value })}
              placeholder="面试官当场的反馈，选填"
            />
          </div>
          <div className="space-y-1.5">
            <Label>问题复盘</Label>
            <Textarea
              rows={2}
              value={draft.review ?? ""}
              onChange={(e) => setDraft({ ...draft, review: e.target.value })}
              placeholder="这道题回答得怎么样，问题出在哪"
            />
          </div>
          <div className="space-y-1.5">
            <Label>优化答案</Label>
            <Textarea
              rows={2}
              value={draft.improvement ?? ""}
              onChange={(e) => setDraft({ ...draft, improvement: e.target.value })}
              placeholder="例如：使用 STAR 结构回答"
            />
          </div>
          <div className="space-y-1.5">
            <Label>标签</Label>
            <TagSelector value={draft.tags} onChange={(tags) => setDraft({ ...draft, tags })} />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}
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
