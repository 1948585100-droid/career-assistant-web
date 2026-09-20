import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, User, GraduationCap, Building2, FolderKanban, Tags, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TagInput } from "@/components/common/TagInput";
import { useToast } from "@/components/ui/use-toast";
import { ResumeSection } from "@/components/resume/ResumeSection";
import { ExperienceCard } from "@/components/resume/ExperienceCard";
import { ProjectCard } from "@/components/resume/ProjectCard";
import { SkillTag } from "@/components/resume/SkillTag";
import { ResumeEditor } from "@/components/resume/ResumeEditor";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDate } from "@/lib/utils";
import { useResume } from "@/hooks/useResume";
import { useExperiences } from "@/hooks/useExperiences";

const EMPTY_PROJECT_DRAFT = { title: "", org: "", background: "", responsibility: "", result: "", tags: [] as string[] };

/**
 * 简历详情页。数据链路：页面 → useResume() / useExperiences() → Repository → IndexedDB。
 * `:id` 暂不做路由匹配校验（本地只维护一份基础简历），后续如果支持多份简历再启用。
 */
export default function ResumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { resume, loading: resumeLoading, updateResume } = useResume();
  const {
    education,
    internships,
    projects,
    skills,
    loading: experiencesLoading,
    createExperience,
    updateExperience,
    removeExperience,
  } = useExperiences();

  const [basicInfoOpen, setBasicInfoOpen] = useState(false);

  const [skillEditorOpen, setSkillEditorOpen] = useState(false);
  const [skillDraft, setSkillDraft] = useState<string[]>([]);
  const [savingSkills, setSavingSkills] = useState(false);

  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [projectDraft, setProjectDraft] = useState(EMPTY_PROJECT_DRAFT);
  const [savingProject, setSavingProject] = useState(false);

  function handleAddPlaceholder(section: string) {
    toast({ title: `新增${section}`, description: "这个模块的新增功能会在下一轮开发中完善。" });
  }

  function openSkillEditor() {
    setSkillDraft(skills.map((s) => s.title));
    setSkillEditorOpen(true);
  }

  async function handleSaveSkills() {
    setSavingSkills(true);
    try {
      const currentNames = skills.map((s) => s.title);
      const toAdd = skillDraft.filter((name) => !currentNames.includes(name));
      const toRemove = skills.filter((s) => !skillDraft.includes(s.title));

      await Promise.all([
        ...toAdd.map((name) => createExperience({ type: "skill", title: name, tags: [] })),
        ...toRemove.map((s) => removeExperience(s.id)),
      ]);

      setSkillEditorOpen(false);
      toast({ title: "技能标签已更新", description: "已写入本地 IndexedDB，刷新页面后依然存在。" });
    } catch (err) {
      toast({ title: "保存失败", description: String(err), variant: "destructive" });
    } finally {
      setSavingSkills(false);
    }
  }

  function openAddProject() {
    setProjectDraft(EMPTY_PROJECT_DRAFT);
    setProjectDialogOpen(true);
  }

  async function handleCreateProject() {
    if (!projectDraft.title.trim()) {
      toast({ title: "请填写项目名称", variant: "destructive" });
      return;
    }
    setSavingProject(true);
    try {
      await createExperience({ type: "project", ...projectDraft });
      setProjectDialogOpen(false);
      toast({ title: "已新增项目", description: "已写入本地 IndexedDB，刷新页面后依然存在。" });
    } catch (err) {
      toast({ title: "新增失败", description: String(err), variant: "destructive" });
    } finally {
      setSavingProject(false);
    }
  }

  const loading = resumeLoading || experiencesLoading;

  if (loading) {
    return <p className="text-sm text-muted-foreground">正在从本地数据库加载…</p>;
  }

  if (!resume) {
    return (
      <EmptyState
        icon={User}
        title="还没有简历数据"
        description="请返回简历中心，本地数据初始化后会自动生成一份基础简历。"
        actionLabel="返回简历中心"
        onAction={() => navigate("/resume")}
      />
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <button
          type="button"
          onClick={() => navigate("/resume")}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          返回简历中心
        </button>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-semibold text-white">
              {(resume.name || "?").slice(0, 1)}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">{resume.name || "未命名"}</h1>
              <p className="text-sm text-muted-foreground">
                {resume.targetPosition ?? "未设置目标岗位"} · {resume.fileName ?? "未上传文件"} · 更新于{" "}
                {formatDate(resume.updatedAt)}
                {id && id !== resume.id ? "（本地仅一份简历，暂不区分 id）" : ""}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setBasicInfoOpen(true)}>
            <Pencil className="h-3.5 w-3.5" />
            编辑基本信息
          </Button>
        </div>
      </div>

      {/* 1. 基本信息 */}
      <ResumeSection icon={User} title="基本信息" onEdit={() => setBasicInfoOpen(true)}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
          <InfoField label="姓名" value={resume.name} />
          <InfoField label="学校" value={resume.school} />
          <InfoField label="专业" value={resume.major} />
          <InfoField label="目标岗位" value={resume.targetPosition} />
          <InfoField label="电话" value={resume.phone} />
          <InfoField label="邮箱" value={resume.email} />
        </div>
        {resume.summary && (
          <p className="rounded-lg bg-secondary/60 px-3 py-2.5 text-sm text-foreground/80">{resume.summary}</p>
        )}
      </ResumeSection>

      {/* 2. 教育经历 */}
      <ResumeSection icon={GraduationCap} title="教育经历" onAdd={() => handleAddPlaceholder("教育经历")}>
        {education.length === 0 ? (
          <EmptyState icon={GraduationCap} title="还没有教育经历" description="点击右上角添加一条教育经历。" />
        ) : (
          <div className="space-y-2.5">
            {education.map((item) => (
              <ExperienceCard key={item.id} experience={item} onSave={updateExperience} />
            ))}
          </div>
        )}
      </ResumeSection>

      {/* 3. 实习经历 */}
      <ResumeSection icon={Building2} title="实习经历" onAdd={() => handleAddPlaceholder("实习经历")}>
        {internships.length === 0 ? (
          <EmptyState icon={Building2} title="还没有实习经历" description="点击右上角添加一条实习经历。" />
        ) : (
          <div className="space-y-2.5">
            {internships.map((item) => (
              <ExperienceCard key={item.id} experience={item} onSave={updateExperience} />
            ))}
          </div>
        )}
      </ResumeSection>

      {/* 4. 项目经历 —— 支持新增 / 编辑 / 删除，均直接持久化到 IndexedDB */}
      <ResumeSection icon={FolderKanban} title="项目经历" onAdd={openAddProject} addLabel="新增项目">
        {projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="还没有项目经历"
            description="点击右上角新增项目按钮，添加你的第一条项目经历。"
            actionLabel="新增项目"
            onAction={openAddProject}
          />
        ) : (
          <div className="space-y-2.5">
            {projects.map((item) => (
              <ProjectCard key={item.id} project={item} onSave={updateExperience} onDelete={removeExperience} />
            ))}
          </div>
        )}
      </ResumeSection>

      {/* 5. 技能标签 */}
      <ResumeSection icon={Tags} title="技能标签" onEdit={openSkillEditor}>
        {skills.length === 0 ? (
          <EmptyState icon={Tags} title="还没有技能标签" description="点击右上角编辑，添加你的技能标签。" />
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <SkillTag key={skill.id} label={skill.title} />
            ))}
          </div>
        )}
      </ResumeSection>

      <ResumeEditor open={basicInfoOpen} onOpenChange={setBasicInfoOpen} resume={resume} onSave={updateResume} />

      {/* 技能标签编辑弹窗 */}
      <Dialog open={skillEditorOpen} onOpenChange={setSkillEditorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑技能标签</DialogTitle>
            <DialogDescription>保存后会直接写入浏览器本地的 IndexedDB。</DialogDescription>
          </DialogHeader>
          <TagInput value={skillDraft} onChange={setSkillDraft} placeholder="输入技能后回车，如 SQL" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSkillEditorOpen(false)} disabled={savingSkills}>
              取消
            </Button>
            <Button onClick={handleSaveSkills} disabled={savingSkills}>
              {savingSkills ? "保存中…" : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 新增项目弹窗 */}
      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增项目经历</DialogTitle>
            <DialogDescription>保存后会直接写入浏览器本地的 IndexedDB。</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>项目名称</Label>
              <Input
                value={projectDraft.title}
                onChange={(e) => setProjectDraft({ ...projectDraft, title: e.target.value })}
                placeholder="例如：用户增长分析系统"
              />
            </div>
            <div className="space-y-1.5">
              <Label>所属</Label>
              <Input
                value={projectDraft.org}
                placeholder="公司 / 团队 / 个人项目"
                onChange={(e) => setProjectDraft({ ...projectDraft, org: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>项目背景</Label>
              <Textarea
                rows={2}
                value={projectDraft.background}
                onChange={(e) => setProjectDraft({ ...projectDraft, background: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>个人职责</Label>
              <Textarea
                rows={2}
                value={projectDraft.responsibility}
                onChange={(e) => setProjectDraft({ ...projectDraft, responsibility: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>项目成果</Label>
              <Textarea
                rows={2}
                value={projectDraft.result}
                onChange={(e) => setProjectDraft({ ...projectDraft, result: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>技能标签</Label>
              <TagInput
                value={projectDraft.tags}
                onChange={(tags) => setProjectDraft({ ...projectDraft, tags })}
                placeholder="输入标签后回车，如 SQL"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectDialogOpen(false)} disabled={savingProject}>
              取消
            </Button>
            <Button onClick={handleCreateProject} disabled={savingProject}>
              {savingProject ? "保存中…" : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-foreground">{value || "-"}</p>
    </div>
  );
}
