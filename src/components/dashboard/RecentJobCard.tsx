import { Badge } from "@/components/ui/badge";
import type { JobStatus } from "@/types";
import { JOB_STATUS_LABEL, JOB_STATUS_VARIANT } from "@/types";
import { cn } from "@/lib/utils";

export interface RecentJobCardProps {
  company: string;
  position: string;
  status: JobStatus;
  updatedLabel?: string;
  className?: string;
}

/** 首页「最近岗位」列表中的一行：公司 + 岗位 + 当前状态标签 */
export function RecentJobCard({ company, position, status, updatedLabel, className }: RecentJobCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary/60",
        className
      )}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{company}</p>
        <p className="truncate text-xs text-muted-foreground">{position}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {updatedLabel && <span className="text-xs text-muted-foreground">{updatedLabel}</span>}
        <Badge variant={JOB_STATUS_VARIANT[status]}>{JOB_STATUS_LABEL[status]}</Badge>
      </div>
    </div>
  );
}
