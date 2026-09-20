import { SearchResultItem } from "@/components/search/SearchResultItem";
import type { SearchResult } from "@/services/searchService";

interface SearchGroupProps {
  label: string;
  results: SearchResult[];
  activeKey?: string | null;
  onSelect: (result: SearchResult) => void;
}

/** 一个分组：标题 + 条数 + 结果列表，例如"岗位 · 3条" */
export function SearchGroup({ label, results, activeKey, onSelect }: SearchGroupProps) {
  if (results.length === 0) return null;

  return (
    <div className="mb-1">
      <p className="px-3 pb-1 pt-2 text-xs font-medium text-muted-foreground">
        {label} · {results.length} 条
      </p>
      <div className="space-y-0.5">
        {results.map((result) => {
          const key = `${result.type}-${result.id}`;
          return (
            <SearchResultItem
              key={key}
              result={result}
              active={activeKey === key}
              onClick={() => onSelect(result)}
            />
          );
        })}
      </div>
    </div>
  );
}
