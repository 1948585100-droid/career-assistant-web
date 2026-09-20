import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
}

/** 首页快捷入口卡片，例如"添加岗位""记录面试"，点击直接跳转到对应模块 */
export function QuickActionCard({ title, description, icon: Icon, to }: QuickActionCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="group flex items-center gap-3 rounded-xl border border-[#E5E6EB] bg-white p-4 text-left shadow-card transition-colors hover:border-primary/40 hover:bg-primary-light/40"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </button>
  );
}
