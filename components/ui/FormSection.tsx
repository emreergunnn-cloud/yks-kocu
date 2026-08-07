import React from "react";
import { FormCard } from "./FormCard";

interface FormSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function FormSection({
  title,
  children,
}: FormSectionProps) {
  return (
    <FormCard title={title}>
      {children}
    </FormCard>
  );
}