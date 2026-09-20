import { Pencil, Trash2, BookX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillTag } from "@/components/resume/SkillTag";
import type { QA } from "@/types";

interface QuestionCardProps {
  qa: QA;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  /** 传入后会显示"加入错题集"按钮，点击后用该问题的 question/answer/review/improvement 自动创建一条 Mistake */
  onAddToMistakes?: () => void;
}

/** 展示单个面试问题：问题 / 我的回答 / 面试反馈 / 复盘 / 优化答案 / 标签 */
export function QuestionCard({ qa, index, onEdit, onDelete, onAddToMistakes }: QuestionCardProps) {
  return (
    <div className="group rounded-lg border border-[#E5E6EB] p-4 transition-colors hover:border-primary/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-2.5">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-medium text-primary">
            {index + 1}
          </span>
          <p className="text-sm font-medium text-foreground">{qa.question || "（未填写问题）"}</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          {onAddToMistakes && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="加入错题集"
              onClick={onAddToMistakes}
            >
              <BookX className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-[#FEECEC] hover:text-danger"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="mt-3 space-y-2 pl-[34px] text-sm">
        {qa.answer && (
          <p className="text-foreground/80">
            <span className="text-muted-foreground">我的回答：</span>
            {qa.answer}
          </p>
        )}
        {qa.feedback && (
          <p className="text-foreground/80">
            <span className="text-muted-foreground">面试反馈：</span>
            {qa.feedback}
          </p>
        )}
        {qa.review && (
          <p className="rounded-lg bg-[#FFF3E0] px-3 py-2 text-warning">
            <span className="font-medium">复盘：</span>
            {qa.review}
          </p>
        )}
        {qa.improvement && (
          <p className="rounded-lg bg-[#E7F9F1] px-3 py-2 text-success">
            <span className="font-medium">优化：</span>
            {qa.improvement}
          </p>
        )}
        {qa.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {qa.tags.map((tag) => (
              <SkillTag key={tag} label={tag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
