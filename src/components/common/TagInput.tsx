import { useState, type KeyboardEvent } from "react";
import { SkillTag } from "@/components/resume/SkillTag";
import { Input } from "@/components/ui/input";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

/** 标签编辑器：回车或逗号添加一个 #标签，点击 x 移除（标签样式复用 SkillTag，避免重复实现） */
export function TagInput({ value, onChange, placeholder = "输入标签后回车" }: TagInputProps) {
  const [draft, setDraft] = useState("");

  function commit() {
    const cleaned = draft.trim().replace(/^#/, "");
    if (cleaned && !value.includes(cleaned)) {
      onChange([...value, cleaned]);
    }
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-input bg-white px-2 py-1.5 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary">
      {value.map((tag) => (
        <SkillTag key={tag} label={tag} onRemove={() => onChange(value.filter((t) => t !== tag))} />
      ))}
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : ""}
        className="h-6 w-auto min-w-[100px] flex-1 border-0 p-0 shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
