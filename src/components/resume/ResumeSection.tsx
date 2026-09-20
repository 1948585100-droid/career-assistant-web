import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Pencil, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ResumeSectionProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  onEdit?: () => void;
  onAdd?: () => void;
  addLabel?: string;
  children: ReactNode;
}

/**
 * 简历详情页的通用模块容器：基本信息 / 教育经历 / 实习经历 / 项目经历 / 技能标签
 * 都用这个组件包裹，统一「查看 + 编辑」的模块化交互。
 * 编辑 / 新增按钮当前只触发 UI（弹窗），不做持久化保存。
 */
export function ResumeSection({
  icon: Icon,
  title,
  description,
  onEdit,
  onAdd,
  addLabel = "添加",
  children,
}: ResumeSectionProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {onAdd && (
            <Button variant="ghost" size="sm" onClick={onAdd} className="gap-1 text-muted-foreground">
              <Plus className="h-3.5 w-3.5" />
              {addLabel}
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit} className="gap-1 text-muted-foreground">
              <Pencil className="h-3.5 w-3.5" />
              编辑
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}
