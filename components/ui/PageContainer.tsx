import React from "react";

export function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {children}
    </div>
  );
}