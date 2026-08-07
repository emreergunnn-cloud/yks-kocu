import React from "react";

interface PageGridProps {
  children: React.ReactNode;
}

export function PageGrid({
  children,
}: PageGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
}