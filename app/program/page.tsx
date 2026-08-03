import type { Metadata } from "next";
import { AppLayout } from "../../components/layout/AppLayout";
import { StudyPlannerPage } from "../../components/study/StudyPlannerPage";

export const metadata: Metadata = {
  title: "Çalışma Planı",
  description: "Kişisel çalışma planı ve AI koç önerileri.",
};

export default function ProgramRoute() {
  return (
    <AppLayout>
      <StudyPlannerPage />
    </AppLayout>
  );
}
