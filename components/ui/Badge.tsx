import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "outline";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "md",
}) => {
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  const variantClasses = {
    primary: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50",
    secondary: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    success: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50",
    warning: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50",
    danger: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50",
    outline: "border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400",
  };

  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${sizeClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};
