import React from "react";

interface PageDescriptionProps {
  children: React.ReactNode;
}

export function PageDescription({
  children,
}: PageDescriptionProps) {
  return (
    <p className="text-slate-500 dark:text-slate-400 leading-7">
      {children}
    </p>
  );
}