interface Props {
  subject: string;
  note: string;

  onSubjectChange:
    (value: string) =>
      void;

  onNoteChange:
    (value: string) =>
      void;
}

export function StudySessionFields({
  subject,
  note,
  onSubjectChange,
  onNoteChange,
}: Props) {
  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Çalıştığın ders (isteğe bağlı)"
        value={subject}
        onChange={(event) =>
          onSubjectChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
      />

      <input
        type="text"
        placeholder="Not (isteğe bağlı)"
        value={note}
        onChange={(event) =>
          onNoteChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
      />
    </div>
  );
}
