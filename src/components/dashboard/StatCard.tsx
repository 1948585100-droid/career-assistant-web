import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  hint?: string;
  accent?: "default" | "success" | "warning";
}

const ACCENT_STYLES: Record<NonNullable<StatCardProps["accent"]>, string> = {
  default: "bg-primary-light text-primary",
  success: "bg-[#E7F9F1] text-success",
  warning: "bg-[#FFF3E0] text-warning",
};

/**
 * 秋招进度统计卡片（PRD「组件」章节的 StatCard）：展示数量 + 状态标签。
 * 例如：面试次数 / 6
 */
export function StatCard({ label, value, icon: Icon, hint, accent = "default" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[#E5E6EB] bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", ACCENT_STYLES[accent])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{value}</div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
