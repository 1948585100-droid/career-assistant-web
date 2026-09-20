import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ResumeCard } from "@/components/resume/ResumeCard";
import { useResume } from "@/hooks/useResume";

export default function Resume() {
  const navigate = useNavigate();
  const { resume, experiences, loading } = useResume();

  return (
    <div>
      <PageHeader title="简历中心" description="管理你的基础简历、经历库与岗位定制版本" />

      {loading ? (
        <p className="text-sm text-muted-foreground">正在从本地数据库加载…</p>
      ) : !resume ? (
        <EmptyState
          icon={FileText}
          title="还没有简历"
          description="本地数据初始化后会自动生成一份基础简历，如果没有看到，请尝试刷新页面。"
        />
      ) : (
        <div className="max-w-2xl">
          <ResumeCard
            resume={resume}
            projectCount={experiences.filter((e) => e.type === "project").length}
            experienceCount={experiences.filter((e) => e.type !== "skill").length}
            skills={experiences.filter((e) => e.type === "skill").map((e) => e.title)}
            onClick={() => navigate(`/resume/${resume.id}`)}
          />
        </div>
      )}
    </div>
  );
}
