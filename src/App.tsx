import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "@/components/ui/toaster";
import { ensureSeeded } from "@/db/seed";

import Dashboard from "@/pages/Dashboard";
import Resume from "@/pages/Resume";
import ResumeDetail from "@/pages/ResumeDetail";
import Jobs from "@/pages/Jobs";
import JobDetail from "@/pages/JobDetail";
import Interviews from "@/pages/Interviews";
import InterviewDetail from "@/pages/InterviewDetail";
import Mistakes from "@/pages/Mistakes";
import MistakeDetail from "@/pages/MistakeDetail";
import Library from "@/pages/Library";
import Settings from "@/pages/Settings";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ensureSeeded()
      .catch((err) => console.error("初始化本地数据失败：", err))
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F7F9FC] text-sm text-muted-foreground">
        正在初始化本地数据…
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="resume" element={<Resume />} />
          <Route path="resume/:id" element={<ResumeDetail />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:id" element={<JobDetail />} />
          <Route path="interviews" element={<Interviews />} />
          <Route path="interviews/:id" element={<InterviewDetail />} />
          <Route path="mistakes" element={<Mistakes />} />
          <Route path="mistakes/:id" element={<MistakeDetail />} />
          <Route path="library" element={<Library />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}
