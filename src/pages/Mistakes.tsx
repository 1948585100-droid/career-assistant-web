import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, BookX } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MistakeCard } from "@/components/mistake/MistakeCard";
import { MistakeForm, type MistakeFormValues } from "@/components/mistake/MistakeForm";
import { TagFilter } from "@/components/common/TagFilter";
import { useToast } from "@/components/ui/use-toast";
import { useMistakes } from "@/hooks/useMistakes";
import { useInterviews } from "@/hooks/useInterviews";

export default function Mistakes() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mistakes, loading, createMistake, deleteMistake } = useMistakes();
  const { interviews } = useInterviews();

  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [formOpen, setFormOpen] = useState(false);

  /** 错题没有直接存公司时，通过 sourceInterviewId 反查关联面试的公司，供搜索使用 */
  function getCompany(m: (typeof mistakes)[number]): string {
    if (m.company) return m.company;
    if (m.sourceInterviewId) {
      return interviews.find((iv) => iv.id === m.sourceInterviewId)?.company ?? "";
    }
    return "";
  }

  const allTags = useMemo(() => {
    const set = new Set<string>();
    mistakes.forEach((m) => m.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [mistakes]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return mistakes.filter((m) => {
      const matchesTags = selectedTags.every((t) => m.tags.includes(t));
      if (!matchesTags) return false;
      if (!keyword) return true;
      const haystack = [m.question, ...m.tags, getCompany(m)].join(" ").toLowerCase();
      return haystack.includes(keyword);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mistakes, search, selectedTags, interviews]);

  async function handleCreate(values: MistakeFormValues) {
    await createMistake({
      question: values.question,
      myAnswer: values.myAnswer,
      problem: values.problem,
      betterAnswer: values.betterAnswer,
      source: values.source || undefined,
      tags: values.tags,
      frequency: values.frequency,
      importance: values.importance || undefined,
    });
    toast({ title: "已新增错题", description: "已写入本地 IndexedDB，刷新页面后依然存在。" });
  }

  async function handleDelete(id: string) {
    if (!window.confirm("确定要删除这条错题记录吗？此操作无法撤销。")) return;
    try {
      await deleteMistake(id);
      toast({ title: "已删除错题" });
    } catch (err) {
      toast({ title: "删除失败", description: String(err), variant: "destructive" });
    }
  }

  return (
    <div>
      <PageHeader
        title="错题集"
        description="沉淀你的薄弱问题与优化答案"
        actions={
          <Button onClick={() => setFormOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            新增错题
          </Button>
        }
      />

      <div className="mb-5 space-y-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索问题 / 标签 / 公司"
            className="pl-8"
          />
        </div>
        <TagFilter tags={allTags} selected={selectedTags} onChange={setSelectedTags} />
        {(search || selectedTags.length > 0) && (
          <p className="text-xs text-muted-foreground">共 {filtered.length} 个结果</p>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">正在从本地数据库加载…</p>
      ) : mistakes.length === 0 ? (
        <EmptyState
          icon={BookX}
          title="还没有错题记录"
          description="点击右上角「新增错题」，或者从面试详情页把答得不好的问题加入错题集。"
          actionLabel="新增错题"
          onAction={() => setFormOpen(true)}
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="没有匹配的错题" description="换个关键词或标签筛选试试。" />
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filtered.map((m) => (
            <MistakeCard
              key={m.id}
              mistake={m}
              onClick={() => navigate(`/mistakes/${m.id}`)}
              onDelete={() => handleDelete(m.id)}
            />
          ))}
        </div>
      )}

      <MistakeForm open={formOpen} onOpenChange={setFormOpen} onSubmit={handleCreate} />
    </div>
  );
}
