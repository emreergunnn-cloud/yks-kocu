"use client";

import { InputHTMLAttributes } from "react";
import { Input } from "./Input";

interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export function NumberInput({
  label,
  className = "",
  ...props
}: NumberInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <Input
        type="number"
        className={className}
        {...props}
      />
    </div>
  );
}