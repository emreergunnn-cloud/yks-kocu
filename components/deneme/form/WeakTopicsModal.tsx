import { YKS_SUBJECTS } from "@/lib/constants/subjects";

interface Props {
  open: boolean;
  subjectIds: string[];
  selectedTopics: string[];
  saving: boolean;
  onToggle: (topicId: string, checked: boolean) => void;
  onClose: () => void;
  onSkip: () => void;
  onSave: () => void;
}

export function WeakTopicsModal({
  open,
  subjectIds,
  selectedTopics,
  saving,
  onToggle,
  onClose,
  onSkip,
  onSave,
}: Props) {
  if (!open) return null;

  const subjects = subjectIds
    .map((id) => YKS_SUBJECTS.find((subject) => subject.id === id))
    .filter((subject): subject is (typeof YKS_SUBJECTS)[number] => Boolean(subject));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold">Yanlış Konu Analizi</h3>
            <p className="mt-1 text-sm text-slate-500">
              Yanlış veya boş sorular hangi konulardandı?
            </p>
          </div>

          <button type="button" onClick={onClose} className="p-2 text-slate-400">
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          {subjects.map((subject) => (
            <div key={subject.id} className="space-y-3">
              <h4 className="font-semibold">{subject.name}</h4>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {subject.topics.map((topic) => (
                  <label
                    key={topic.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg p-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTopics.includes(topic.id)}
                      onChange={(e) => onToggle(topic.id, e.target.checked)}
                      className="h-4 w-4 rounded"
                    />

                    <span className="truncate">{topic.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 p-5 dark:border-slate-800">
          <button
            type="button"
            disabled={saving}
            onClick={onSkip}
            className="rounded-lg px-4 py-2 text-sm text-slate-500"
          >
            Şimdi Değil
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={onSave}
            className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Analizi Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
