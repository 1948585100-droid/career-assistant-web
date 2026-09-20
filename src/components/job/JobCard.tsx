import { Building2, MapPin, CalendarClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SkillTag } from "@/components/resume/SkillTag";
import { StatusBadge } from "@/components/job/StatusBadge";
import { formatDate, daysUntil, cn } from "@/lib/utils";
import type { Job } from "@/types";

interface JobCardProps {
  job: Job;
  onClick?: () => void;
}

export function JobCard({ job, onClick }: JobCardProps) {
  const remaining = daysUntil(job.deadline);
  const isUrgent = remaining !== null && remaining >= 0 && remaining <= 3;
  const isOverdue = remaining !== null && remaining < 0;

  return (
    <Card
      role="button"
      onClick={onClick}
      className="cursor-pointer transition-all hover:border-primary/40 hover:shadow-popover"
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-foreground">{job.company}</p>
              <p className="text-sm text-muted-foreground">{job.position}</p>
            </div>
          </div>
          <StatusBadge status={job.status} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 pl-[52px] text-xs text-muted-foreground">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location}
            </span>
          )}
          {job.deadline && (
            <span
              className={cn(
                "flex items-center gap-1",
                isOverdue && "text-danger",
                isUrgent && !isOverdue && "text-warning"
              )}
            >
              <CalendarClock className="h-3 w-3" />
              截止 {formatDate(job.deadline)}
              {isOverdue && "（已截止）"}
              {isUrgent && !isOverdue && `（剩 ${remaining} 天）`}
            </span>
          )}
        </div>

        {job.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 pl-[52px]">
            {job.tags.map((tag) => (
              <SkillTag key={tag} label={tag} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
