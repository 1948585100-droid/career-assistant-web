import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagFilterProps {
  tags: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

/**
 * 标签筛选：点击某个标签切换选中状态，支持多选（多个标签之间是"且"的关系）。
 * 这是第七轮里 components/mistake/TagFilter.tsx 的通用化版本——现在 Jobs / Interviews /
 * Mistakes 三个页面共用这一份实现，不再各写一份。
 */
export function TagFilter({ tags, selected, onChange }: TagFilterProps) {
  if (tags.length === 0) return null;

  function toggle(tag: string) {
    onChange(selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag]);
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((tag) => {
        const active = selected.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
              active
                ? "border-primary bg-primary text-white"
                : "border-[#E5E6EB] bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            #{tag}
          </button>
        );
      })}
      {selected.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
          清除筛选
        </button>
      )}
    </div>
  );
}
