import React from "react";
import { Card } from "./Card";

interface FormCardProps {
  title?: string;
  children: React.ReactNode;
}

export function FormCard({
  title,
  children,
}: FormCardProps) {
  return (
    <Card>
      {title && (
        <h2 className="text-xl font-bold mb-6">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {children}
      </div>
    </Card>
  );
}