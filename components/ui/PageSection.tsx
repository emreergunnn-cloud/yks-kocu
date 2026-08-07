import React from "react";

interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageSection({
  children,
  className = "",
}: PageSectionProps) {
  return (
    <section className={`space-y-6 ${className}`}>
      {children}
    </section>
  );
}