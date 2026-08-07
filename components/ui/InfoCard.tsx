import React from "react";
import { Card } from "./Card";

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

export function InfoCard({
  title,
  children,
}: InfoCardProps) {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">
        {title}
      </h2>

      <div className="text-slate-600 dark:text-slate-300 leading-8">
        {children}
      </div>
    </Card>
  );
}