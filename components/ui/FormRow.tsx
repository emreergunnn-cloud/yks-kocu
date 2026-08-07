import React from "react";

interface FormRowProps {
  children: React.ReactNode;
}

export function FormRow({
  children,
}: FormRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {children}
    </div>
  );
}