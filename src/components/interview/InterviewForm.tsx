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
import { useJobs } from "@/hooks/useJobs";
import { INTERVIEW_ROUNDS } from "@/types";
import type { Interview, Job } from "@/types";

const NO_JOB = "__none__";

export interface InterviewFormValues {
  jobId?: string;
  company: string;
  position: string;
  round: string;
  date: string;
  interviewer: string;
  notes: string;
}

function toFormValues(interview?: Interview, defaultJobId?: string, jobs: Job[] = []): InterviewFormValues {
  const defaultJob = !interview && defaultJobId ? jobs.find((j) => j.id === defaultJobId) : undefined;
  return {
    jobId: interview?.jobId ?? defaultJobId,
    company: interview?.company ?? defaultJob?.company ?? "",
    position: interview?.position ?? defaultJob?.position ?? "",
    round: interview?.round ?? "一面",
    date: interview?.date ?? new Date().toISOString().slice(0, 10),
    interviewer: interview?.interviewer ?? "",
    notes: interview?.notes ?? "",
  };
}

interface InterviewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 传入已有面试 = 编辑模式；不传 = 新增模式 */
  interview?: Interview;
  /** 从岗位详情页点击"添加面试"进来时，预先带上要关联的岗位 id */
  defaultJobId?: string;
  onSubmit: (values: InterviewFormValues) => Promise<unknown>;
}

/** 新建 / 编辑面试记录的弹窗表单：公司 / 岗位 / 关联 Job / 轮次 / 日期 / 面试官 / 备注 */
export function InterviewForm({ open, onOpenChange, interview, defaultJobId, onSubmit }: InterviewFormProps) {
  const { jobs } = useJobs();
  const [values, setValues] = useState<InterviewFormValues>(() => toFormValues(interview, defaultJobId, jobs));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(interview);

  useEffect(() => {
    if (open) {
      setValues(toFormValues(interview, defaultJobId, jobs));
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, interview, defaultJobId]);

  function handleJobSelect(jobId: string) {
    if (jobId === NO_JOB) {
      setValues({ ...values, jobId: undefined });
      return;
    }
    const job = jobs.find((j) => j.id === jobId);
    setValues({
      ...values,
      jobId,
      // 关联岗位后自动带出公司 / 岗位名称，仍然允许手动修改
      company: job?.company ?? values.company,
      position: job?.position ?? values.position,
    });
  }

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
          <DialogTitle>{isEdit ? "编辑面试记录" : "新建面试记录"}</DialogTitle>
          <DialogDescription>保存后会直接写入浏览器本地的 IndexedDB。</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>关联岗位</Label>
            <Select value={values.jobId ?? NO_JOB} onValueChange={handleJobSelect}>
              <SelectTrigger>
                <SelectValue placeholder="不关联具体岗位" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_JOB}>不关联</SelectItem>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.company} · {job.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>面试轮次</Label>
              <Select value={values.round} onValueChange={(v) => setValues({ ...values, round: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INTERVIEW_ROUNDS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>日期</Label>
              <Input
                type="date"
                value={values.date}
                onChange={(e) => setValues({ ...values, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>面试官</Label>
            <Input
              value={values.interviewer}
              onChange={(e) => setValues({ ...values, interviewer: e.target.value })}
              placeholder="选填"
            />
          </div>

          <div className="space-y-1.5">
            <Label>备注</Label>
            <Textarea
              rows={2}
              value={values.notes}
              onChange={(e) => setValues({ ...values, notes: e.target.value })}
              placeholder="选填，例如面试形式、注意事项等"
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
