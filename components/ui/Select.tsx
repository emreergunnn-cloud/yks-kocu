import React from "react";

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({
  className = "",
  children,
  ...props
}: SelectProps) {
  return (
    <select
      {...props}
      className={`
        w-full
        rounded-xl
        border
        border-slate-300
        dark:border-slate-700
        bg-white
        dark:bg-slate-900
        px-3
        py-2.5
        text-slate-900
        dark:text-white
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        transition-all
        ${className}
      `}
    >
      {children}
    </select>
  );
}