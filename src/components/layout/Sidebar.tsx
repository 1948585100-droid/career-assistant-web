import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessagesSquare,
  BookX,
  Library,
  Settings,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "首页", icon: LayoutDashboard, end: true },
  { to: "/resume", label: "简历", icon: FileText },
  { to: "/jobs", label: "岗位", icon: Briefcase },
  { to: "/interviews", label: "面试", icon: MessagesSquare },
  { to: "/mistakes", label: "错题", icon: BookX },
  { to: "/library", label: "面经", icon: Library },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-[220px] shrink-0 flex-col border-r border-[#E5E6EB] bg-white">
      <div className="flex h-14 items-center gap-2 px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white">
          <Compass className="h-4 w-4" />
        </div>
        <span className="text-[15px] font-semibold text-foreground">秋招助手</span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-light text-primary"
                  : "text-foreground/70 hover:bg-secondary hover:text-foreground"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-3">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary-light text-primary"
                : "text-foreground/60 hover:bg-secondary hover:text-foreground"
            )
          }
        >
          <Settings className="h-4 w-4" />
          数据管理
        </NavLink>
      </div>
    </aside>
  );
}
