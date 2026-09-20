import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

/**
 * 应用整体布局：左侧 Sidebar 固定，右侧为 Header + 可独立滚动的内容区域。
 */
export function AppShell() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F7F9FC]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
