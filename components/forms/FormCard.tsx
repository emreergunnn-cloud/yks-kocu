import { ReactNode } from "react";
import { Card } from "../ui/Card";

interface Props {
  children: ReactNode;
}

export default function FormCard({ children }: Props) {
  return (
    <Card className="p-6">
      {children}
    </Card>
  );
}