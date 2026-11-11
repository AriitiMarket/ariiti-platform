import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "available"
  | "success"
  | "testing"
  | "warning"
  | "development"
  | "info"
  | "unavailable"
  | "neutral";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  withDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  children,
  className,
  withDot = true,
}) => {
  const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
    available: {
      container: "bg-emerald-50 text-emerald-800 border-emerald-200",
      dot: "bg-emerald-500",
    },
    success: {
      container: "bg-emerald-50 text-emerald-800 border-emerald-200",
      dot: "bg-emerald-500",
    },
    testing: {
      container: "bg-amber-50 text-amber-800 border-amber-200",
      dot: "bg-amber-500 animate-pulse",
    },
    warning: {
      container: "bg-amber-50 text-amber-800 border-amber-200",
      dot: "bg-amber-500",
    },
    development: {
      container: "bg-blue-50 text-blue-800 border-blue-200",
      dot: "bg-blue-500",
    },
    info: {
      container: "bg-blue-50 text-blue-800 border-blue-200",
      dot: "bg-blue-500",
    },
    unavailable: {
      container: "bg-slate-100 text-slate-700 border-slate-200",
      dot: "bg-slate-400",
    },
    neutral: {
      container: "bg-slate-100 text-slate-700 border-slate-200",
      dot: "bg-slate-400",
    },
  };

  const style = variantStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide uppercase",
        style.container,
        className
      )}
    >
      {withDot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", style.dot)}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
