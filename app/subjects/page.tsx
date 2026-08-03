import type { Metadata } from "next";
import { SubjectsPage } from "../../components/subjects/SubjectsPage";
import { AppLayout } from "../../components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Konu Takip | YKS Koçu",
  description: "TYT ve AYT konu ilerlemenizi takip edin.",
};

export default function SubjectsRoute() {
  return (
    <AppLayout>
      <SubjectsPage />
    </AppLayout>
  );
}
