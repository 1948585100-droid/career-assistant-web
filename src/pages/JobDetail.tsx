import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  ExternalLink,
  MapPin,
  CalendarClock,
  FileText,
  MessagesSquare,
  BookX,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/job/StatusBadge";
import { JobTimeline } from "@/components/job/JobTimeline";
import { JobForm, type JobFormValues } from "@/components/job/JobForm";
import { InterviewForm, type InterviewFormValues } from "@/components/interview/InterviewForm";
import { useToast } from "@/components/ui/use-toast";
import { useJobs } from "@/hooks/useJobs";
import { useInterviews } from "@/hooks/useInterviews";
import { useMistakes } from "@/hooks/useMistakes";
import { useResume } from "@/hooks/useResume";
import { formatDate } from "@/lib/utils";
import { JOB_STATUSES, JOB_STATUS_LABEL } from "@/types";
import type { JobStatus } from "@/types";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { jobs, loading: jobsLoading, updateJob, updateJobStatus, removeJob } = useJobs();
  const { interviews, loading: interviewsLoading, createInterview } = useInterviews();
  const { mistakes, loading: mistakesLoading } = useMistakes();
  const { resume } = useResume();

  const [editOpen, setEditOpen] = useState(false);
  const [interviewFormOpen, setInterviewFormOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const job = useMemo(() => jobs.find((j) => j.id === id), [jobs, id]);

  const relatedInterviews = useMemo(
    () => interviews.filter((iv) => iv.jobId === id),
    [interviews, id]
  );
  const relatedInterviewIds = useMemo(() => new Set(relatedInterviews.map((iv) => iv.id)), [relatedInterviews]);
  const relatedMistakes = useMemo(
    () => mistakes.filter((m) => m.sourceInterviewId && relatedInterviewIds.has(m.sourceInterviewId)),
    [mistakes, relatedInterviewIds]
  );

  const loading = jobsLoading || interviewsLoading || mistakesLoading;

  async function handleEditSubmit(values: JobFormValues) {
    if (!job) return;
    await updateJob(job.id, {
      company: values.company,
      position: values.position,
      jd: values.jd || undefined,
      url: values.url || undefined,
      location: values.location || undefined,
      deadline: values.deadline || undefined,
      status: values.status,
      tags: values.tags,
    });
    toast({ title: "已更新岗位信息" });
  }

  async function handleStatusChange(status: JobStatus) {
    if (!job) return;
    try {
      await updateJobStatus(job.id, status);
      toast({ title: "投递状态已更新", description: `已切换为「${JOB_STATUS_LABEL[status]}」` });
    } catch (err) {
      toast({ title: "更新失败", description: String(err), variant: "destructive" });
    }
  }

  async function handleCreateInterview(values: InterviewFormValues) {
    await createInterview({
      jobId: values.jobId,
      company: values.company,
      position: values.position,
      round: values.round,
      date: values.date,
      interviewer: values.interviewer || undefined,
      notes: values.notes || undefined,
      qas: [],
    });
    toast({ title: "已新建面试记录", description: "已自动关联到当前岗位。" });
  }

  async function handleDelete() {
    if (!job) return;
    if (!window.confirm(`确定要删除「${job.company} · ${job.position}」这条岗位记录吗？此操作无法撤销。`)) return;
    setDeleting(true);
    try {
      await removeJob(job.id);
      toast({ title: "已删除岗位" });
      navigate("/jobs");
    } catch (err) {
      toast({ title: "删除失败", description: String(err), variant: "destructive" });
      setDeleting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">正在从本地数据库加载…</p>;
  }

  if (!job) {
    return (
      <EmptyState
        icon={FileText}
        title="没有找到这个岗位"
        description="它可能已经被删除，返回岗位列表看看吧。"
        actionLabel="返回岗位管理"
        onAction={() => navigate("/jobs")}
      />
    );
  }

  return (
    <div className="space-y-5 pb-8">
      <button
        type="button"
        onClick={() => navigate("/jobs")}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        返回岗位管理
      </button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold text-foreground">{job.company}</h1>
            <StatusBadge status={job.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{job.position}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
            )}
            {job.deadline && (
              <span className="flex items-center gap-1">
                <CalendarClock className="h-3 w-3" />
                截止 {formatDate(job.deadline)}
              </span>
            )}
            {job.url && (
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                查看职位页面
              </a>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditOpen(true)}>
            <Pencil className="h-3.5 w-3.5" />
            编辑
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-danger hover:bg-[#FEECEC] hover:text-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="h-3.5 w-3.5" />
            删除
          </Button>
        </div>
      </div>

      {/* 投递进度 */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle>投递进度</CardTitle>
          <Select value={job.status} onValueChange={(v) => handleStatusChange(v as JobStatus)}>
            <SelectTrigger className="w-32">
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
        </CardHeader>
        <CardContent className="overflow-x-auto pb-8 pt-2">
          <JobTimeline status={job.status} />
        </CardContent>
      </Card>

      {/* JD 内容 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>职位描述</CardTitle>
        </CardHeader>
        <CardContent>
          {job.jd ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">{job.jd}</p>
          ) : (
            <p className="text-sm text-muted-foreground">还没有记录 JD 内容，点击右上角「编辑」补充。</p>
          )}
        </CardContent>
      </Card>

      {/* 关联信息 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <CardTitle>使用简历</CardTitle>
          </CardHeader>
          <CardContent>
            {resume ? (
              <Link to={`/resume/${resume.id}`} className="text-sm text-primary hover:underline">
                {resume.title}（{resume.name || "未命名"}）
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">还没有简历</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">岗位定制简历版本会在后续版本开放。</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <MessagesSquare className="h-4 w-4 text-muted-foreground" />
              <CardTitle>面试记录 · {relatedInterviews.length}</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => setInterviewFormOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              添加面试
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {relatedInterviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">还没有关联的面试记录，点击右上角「添加面试」创建一条。</p>
            ) : (
              relatedInterviews.map((iv) => (
                <Link
                  key={iv.id}
                  to={`/interviews/${iv.id}`}
                  className="block rounded-lg bg-secondary/60 px-3 py-2 text-sm transition-colors hover:bg-secondary"
                >
                  <p className="font-medium text-foreground">{iv.round}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(iv.date)}</p>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
            <BookX className="h-4 w-4 text-muted-foreground" />
            <CardTitle>关联错题 · {relatedMistakes.length}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {relatedMistakes.length === 0 ? (
              <p className="text-sm text-muted-foreground">还没有来自这个岗位面试的错题记录。</p>
            ) : (
              relatedMistakes.map((m) => (
                <div key={m.id} className="rounded-lg bg-secondary/60 px-3 py-2 text-sm">
                  <p className="truncate font-medium text-foreground">{m.question}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <JobForm open={editOpen} onOpenChange={setEditOpen} job={job} onSubmit={handleEditSubmit} />
      <InterviewForm
        open={interviewFormOpen}
        onOpenChange={setInterviewFormOpen}
        defaultJobId={job.id}
        onSubmit={handleCreateInterview}
      />
    </div>
  );
}
