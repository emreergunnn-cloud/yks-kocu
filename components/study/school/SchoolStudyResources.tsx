"use client";

import { BookOpen, ExternalLink, PlayCircle, School } from "lucide-react";
import { openExternalUrl } from "@/lib/native/openExternalUrl";
import type { SchoolGrade } from "@/lib/constants/curriculum/config";
import type { StudyTask } from "@/types/studyPlan";

interface Props {
  grade: SchoolGrade;
  task: StudyTask;
}

interface ResourceLink {
  label: string;
  url: string;
  icon: typeof BookOpen;
}

export function SchoolStudyResources({ grade, task }: Props) {
  const query = `${grade}. sınıf ${task.subject} ${task.topic} 2026 Maarif Modeli konu anlatımı`;
  const links: ResourceLink[] = [
    {
      label: "YouTube'da bu konu için video ara",
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      icon: PlayCircle,
    },
    {
      label: "MEB ders kitapları (sınıf ve ders seç)",
      url: "https://ogmmateryal.eba.gov.tr/ders-kitaplari",
      icon: BookOpen,
    },
    {
      label: "OGM ders anlatım videoları",
      url: "https://ogmmateryal.eba.gov.tr/ebatv-ogm/Default.aspx",
      icon: PlayCircle,
    },
    {
      label: `${grade}. sınıf OGM Dersler Cepte`,
      url: `https://ogmmateryal.eba.gov.tr/dersler-cepte?sinif=${grade}`,
      icon: School,
    },
  ];

  return (
    <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/40">
      <p className="mb-2 text-xs font-semibold">{grade}. sınıf için çalışma kaynakları</p>
      <div className="space-y-2">
        {links.map(({ label, url, icon: Icon }) => (
          <button
            key={url}
            type="button"
            onClick={() => void openExternalUrl(url).catch((error) => {
              console.error("Çalışma kaynağı açılamadı:", error);
            })}
            className="flex items-center gap-2 text-left text-xs text-blue-600 hover:underline dark:text-blue-400"
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </button>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
        Video araması konuya göre yapılır; bağlantılar seçilmiş tek bir video garantisi vermez.
        MEB arşivinde sınıfını ve güncel müfredatı kontrol et.
      </p>
    </div>
  );
}
