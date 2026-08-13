import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

export function Button({ className = "", variant = "default", ...props }: ButtonProps) {
  const baseClasses = "px-6 py-2.5 font-medium text-sm rounded-xl shadow-md transition-all disabled:opacity-50 active:scale-[0.98]";

  const variantClasses = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    outline: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700",
    ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
  };

  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    />
  );
}
