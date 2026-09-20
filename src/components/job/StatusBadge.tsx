import { Badge } from "@/components/ui/badge";
import { JOB_STATUS_LABEL, JOB_STATUS_VARIANT } from "@/types";
import type { JobStatus } from "@/types";

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
}

/** 岗位状态标签，颜色映射统一来自 types/index.ts 的 JOB_STATUS_VARIANT，避免各处重复定义 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={JOB_STATUS_VARIANT[status]} className={className}>
      {JOB_STATUS_LABEL[status]}
    </Badge>
  );
}
