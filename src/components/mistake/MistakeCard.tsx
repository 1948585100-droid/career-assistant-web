import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkillTag } from "@/components/resume/SkillTag";
import { FrequencyBadge } from "@/components/mistake/FrequencyBadge";
import type { Mistake } from "@/types";

interface MistakeCardProps {
  mistake: Mistake;
  onClick?: () => void;
  onDelete?: () => void;
}

export function MistakeCard({ mistake, onClick, onDelete }: MistakeCardProps) {
  const isOptimized = Boolean(mistake.betterAnswer?.trim());

  return (
    <Card
      role="button"
      onClick={onClick}
      className="group cursor-pointer transition-all hover:border-primary/40 hover:shadow-popover"
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[15px] font-semibold text-foreground">{mistake.question || "（未填写问题）"}</p>
          <div className="flex shrink-0 items-center gap-1">
            <Badge variant={isOptimized ? "success" : "warning"}>{isOptimized ? "已优化" : "待优化"}</Badge>
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

        {mistake.myAnswer && (
          <p className="mt-2 line-clamp-2 text-sm text-foreground/80">
            <span className="text-muted-foreground">我的回答：</span>
            {mistake.myAnswer}
          </p>
        )}

        {mistake.problem && (
          <p className="mt-2 line-clamp-2 rounded-lg bg-[#FFF3E0] px-3 py-2 text-sm text-warning">
            <span className="font-medium">问题分析：</span>
            {mistake.problem}
          </p>
        )}

        {mistake.betterAnswer && (
          <p className="mt-2 line-clamp-2 rounded-lg bg-[#E7F9F1] px-3 py-2 text-sm text-success">
            <span className="font-medium">优化：</span>
            {mistake.betterAnswer}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {mistake.tags.map((tag) => (
              <SkillTag key={tag} label={tag} />
            ))}
          </div>
          <FrequencyBadge frequency={mistake.frequency} />
        </div>
      </CardContent>
    </Card>
  );
}
