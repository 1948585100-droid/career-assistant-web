import { FileText, Briefcase, MessagesSquare, BookX, type LucideIcon } from "lucide-react";
import { Tag } from "@/components/common/Tag";
import { cn } from "@/lib/utils";
import type { SearchResult, SearchResultType } from "@/services/searchService";

const TYPE_ICON: Record<SearchResultType, LucideIcon> = {
  resume: FileText,
  job: Briefcase,
  interview: MessagesSquare,
  mistake: BookX,
};

interface SearchResultItemProps {
  result: SearchResult;
  active?: boolean;
  onClick: () => void;
}

export function SearchResultItem({ result, active, onClick }: SearchResultItemProps) {
  const Icon = TYPE_ICON[result.type];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
        active ? "bg-primary-light" : "hover:bg-secondary/60"
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          active ? "bg-white text-primary" : "bg-primary-light text-primary"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{result.title}</p>
        {result.description && <p className="truncate text-xs text-muted-foreground">{result.description}</p>}
        {result.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {result.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} name={tag} className="px-1.5 py-0 text-[11px]" />
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
