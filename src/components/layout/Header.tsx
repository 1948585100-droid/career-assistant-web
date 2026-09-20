import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, Search, Briefcase, MessagesSquare, BookX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchDialog } from "@/components/search/SearchDialog";

const PAGE_TITLES: Record<string, string> = {
  "/": "首页",
  "/resume": "简历中心",
  "/jobs": "岗位管理",
  "/interviews": "面试中心",
  "/mistakes": "错题集",
  "/library": "面经库",
  "/settings": "数据管理",
};

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform ?? navigator.userAgent);

/**
 * 顶部 Header：吸顶展示当前页面标题、全局搜索入口（Ctrl/Cmd + K 或点击打开 SearchDialog）、
 * 快速新建菜单，以及用户信息。风格与 Sidebar 保持一致，克制留白，不做多余装饰。
 */
export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = PAGE_TITLES[location.pathname] ?? "秋招助手";
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isShortcut = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isShortcut) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-[#E5E6EB] bg-white/80 px-8 backdrop-blur">
      <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-8 w-64 items-center gap-2 rounded-lg border border-[#E5E6EB] bg-[#F7F9FC] px-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 text-left">搜索岗位 / 面试 / 错题…</span>
          <kbd className="shrink-0 rounded border border-[#E5E6EB] bg-white px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {IS_MAC ? "⌘K" : "Ctrl K"}
          </kbd>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-3.5 w-3.5" />
              新建
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate("/jobs")} className="gap-2">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
              添加岗位
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/interviews")} className="gap-2">
              <MessagesSquare className="h-3.5 w-3.5 text-muted-foreground" />
              记录面试
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/mistakes")} className="gap-2">
              <BookX className="h-3.5 w-3.5 text-muted-foreground" />
              添加错题
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2 rounded-lg border border-[#E5E6EB] py-1 pl-1 pr-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-white">
            张
          </div>
          <span className="text-sm text-foreground">张三</span>
        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
