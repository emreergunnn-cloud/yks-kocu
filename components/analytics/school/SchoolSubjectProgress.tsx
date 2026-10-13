interface SubjectRow {
  id: string;
  name: string;
  total: number;
  studied: number;
  completed: number;
  review: number;
}

export function SchoolSubjectProgress({ subjects }: { subjects: SubjectRow[] }) {
  return (
    <div className="space-y-4">
      {subjects.map((subject) => {
        const percentage = subject.total > 0 ? Math.round((subject.studied / subject.total) * 100) : 0;
        return (
          <div key={subject.id} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{subject.name}</span>
              <span className="font-mono text-slate-500">{subject.studied}/{subject.total} · %{percentage}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${percentage}%` }} />
            </div>
            <p className="text-[10px] text-slate-400">Tamamlandı: {subject.completed} · Tekrar: {subject.review}</p>
          </div>
        );
      })}
    </div>
  );
}
