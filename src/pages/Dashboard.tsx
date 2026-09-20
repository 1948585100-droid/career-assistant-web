import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Send, MessagesSquare, Trophy, FileEdit, Briefcase, BookX, NotebookText, Flame, Hash, Tags } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { RecentJobCard } from "@/components/dashboard/RecentJobCard";
import { TaskList } from "@/components/dashboard/TaskList";
import { TagList } from "@/components/common/TagList";
import { useJobs } from "@/hooks/useJobs";
import { useInterviews } from "@/hooks/useInterviews";
import { useMistakes } from "@/hooks/useMistakes";
import { useTags } from "@/hooks/useTags";
import { useTasks } from "@/hooks/useTasks";
import { formatDate } from "@/lib/utils";
import { HIGH_FREQUENCY_THRESHOLD } from "@/types";

const QUICK_ACTIONS = [
  { title: "添加岗位", description: "记录一个新的目标岗位", icon: Briefcase, to: "/jobs" },
  { title: "记录面试", description: "结构化整理一次面试问答", icon: MessagesSquare, to: "/interviews" },
  { title: "整理简历", description: "维护基础简历与经历库", icon: FileEdit, to: "/resume" },
  { title: "沉淀错题", description: "记下这次没答好的问题", icon: BookX, to: "/mistakes" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { jobs, loading: jobsLoading } = useJobs();
  const { interviews, loading: interviewsLoading } = useInterviews();
  const { mistakes, loading: mistakesLoading } = useMistakes();
  const { tags, loading: tagsLoading } = useTags();
  const { tasks, loading: tasksLoading, toggleTask } = useTasks();

  const loading = jobsLoading || interviewsLoading || tasksLoading;

  // "投递数"：状态已经超过"仅收藏"的岗位，即真正投递出去的岗位数
  const appliedCount = useMemo(() => jobs.filter((j) => j.status !== "favorite").length, [jobs]);
  const offerCount = useMemo(() => jobs.filter((j) => j.status === "offer").length, [jobs]);
  const interviewCount = interviews.length;

  const highFrequencyCount = useMemo(
    () => mistakes.filter((m) => m.frequency >= HIGH_FREQUENCY_THRESHOLD).length,
    [mistakes]
  );
  // 这里的"最高频标签"改成全项目统计（Job / 经历库 / 面试问题 / 错题的标签都算进来），
  // 不再只看错题——tags 已经按 count 从高到低排好序，取第一个即可。
  const topTag = tags[0]?.name;

  const recentJobs = useMemo(
    () =>
      [...jobs]
        .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
        .slice(0, 5),
    [jobs]
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">欢迎回来</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">秋招进度一目了然</h1>
      </div>

      {/* 秋招进度统计（数据来自 IndexedDB：jobs / interviews） */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="投递数" value={loading ? "…" : appliedCount} icon={Send} hint="累计投递岗位数" />
        <StatCard
          label="面试数"
          value={loading ? "…" : interviewCount}
          icon={MessagesSquare}
          hint="已完成的面试轮次"
          accent="warning"
        />
        <StatCard label="Offer" value={loading ? "…" : offerCount} icon={Trophy} hint="拿到手的 Offer 数" accent="success" />
      </div>

      {/* 错题复盘统计（数据来自 IndexedDB：mistakes） */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="错题数量"
          value={mistakesLoading ? "…" : mistakes.length}
          icon={BookX}
          hint="累计沉淀的问题数"
        />
        <StatCard
          label="高频问题数量"
          value={mistakesLoading ? "…" : highFrequencyCount}
          icon={Flame}
          hint={`出现 ${HIGH_FREQUENCY_THRESHOLD} 次及以上`}
          accent="warning"
        />
        <StatCard
          label="最高频标签"
          value={tagsLoading ? "…" : topTag ? `#${topTag}` : "-"}
          icon={Hash}
          hint="全项目出现次数最多的标签"
        />
      </div>

      {/* 快捷入口 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_ACTIONS.map((action) => (
          <QuickActionCard key={action.to} {...action} />
        ))}
      </div>

      {/* 最近任务 + 最近岗位 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2">
              <NotebookText className="h-4 w-4 text-muted-foreground" />
              最近任务
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <p className="text-sm text-muted-foreground">加载中…</p>
            ) : (
              <TaskList items={tasks} onToggle={toggleTask} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              最近岗位
            </CardTitle>
            <Link to="/jobs" className="text-xs font-medium text-primary hover:underline">
              查看全部
            </Link>
          </CardHeader>
          <CardContent className="space-y-0.5">
            {jobsLoading ? (
              <p className="text-sm text-muted-foreground">加载中…</p>
            ) : recentJobs.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">还没有岗位记录</p>
            ) : (
              recentJobs.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  className="block w-full text-left"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <RecentJobCard
                    company={job.company}
                    position={job.position}
                    status={job.status}
                    updatedLabel={formatDate(job.updatedAt)}
                  />
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* 我的能力标签：全项目（岗位/经历库/面试问题/错题）标签使用次数聚合 */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Tags className="h-4 w-4 text-muted-foreground" />
            我的能力标签
          </CardTitle>
          <span className="text-xs text-muted-foreground">按出现次数从高到低</span>
        </CardHeader>
        <CardContent>
          {tagsLoading ? (
            <p className="text-sm text-muted-foreground">加载中…</p>
          ) : (
            <TagList tags={tags} max={10} emptyText="还没有任何标签，去岗位 / 面试 / 错题里加几个标签试试。" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
