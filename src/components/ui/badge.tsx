import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Tag / Badge 组件，样式遵循 PRD：
 * background: #E6F4FF / color: #1677FF / radius: 999px
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary-light text-primary",
        neutral: "bg-secondary text-secondary-foreground",
        success: "bg-[#E7F9F1] text-success",
        warning: "bg-[#FFF3E0] text-warning",
        danger: "bg-[#FEECEC] text-danger",
        outline: "border border-border text-muted-foreground bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
