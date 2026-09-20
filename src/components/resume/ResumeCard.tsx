import { FileText, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SkillTag } from "@/components/resume/SkillTag";
import { formatDate } from "@/lib/utils";
import type { Resume } from "@/types";

interface ResumeCardProps {
  resume: Resume;
  projectCount: number;
  experienceCount: number;
  skills: string[];
  onClick?: () => void;
}

/**
 * 简历中心概览卡片：基础简历 + 更新时间 + 项目数量 + 经历数量 + 技能标签预览。
 * 点击整卡跳转到 ResumeDetail。
 */
export function ResumeCard({ resume, projectCount, experienceCount, skills, onClick }: ResumeCardProps) {
  return (
    <Card
      role="button"
      onClick={onClick}
      className="cursor-pointer transition-all hover:border-primary/40 hover:shadow-popover"
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-foreground">{resume.title}</p>
              <p className="text-xs text-muted-foreground">
                {resume.fileName ?? "未上传文件"} · 更新于 {formatDate(resume.updatedAt)}
              </p>
            </div>
          </div>
          <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
        </div>

        {resume.summary && <p className="mt-4 line-clamp-2 text-sm text-foreground/80">{resume.summary}</p>}

        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[#E5E6EB] pt-4">
          <div>
            <p className="text-lg font-semibold text-foreground">{experienceCount}</p>
            <p className="text-xs text-muted-foreground">经历数量</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{projectCount}</p>
            <p className="text-xs text-muted-foreground">项目数量</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{skills.length}</p>
            <p className="text-xs text-muted-foreground">技能标签</p>
          </div>
        </div>

        {skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skills.slice(0, 6).map((skill) => (
              <SkillTag key={skill} label={skill} />
            ))}
            {skills.length > 6 && (
              <span className="self-center text-xs text-muted-foreground">+{skills.length - 6}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
