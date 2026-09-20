import { Tag } from "@/components/common/Tag";

interface SkillTagProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

/**
 * 技能 / 通用标签胶囊。
 * 第八轮把实际的样式实现收敛到了 components/common/Tag.tsx 一处，
 * 这里只是保留原来的 props 形状（label 而不是 name），
 * 避免要去改动项目里十几处已经在用 <SkillTag label=.../> 的地方。
 */
export function SkillTag({ label, onRemove, className }: SkillTagProps) {
  return <Tag name={label} onRemove={onRemove} className={className} />;
}
