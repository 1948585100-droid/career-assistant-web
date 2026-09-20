import { SkillTag } from "@/components/resume/SkillTag";
import { TagInput } from "@/components/common/TagInput";

interface TagSelectorProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
}

const DEFAULT_SUGGESTIONS = ["项目经历", "自我介绍", "动机", "行为面试", "技术", "算法", "沟通表达"];

/**
 * 标签选择器：常用标签一键添加 + 自由输入（自由输入部分直接复用 TagInput / SkillTag，
 * 不再重新实现一遍标签胶囊）。
 */
export function TagSelector({ value, onChange, suggestions = DEFAULT_SUGGESTIONS }: TagSelectorProps) {
  const remaining = suggestions.filter((s) => !value.includes(s));

  return (
    <div className="space-y-2">
      <TagInput value={value} onChange={onChange} placeholder="输入标签后回车" />
      {remaining.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground">常用：</span>
          {remaining.map((tag) => (
            <button key={tag} type="button" onClick={() => onChange([...value, tag])} className="opacity-70 hover:opacity-100">
              <SkillTag label={tag} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
