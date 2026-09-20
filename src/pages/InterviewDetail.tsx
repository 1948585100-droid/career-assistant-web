import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, Plus, CalendarDays, User2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { InterviewForm, type InterviewFormValues } from "@/components/interview/InterviewForm";
import { QuestionCard } from "@/components/interview/QuestionCard";
import { QAEditor } from "@/components/interview/QAEditor";
import { ReviewPanel } from "@/components/interview/ReviewPanel";
import { useToast } from "@/components/ui/use-toast";
import { useInterviews } from "@/hooks/useInterviews";
import { useMistakes } from "@/hooks/useMistakes";
import { formatDate } from "@/lib/utils";
import type { InterviewReview, QA } from "@/types";

export default function InterviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { interviews, loading, updateInterview, deleteInterview } = useInterviews();
  const { createMistake } = useMistakes();

  const interview = useMemo(() => interviews.find((iv) => iv.id === id), [interviews, id]);

  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [qaEditorOpen, setQaEditorOpen] = useState(false);
  const [editingQA, setEditingQA] = useState<QA | undefined>(undefined);

  function openNewQA() {
    setEditingQA(undefined);
    setQaEditorOpen(true);
  }

  function openEditQA(qa: QA) {
    setEditingQA(qa);
    setQaEditorOpen(true);
  }

  async function handleSaveQA(qa: QA) {
    if (!interview) return;
    const exists = interview.qas.some((q) => q.id === qa.id);
    const nextQas = exists ? interview.qas.map((q) => (q.id === qa.id ? qa : q)) : [...interview.qas, qa];
    await updateInterview(interview.id, { qas: nextQas });
    toast({ title: exists ? "问题已更新" : "已新增问题", description: "已写入本地 IndexedDB，刷新页面后依然存在。" });
  }

  async function handleDeleteQA(qaId: string) {
    if (!interview) return;
    if (!window.confirm("确定要删除这道题的记录吗？此操作无法撤销。")) return;
    try {
      await updateInterview(interview.id, { qas: interview.qas.filter((q) => q.id !== qaId) });
      toast({ title: "已删除该问题" });
    } catch (err) {
      toast({ title: "删除失败", description: String(err), variant: "destructive" });
    }
  }

  async function handleAddToMistakes(qa: QA) {
    if (!interview) return;
    try {
      await createMistake({
        question: qa.question,
        myAnswer: qa.answer,
        problem: qa.review ?? "",
        betterAnswer: qa.improvement ?? "",
        source: "面试",
        sourceInterviewId: interview.id,
        company: interview.company,
        tags: qa.tags,
      });
      toast({ title: "已加入错题集", description: "可以在错题集页面继续完善和优化。" });
    } catch (err) {
      toast({ title: "加入失败", description: String(err), variant: "destructive" });
    }
  }

  async function handleSaveReview(review: InterviewReview) {
    if (!interview) return;
    await updateInterview(interview.id, { overallReview: review });
    toast({ title: "整体复盘已保存", description: "已写入本地 IndexedDB，刷新页面后依然存在。" });
  }

  async function handleEditSubmit(values: InterviewFormValues) {
    if (!interview) return;
    await updateInterview(interview.id, {
      jobId: values.jobId,
      company: values.company,
      position: values.position,
      round: values.round,
      date: values.date,
      interviewer: values.interviewer || undefined,
      notes: values.notes || undefined,
    });
    toast({ title: "面试信息已更新" });
  }

  async function handleDeleteInterview() {
    if (!interview) return;
    if (!window.confirm(`确定要删除「${interview.company} · ${interview.position} · ${interview.round}」这条面试记录吗？此操作无法撤销。`))
      return;
    setDeleting(true);
    try {
      await deleteInterview(interview.id);
      toast({ title: "已删除面试记录" });
      navigate("/interviews");
    } catch (err) {
      toast({ title: "删除失败", description: String(err), variant: "destructive" });
      setDeleting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">正在从本地数据库加载…</p>;
  }

  if (!interview) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="没有找到这条面试记录"
        description="它可能已经被删除，返回面试中心看看吧。"
        actionLabel="返回面试中心"
        onAction={() => navigate("/interviews")}
      />
    );
  }

  return (
    <div className="space-y-5 pb-8">
      <button
        type="button"
        onClick={() => navigate("/interviews")}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        返回面试中心
      </button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {interview.company} · {interview.position}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" />
              {interview.round}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(interview.date)}
            </span>
            {interview.interviewer && (
              <span className="flex items-center gap-1">
                <User2 className="h-3.5 w-3.5" />
                {interview.interviewer}
              </span>
            )}
            {interview.jobId && (
              <Link to={`/jobs/${interview.jobId}`} className="text-primary hover:underline">
                查看关联岗位
              </Link>
            )}
          </div>
          {interview.notes && <p className="mt-2 text-sm text-muted-foreground">备注：{interview.notes}</p>}
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
            onClick={handleDeleteInterview}
            disabled={deleting}
          >
            <Trash2 className="h-3.5 w-3.5" />
            删除
          </Button>
        </div>
      </div>

      {/* 问题记录 */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle>问题记录 · {interview.qas.length}</CardTitle>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={openNewQA}>
            <Plus className="h-3.5 w-3.5" />
            新增问题
          </Button>
        </CardHeader>
        <CardContent>
          {interview.qas.length === 0 ? (
            <EmptyState
              icon={Plus}
              title="还没有记录问题"
              description="点击右上角「新增问题」，把这次面试问到的问题和回答记下来。"
              actionLabel="新增问题"
              onAction={openNewQA}
            />
          ) : (
            <div className="space-y-2.5">
              {interview.qas.map((qa, index) => (
                <QuestionCard
                  key={qa.id}
                  qa={qa}
                  index={index}
                  onEdit={() => openEditQA(qa)}
                  onDelete={() => handleDeleteQA(qa.id)}
                  onAddToMistakes={() => handleAddToMistakes(qa)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 整体复盘 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>整体复盘</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewPanel review={interview.overallReview} onSave={handleSaveReview} />
        </CardContent>
      </Card>

      <InterviewForm open={editOpen} onOpenChange={setEditOpen} interview={interview} onSubmit={handleEditSubmit} />
      <QAEditor open={qaEditorOpen} onOpenChange={setQaEditorOpen} qa={editingQA} onSave={handleSaveQA} />
    </div>
  );
}
