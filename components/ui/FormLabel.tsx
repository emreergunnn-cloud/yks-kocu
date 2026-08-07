import React from "react";

interface FormLabelProps {
  children: React.ReactNode;
}

export function FormLabel({
  children,
}: FormLabelProps) {
  return (
    <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
      {children}
    </label>
  );
}