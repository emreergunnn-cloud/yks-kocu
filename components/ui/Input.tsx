import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
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
        placeholder:text-slate-400
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        transition-all
        ${className}
      `}
    />
  );
}