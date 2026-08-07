import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PageContainer({ children }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
      {children}
    </div>
  );
}