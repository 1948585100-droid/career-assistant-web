import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, BookX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { SkillTag } from "@/components/resume/SkillTag";
import { FrequencyBadge } from "@/components/mistake/FrequencyBadge";
import { MistakeDetailCard } from "@/components/mistake/MistakeDetailCard";
import { MistakeForm, type MistakeFormValues } from "@/components/mistake/MistakeForm";
import { useToast } from "@/components/ui/use-toast";
import { useMistakes } from "@/hooks/useMistakes";
import { useInterviews } from "@/hooks/useInterviews";

export default function MistakeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mistakes, loading, updateMistake, deleteMistake } = useMistakes();
  const { interviews } = useInterviews();

  const mistake = useMemo(() => mistakes.find((m) => m.id === id), [mistakes, id]);
  const sourceInterview = useMemo(
    () => (mistake?.sourceInterviewId ? interviews.find((iv) => iv.id === mistake.sourceInterviewId) : undefined),
    [interviews, mistake]
  );

  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleEditSubmit(values: MistakeFormValues) {
    if (!mistake) return;
    await updateMistake(mistake.id, {
      question: values.question,
      myAnswer: values.myAnswer,
      problem: values.problem,
      betterAnswer: values.betterAnswer,
      source: values.source || undefined,
      tags: values.tags,
      frequency: values.frequency,
      importance: values.importance || undefined,
    });
    toast({ title: "错题已更新", description: "已写入本地 IndexedDB，刷新页面后依然存在。" });
  }

  async function handleDelete() {
    if (!mistake) return;
    if (!window.confirm("确定要删除这条错题记录吗？此操作无法撤销。")) return;
    setDeleting(true);
    try {
      await deleteMistake(mistake.id);
      toast({ title: "已删除错题" });
      navigate("/mistakes");
    } catch (err) {
      toast({ title: "删除失败", description: String(err), variant: "destructive" });
      setDeleting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">正在从本地数据库加载…</p>;
  }

  if (!mistake) {
    return (
      <EmptyState
        icon={BookX}
        title="没有找到这条错题记录"
        description="它可能已经被删除，返回错题集看看吧。"
        actionLabel="返回错题集"
        onAction={() => navigate("/mistakes")}
      />
    );
  }

  return (
    <div className="space-y-5 pb-8">
      <button
        type="button"
        onClick={() => navigate("/mistakes")}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        返回错题集
      </button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{mistake.question}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <FrequencyBadge frequency={mistake.frequency} />
            {mistake.importance && <Badge variant="outline">重要程度：{mistake.importance}</Badge>}
            {mistake.source && <Badge variant="neutral">来源：{mistake.source}</Badge>}
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

      <Card>
        <CardContent className="p-6">
          <MistakeDetailCard mistake={mistake} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>关联信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">来源面试</p>
            {sourceInterview ? (
              <Link to={`/interviews/${sourceInterview.id}`} className="text-sm text-primary hover:underline">
                {sourceInterview.company} {sourceInterview.position} {sourceInterview.round}
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">没有关联具体的面试记录</p>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">标签</p>
            {mistake.tags.length === 0 ? (
              <p className="text-sm text-muted-foreground">还没有标签</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {mistake.tags.map((tag) => (
                  <SkillTag key={tag} label={tag} />
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">出现次数</p>
            <p className="text-sm text-foreground">{mistake.frequency}</p>
          </div>
        </CardContent>
      </Card>

      <MistakeForm open={editOpen} onOpenChange={setEditOpen} mistake={mistake} onSubmit={handleEditSubmit} />
    </div>
  );
}
