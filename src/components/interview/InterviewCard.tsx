import { Building2, CalendarDays, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import type { Interview } from "@/types";

interface InterviewCardProps {
  interview: Interview;
  onClick?: () => void;
  onDelete?: () => void;
}

/** 根据问题的复盘填写情况，得到一个"复盘完成度"状态 + 百分比 */
export function getReviewProgress(interview: Interview) {
  const total = interview.qas.length;
  const reviewed = interview.qas.filter((qa) => qa.review?.trim()).length;
  const hasOverall = Boolean(
    interview.overallReview &&
      (interview.overallReview.performance ||
        interview.overallReview.strengths ||
        interview.overallReview.weaknesses ||
        interview.overallReview.nextSteps)
  );

  let label: string;
  if (total === 0) {
    label = "待记录问题";
  } else if (reviewed === 0) {
    label = "待复盘";
  } else if (reviewed < total) {
    label = `复盘中 ${reviewed}/${total}`;
  } else if (!hasOverall) {
    label = "待整体复盘";
  } else {
    label = "已复盘";
  }

  const percent = total === 0 ? 0 : Math.round((reviewed / total) * (hasOverall ? 100 : 90));
  return { label, percent, total, reviewed };
}

export function InterviewCard({ interview, onClick, onDelete }: InterviewCardProps) {
  const { label, percent } = getReviewProgress(interview);

  return (
    <Card
      role="button"
      onClick={onClick}
      className="group cursor-pointer transition-all hover:border-primary/40 hover:shadow-popover"
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-foreground">{interview.company}</p>
              <p className="text-sm text-muted-foreground">
                {interview.position} · {interview.round}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Badge variant="neutral">{label}</Badge>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 transition-opacity hover:bg-[#FEECEC] hover:text-danger group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 pl-[52px] text-xs text-muted-foreground">
          <CalendarDays className="h-3 w-3" />
          {formatDate(interview.date)}
          {interview.interviewer && <span>· 面试官 {interview.interviewer}</span>}
        </div>

        <div className="mt-3 pl-[52px]">
          <Progress value={percent} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
}
