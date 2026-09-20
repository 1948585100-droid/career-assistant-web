import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchInput } from "@/components/search/SearchInput";
import { SearchGroup } from "@/components/search/SearchGroup";
import { useSearch } from "@/hooks/useSearch";
import { SEARCH_TYPE_LABEL, SEARCH_TYPE_ORDER, type SearchResult } from "@/services/searchService";

const RECENT_SEARCHES_KEY = "career_os_recent_searches";
const MAX_RECENT = 8;

function loadRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(term: string) {
  const trimmed = term.trim();
  if (!trimmed) return;
  const next = [trimmed, ...loadRecentSearches().filter((t) => t !== trimmed)].slice(0, MAX_RECENT);
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
  } catch {
    // 本地存储不可用（隐私模式等）时静默忽略，不影响搜索本身
  }
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * 全局搜索弹窗：Notion / Linear 风格的命令面板。
 * "最近搜索"只是 UI 层面的便利功能，不是业务数据，所以直接存在 localStorage，
 * 没有走 IndexedDB 这条数据链路。
 */
export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate();
  const { keyword, search, results, loading, clear } = useSearch();
  const [recent, setRecent] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setRecent(loadRecentSearches());
    } else {
      clear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [results]);

  const grouped = useMemo(
    () => SEARCH_TYPE_ORDER.map((type) => ({ type, label: SEARCH_TYPE_LABEL[type], items: results.filter((r) => r.type === type) })),
    [results]
  );
  const flatResults = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);
  const activeKey = flatResults[activeIndex] ? `${flatResults[activeIndex].type}-${flatResults[activeIndex].id}` : null;

  function handleSelect(result: SearchResult) {
    saveRecentSearch(keyword);
    onOpenChange(false);
    navigate(result.route);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (flatResults.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flatResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flatResults.length) % flatResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(flatResults[activeIndex]);
    }
  }

  const hasKeyword = keyword.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
        <SearchInput value={keyword} onChange={search} onKeyDown={handleKeyDown} autoFocus />

        <div className="max-h-[420px] overflow-y-auto p-2">
          {!hasKeyword ? (
            recent.length > 0 ? (
              <div className="px-1 py-1.5">
                <p className="px-2 pb-1.5 text-xs font-medium text-muted-foreground">最近搜索</p>
                <div className="flex flex-wrap gap-1.5 px-2">
                  {recent.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => search(term)}
                      className="rounded-full border border-[#E5E6EB] px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="px-3 py-10 text-center text-sm text-muted-foreground">
                输入关键词搜索岗位、面试问题、错题和简历
              </p>
            )
          ) : loading ? (
            <p className="px-3 py-10 text-center text-sm text-muted-foreground">搜索中…</p>
          ) : flatResults.length === 0 ? (
            <p className="px-3 py-10 text-center text-sm text-muted-foreground">没有找到匹配"{keyword}"的内容</p>
          ) : (
            grouped.map((g) => (
              <SearchGroup key={g.type} label={g.label} results={g.items} activeKey={activeKey} onSelect={handleSelect} />
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#E5E6EB] px-4 py-2 text-xs text-muted-foreground">
          <span>↑↓ 选择 · Enter 打开</span>
          <span>Esc 关闭</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
