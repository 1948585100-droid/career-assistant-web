import { Tag } from "@/components/common/Tag";
import type { Tag as TagType } from "@/types";

interface TagListProps {
  tags: TagType[];
  max?: number;
  onSelect?: (name: string) => void;
  emptyText?: string;
}

/** 展示一组标签及其使用次数，超过 max 的部分会被截断（默认不截断） */
export function TagList({ tags, max, onSelect, emptyText = "还没有标签数据" }: TagListProps) {
  const shown = typeof max === "number" ? tags.slice(0, max) : tags;

  if (shown.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyText}</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((tag) => (
        <Tag
          key={tag.id}
          name={tag.name}
          color={tag.color}
          count={tag.count}
          onClick={onSelect ? () => onSelect(tag.name) : undefined}
        />
      ))}
    </div>
  );
}
