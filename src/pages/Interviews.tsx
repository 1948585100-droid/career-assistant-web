import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MessagesSquare, Search } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { InterviewCard } from "@/components/interview/InterviewCard";
import { InterviewForm, type InterviewFormValues } from "@/components/interview/InterviewForm";
import { TagFilter } from "@/components/common/TagFilter";
import { useToast } from "@/components/ui/use-toast";
import { useInterviews } from "@/hooks/useInterviews";

export default function Interviews() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { interviews, loading, createInterview, deleteInterview } = useInterviews();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    interviews.forEach((iv) => iv.qas.forEach((qa) => qa.tags.forEach((t) => set.add(t))));
    return Array.from(set);
  }, [interviews]);

  const filtered = useMemo(() => {
    if (selectedTags.length === 0) return interviews;
    return interviews.filter((iv) => {
      const ivTags = iv.qas.flatMap((qa) => qa.tags);
      return selectedTags.every((t) => ivTags.includes(t));
    });
  }, [interviews, selectedTags]);

  async function handleCreate(values: InterviewFormValues) {
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
    toast({ title: "已新建面试记录", description: "已写入本地 IndexedDB，刷新页面后依然存在。" });
  }

  async function handleDelete(id: string, label: string) {
    if (!window.confirm(`确定要删除「${label}」这条面试记录吗？此操作无法撤销。`)) return;
    try {
      await deleteInterview(id);
      toast({ title: "已删除面试记录" });
    } catch (err) {
      toast({ title: "删除失败", description: String(err), variant: "destructive" });
    }
  }

  return (
    <div>
      <PageHeader
        title="面试中心"
        description="完整记录每一次面试，方便复盘"
        actions={
          <Button onClick={() => setFormOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            新建面试记录
          </Button>
        }
      />

      <div className="mb-5">
        <TagFilter tags={allTags} selected={selectedTags} onChange={setSelectedTags} />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">正在从本地数据库加载…</p>
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title="还没有面试记录"
          description="点击右上角「新建面试记录」，开始积累你的面试复盘。"
          actionLabel="新建面试记录"
          onAction={() => setFormOpen(true)}
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="没有匹配的面试记录" description="换个标签筛选试试。" />
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filtered.map((iv) => (
            <InterviewCard
              key={iv.id}
              interview={iv}
              onClick={() => navigate(`/interviews/${iv.id}`)}
              onDelete={() => handleDelete(iv.id, `${iv.company} · ${iv.position} · ${iv.round}`)}
            />
          ))}
        </div>
      )}

      <InterviewForm open={formOpen} onOpenChange={setFormOpen} onSubmit={handleCreate} />
    </div>
  );
}
