import React from "react";

interface PageTitleProps {
  children: React.ReactNode;
}

export function PageTitle({
  children,
}: PageTitleProps) {
  return (
    <h1 className="text-4xl font-black text-slate-900 dark:text-white">
      {children}
    </h1>
  );
}