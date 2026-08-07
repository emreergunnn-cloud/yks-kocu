import { ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
}

export default function FormField({
  label,
  children,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      {children}
    </div>
  );
}