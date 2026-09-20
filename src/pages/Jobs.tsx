import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Briefcase } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobCard } from "@/components/job/JobCard";
import { JobForm, type JobFormValues } from "@/components/job/JobForm";
import { TagFilter } from "@/components/common/TagFilter";
import { useToast } from "@/components/ui/use-toast";
import { useJobs } from "@/hooks/useJobs";
import { JOB_STATUSES, JOB_STATUS_LABEL } from "@/types";
import type { JobStatus } from "@/types";

export default function Jobs() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { jobs, loading, createJob } = useJobs();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [formOpen, setFormOpen] = useState(false);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => j.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [jobs]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesStatus = statusFilter === "all" || job.status === statusFilter;
      if (!matchesStatus) return false;
      const matchesTags = selectedTags.every((t) => job.tags.includes(t));
      if (!matchesTags) return false;
      if (!keyword) return true;
      const haystack = [job.company, job.position, ...job.tags].join(" ").toLowerCase();
      return haystack.includes(keyword);
    });
  }, [jobs, search, statusFilter, selectedTags]);

  async function handleCreate(values: JobFormValues) {
    await createJob({
      company: values.company,
      position: values.position,
      jd: values.jd || undefined,
      url: values.url || undefined,
      location: values.location || undefined,
      deadline: values.deadline || undefined,
      status: values.status,
      tags: values.tags,
    });
    toast({ title: "已添加岗位", description: "已写入本地 IndexedDB，刷新页面后依然存在。" });
  }

  return (
    <div>
      <PageHeader
        title="岗位管理"
        description="记录所有投递岗位与进度"
        actions={
          <Button onClick={() => setFormOpen(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            添加岗位
          </Button>
        }
      />

      <div className="mb-5 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索公司 / 岗位 / 标签"
              className="pl-8"
            />
          </div>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as JobStatus | "all")}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              {JOB_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {JOB_STATUS_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(search || statusFilter !== "all" || selectedTags.length > 0) && (
            <span className="text-xs text-muted-foreground">共 {filtered.length} 个结果</span>
          )}
        </div>

        <TagFilter tags={allTags} selected={selectedTags} onChange={setSelectedTags} />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">正在从本地数据库加载…</p>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="还没有岗位记录"
          description="点击右上角「添加岗位」，开始记录你的秋招进度。"
          actionLabel="添加岗位"
          onAction={() => setFormOpen(true)}
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="没有匹配的岗位" description="换个关键词或状态筛选试试。" />
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} onClick={() => navigate(`/jobs/${job.id}`)} />
          ))}
        </div>
      )}

      <JobForm open={formOpen} onOpenChange={setFormOpen} onSubmit={handleCreate} />
    </div>
  );
}
