import { Badge } from "@/components/ui/badge";
import { HIGH_FREQUENCY_THRESHOLD, MID_FREQUENCY_THRESHOLD } from "@/types";

interface FrequencyBadgeProps {
  frequency: number;
  className?: string;
}

/** 出现频率分级：>=5 高频（红) / 3-4 较常出现（橙）/ <3 偶尔出现（灰），阈值和 Dashboard 的"高频问题数量"统一 */
export function getFrequencyTier(frequency: number): {
  label: string;
  variant: "danger" | "warning" | "neutral";
} {
  if (frequency >= HIGH_FREQUENCY_THRESHOLD) return { label: "高频", variant: "danger" };
  if (frequency >= MID_FREQUENCY_THRESHOLD) return { label: "较常出现", variant: "warning" };
  return { label: "偶尔出现", variant: "neutral" };
}

export function FrequencyBadge({ frequency, className }: FrequencyBadgeProps) {
  const { label, variant } = getFrequencyTier(frequency);
  return (
    <Badge variant={variant} className={className}>
      {label} · 出现 {frequency} 次
    </Badge>
  );
}
