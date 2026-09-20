import { Check, X } from "lucide-react";
import { JOB_PIPELINE_STATUSES, JOB_STATUS_LABEL } from "@/types";
import type { JobStatus } from "@/types";
import { cn } from "@/lib/utils";

interface JobTimelineProps {
  status: JobStatus;
}

/** 投递流程时间线：收藏 → 已投递 → 笔试 → 一面 → 二面 → Offer，"已挂"单独用红色节点标出 */
export function JobTimeline({ status }: JobTimelineProps) {
  const isRejected = status === "rejected";
  const currentIndex = JOB_PIPELINE_STATUSES.indexOf(status);

  return (
    <div className="flex items-start">
      {JOB_PIPELINE_STATUSES.map((step, index) => {
        const reached = !isRejected && index <= currentIndex;
        const isCurrent = !isRejected && index === currentIndex;
        const isLast = index === JOB_PIPELINE_STATUSES.length - 1;

        return (
          <div key={step} className={cn("flex items-center", !isLast && "flex-1")}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-medium transition-colors",
                  reached
                    ? "border-primary bg-primary text-white"
                    : "border-[#E5E6EB] bg-white text-muted-foreground"
                )}
              >
                {reached && !isCurrent ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </div>
              <span
                className={cn(
                  "whitespace-nowrap text-xs",
                  reached ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {JOB_STATUS_LABEL[step]}
              </span>
            </div>
            {!isLast && (
              <div className={cn("mx-1 mt-[-18px] h-0.5 flex-1", reached ? "bg-primary" : "bg-[#E5E6EB]")} />
            )}
          </div>
        );
      })}

      {isRejected && (
        <div className="ml-3 flex flex-col items-center gap-1.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-danger bg-danger text-white">
            <X className="h-3.5 w-3.5" />
          </div>
          <span className="whitespace-nowrap text-xs font-medium text-danger">已挂</span>
        </div>
      )}
    </div>
  );
}
