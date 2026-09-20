import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface TaskListItem {
  id: string;
  title: string;
  done: boolean;
}

interface TaskListProps {
  items: TaskListItem[];
  onToggle: (id: string) => void;
}

/**
 * 首页「最近任务」清单。
 * 不再在组件内部拷贝一份 items 到 state ——上一轮 review 指出这样做会导致父组件
 * 传入的新数据（例如从 IndexedDB 刷新回来的任务）无法同步显示。
 * 勾选交互通过 onToggle 回调完全交给父组件（Dashboard）处理并持久化。
 */
export function TaskList({ items, onToggle }: TaskListProps) {
  if (items.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">暂时没有待办任务</p>;
  }

  return (
    <ul className="space-y-1">
      {items.map((task) => (
        <li key={task.id}>
          <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-secondary/60">
            <Checkbox checked={task.done} onCheckedChange={() => onToggle(task.id)} />
            <span
              className={cn(
                "text-sm text-foreground transition-colors",
                task.done && "text-muted-foreground line-through"
              )}
            >
              {task.title}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}
