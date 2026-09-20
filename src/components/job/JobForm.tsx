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
import { JOB_STATUSES, JOB_STATUS_LABEL } from "@/types";
import type { Job, JobStatus } from "@/types";

export interface JobFormValues {
  company: string;
  position: string;
  jd: string;
  url: string;
  location: string;
  deadline: string;
  status: JobStatus;
  tags: string[];
}

function toFormValues(job?: Job): JobFormValues {
  return {
    company: job?.company ?? "",
    position: job?.position ?? "",
    jd: job?.jd ?? "",
    url: job?.url ?? "",
    location: job?.location ?? "",
    deadline: job?.deadline ?? "",
    status: job?.status ?? "favorite",
    tags: job?.tags ?? [],
  };
}

interface JobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 传入已有岗位 = 编辑模式；不传 = 新增模式 */
  job?: Job;
  onSubmit: (values: JobFormValues) => Promise<unknown>;
}

/** 新增 / 编辑岗位的弹窗表单：公司 / 岗位 / JD / 链接 / 地点 / 截止时间 / 状态 / 标签 */
export function JobForm({ open, onOpenChange, job, onSubmit }: JobFormProps) {
  const [values, setValues] = useState<JobFormValues>(() => toFormValues(job));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(job);

  useEffect(() => {
    if (open) {
      setValues(toFormValues(job));
      setError(null);
    }
  }, [open, job]);

  async function handleSubmit() {
    if (!values.company.trim() || !values.position.trim()) {
      setError("请至少填写公司和岗位名称。");
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
          <DialogTitle>{isEdit ? "编辑岗位" : "添加岗位"}</DialogTitle>
          <DialogDescription>保存后会直接写入浏览器本地的 IndexedDB。</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>公司 *</Label>
              <Input
                value={values.company}
                onChange={(e) => setValues({ ...values, company: e.target.value })}
                placeholder="例如：字节跳动"
              />
            </div>
            <div className="space-y-1.5">
              <Label>岗位 *</Label>
              <Input
                value={values.position}
                onChange={(e) => setValues({ ...values, position: e.target.value })}
                placeholder="例如：产品经理"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>JD 内容</Label>
            <Textarea
              rows={4}
              value={values.jd}
              onChange={(e) => setValues({ ...values, jd: e.target.value })}
              placeholder="粘贴职位描述，方便后续对照面试问题"
            />
          </div>

          <div className="space-y-1.5">
            <Label>职位链接</Label>
            <Input
              value={values.url}
              onChange={(e) => setValues({ ...values, url: e.target.value })}
              placeholder="https://…"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>地点</Label>
              <Input
                value={values.location}
                onChange={(e) => setValues({ ...values, location: e.target.value })}
                placeholder="例如：北京"
              />
            </div>
            <div className="space-y-1.5">
              <Label>截止时间</Label>
              <Input
                type="date"
                value={values.deadline}
                onChange={(e) => setValues({ ...values, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>投递状态</Label>
            <Select value={values.status} onValueChange={(v) => setValues({ ...values, status: v as JobStatus })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JOB_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {JOB_STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>标签</Label>
            <TagInput
              value={values.tags}
              onChange={(tags) => setValues({ ...values, tags })}
              placeholder="输入标签后回车，如 产品 / 增长"
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
