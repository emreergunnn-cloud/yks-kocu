import type { StudyTask } from "@/types/studyPlan";

const GUIDES = {
  new: "Ders kitabından konuyu öğren, kısa not çıkar ve temel alıştırmaları çöz.",
  weak: "Ders notlarını gözden geçir, örnekleri yeniden çalış ve takıldığın soruları işaretle.",
  revision: "Yanlışlarını incele, eksik noktaları tekrar et ve benzer sorularla pekiştir.",
};

export function SchoolStudyGuide({ task }: { task: StudyTask }) {
  return (
    <div className="mt-2 rounded-xl border border-blue-200 bg-blue-50/60 p-3 text-xs text-blue-800 dark:border-blue-900 dark:bg-blue-950/20 dark:text-blue-200">
      <strong>Okul dersi çalışması</strong>
      <p className="mt-1">{GUIDES[task.type]}</p>
      <p className="mt-1 opacity-80">Ders kitabın, öğretmeninin notları ve okul yazılıların için çalış.</p>
    </div>
  );
}
