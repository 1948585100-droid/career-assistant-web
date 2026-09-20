import { Library as LibraryIcon } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

export default function Library() {
  return (
    <div>
      <PageHeader title="面经库" description="管理公司 / 岗位面经等外部资料" />
      <EmptyState icon={LibraryIcon} title="面经库即将上线" description="后续开发阶段会完善这里的内容。" />
    </div>
  );
}
