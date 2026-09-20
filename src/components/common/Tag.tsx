import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagProps {
  name: string;
  /** 自定义颜色（对应 Tag 类型里的 color），不传就用默认的浅蓝底 / 蓝字 */
  color?: string;
  count?: number;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

/**
 * 项目里唯一的标签胶囊实现：圆角 999px / 背景浅蓝 #E6F4FF / 文字蓝 #1677FF。
 * `components/resume/SkillTag.tsx` 内部就是直接调用这个组件（保留原有的 props 形状，
 * 避免改动已经在用 SkillTag 的十几处调用点），做到"标签样式只有一份实现"。
 */
export function Tag({ name, color, count, onRemove, onClick, className }: TagProps) {
  const Comp = onClick ? "button" : "span";

  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      style={color ? { backgroundColor: `${color}1A`, color } : undefined}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        !color && "bg-primary-light text-primary",
        onClick && "cursor-pointer hover:opacity-80",
        onRemove && "pr-1",
        className
      )}
    >
      #{name}
      {typeof count === "number" && <span className="opacity-70">· {count}</span>}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded-full hover:bg-primary/20"
          aria-label={`移除 ${name}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Comp>
  );
}
