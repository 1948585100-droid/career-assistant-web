import { Separator } from "@/components/ui/separator";
import type { Mistake } from "@/types";

interface MistakeDetailCardProps {
  mistake: Mistake;
}

/** 错题详情的核心内容块：问题 / 我的原回答 / 问题分析 / 优化答案，用分隔线隔开每个模块 */
export function MistakeDetailCard({ mistake }: MistakeDetailCardProps) {
  return (
    <div className="space-y-4">
      <Section label="问题" tone="default">
        {mistake.question || "-"}
      </Section>

      <Separator />

      <Section label="我的原回答" tone="default">
        {mistake.myAnswer || "还没有记录原始回答"}
      </Section>

      <Separator />

      <Section label="问题分析" tone="warning">
        {mistake.problem || "还没有记录问题分析"}
      </Section>

      <Separator />

      <Section label="优化答案" tone="success">
        {mistake.betterAnswer || "还没有记录优化后的答案"}
      </Section>
    </div>
  );
}

function Section({
  label,
  children,
  tone = "default",
}: {
  label: string;
  children: string;
  tone?: "default" | "warning" | "success";
}) {
  const toneClass = {
    default: "text-foreground/80",
    warning: "rounded-lg bg-[#FFF3E0] px-3 py-2.5 text-warning",
    success: "rounded-lg bg-[#E7F9F1] px-3 py-2.5 text-success",
  }[tone];

  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
      <p className={`whitespace-pre-wrap text-sm leading-relaxed ${toneClass}`}>{children}</p>
    </div>
  );
}
