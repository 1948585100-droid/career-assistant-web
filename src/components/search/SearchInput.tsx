import { Search, X } from "lucide-react";
import type { KeyboardEvent } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
}

/** 搜索框：图标 + 输入框 + 清空按钮，样式和 Header 里的搜索入口保持一致 */
export function SearchInput({ value, onChange, onKeyDown, autoFocus }: SearchInputProps) {
  return (
    <div className="flex items-center gap-2.5 border-b border-[#E5E6EB] px-4 py-3 pr-12">
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="搜索岗位、面试问题、错题、简历…"
        className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="清空"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
