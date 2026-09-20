import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TagInput } from "@/components/common/TagInput";
import { MISTAKE_SOURCES, MISTAKE_IMPORTANCE_OPTIONS } from "@/types";
import type { Mistake } from "@/types";

export interface MistakeFormValues {
  question: string;
  myAnswer: string;
  problem: string;
  betterAnswer: string;
  source: string;
  tags: string[];
  frequency: number;
  importance: string;
}

const NO_SOURCE = "__none__";
const NO_IMPORTANCE = "__none__";

function toFormValues(mistake?: Mistake): MistakeFormValues {
  return {
    question: mistake?.question ?? "",
    myAnswer: mistake?.myAnswer ?? "",
    problem: mistake?.problem ?? "",
    betterAnswer: mistake?.betterAnswer ?? "",
    source: mistake?.source ?? "",
    tags: mistake?.tags ?? [],
    frequency: mistake?.frequency ?? 1,
    importance: mistake?.importance ?? "",
  };
}

interface MistakeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 传入已有错题 = 编辑模式；不传 = 新增模式 */
  mistake?: Mistake;
  onSubmit: (values: MistakeFormValues) => Promise<unknown>;
}

/** 新增 / 编辑错题的弹窗表单：问题 / 我的回答 / 问题分析 / 优化答案 / 来源 / 标签 / 频率 / 重要程度 */
export function MistakeForm({ open, onOpenChange, mistake, onSubmit }: MistakeFormProps) {
  const [values, setValues] = useState<MistakeFormValues>(() => toFormValues(mistake));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(mistake);

  useEffect(() => {
    if (open) {
      setValues(toFormValues(mistake));
      setError(null);
    }
  }, [open, mistake]);

  async function handleSubmit() {
    if (!values.question.trim()) {
      setError("请至少填写问题内容。");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(values);
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
          <DialogTitle>{isEdit ? "编辑错题" : "新增错题"}</DialogTitle>
          <DialogDescription>保存后会直接写入浏览器本地的 IndexedDB。</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>问题 *</Label>
            <Textarea
              rows={2}
              value={values.question}
              onChange={(e) => setValues({ ...values, question: e.target.value })}
              placeholder="例如：为什么选择产品经理？"
            />
          </div>
          <div className="space-y-1.5">
            <Label>我的回答</Label>
            <Textarea
              rows={2}
              value={values.myAnswer}
              onChange={(e) => setValues({ ...values, myAnswer: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>问题分析</Label>
            <Textarea
              rows={2}
              value={values.problem}
              onChange={(e) => setValues({ ...values, problem: e.target.value })}
              placeholder="这道题回答得怎么样，问题出在哪"
            />
          </div>
          <div className="space-y-1.5">
            <Label>优化答案</Label>
            <Textarea
              rows={2}
              value={values.betterAnswer}
              onChange={(e) => setValues({ ...values, betterAnswer: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>来源</Label>
              <Select
                value={values.source || NO_SOURCE}
                onValueChange={(v) => setValues({ ...values, source: v === NO_SOURCE ? "" : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选填" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_SOURCE}>不设置</SelectItem>
                  {MISTAKE_SOURCES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>重要程度</Label>
              <Select
                value={values.importance || NO_IMPORTANCE}
                onValueChange={(v) => setValues({ ...values, importance: v === NO_IMPORTANCE ? "" : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选填" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_IMPORTANCE}>不设置</SelectItem>
                  {MISTAKE_IMPORTANCE_OPTIONS.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>出现频率</Label>
            <Input
              type="number"
              min={1}
              value={values.frequency}
              onChange={(e) => setValues({ ...values, frequency: Math.max(1, Number(e.target.value) || 1) })}
              className="max-w-[120px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label>标签</Label>
            <TagInput
              value={values.tags}
              onChange={(tags) => setValues({ ...values, tags })}
              placeholder="输入标签后回车，如 自我介绍"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "保存中…" : "保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
