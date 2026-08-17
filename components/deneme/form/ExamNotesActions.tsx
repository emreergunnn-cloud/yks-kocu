interface Props {
  notes: string;
  saving: boolean;
  isEdit: boolean;
  onNotesChange: (value: string) => void;
  onCancel: () => void;
}

export function ExamNotesActions({
  notes,
  saving,
  isEdit,
  onNotesChange,
  onCancel,
}: Props) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
          Sınav Notları / Değerlendirme
        </label>

        <textarea
          rows={3}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Sınav hakkındaki genel izlenimleriniz..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-950"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          İptal
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Kaydediliyor..." : isEdit ? "İleri" : "Sınavı Kaydet"}
        </button>
      </div>
    </section>
  );
}
