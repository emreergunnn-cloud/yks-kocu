interface Props { step: number; total: number; saving: boolean; onBack: () => void; onNext: () => void; onFinish: () => void; }
export function OnboardingNavigation({ step, total, saving, onBack, onNext, onFinish }: Props) {
  return (
    <div className="mt-10 flex justify-between">
      <button type="button" onClick={onBack} disabled={step === 1 || saving} className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">Geri</button>
      {step < total ? (
        <button type="button" onClick={onNext} disabled={saving} className="rounded-xl bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:opacity-50">Devam Et →</button>
      ) : (
        <button type="button" onClick={onFinish} disabled={saving} className="rounded-xl bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700 disabled:opacity-50">{saving ? "Kaydediliyor..." : "Başla 🚀"}</button>
      )}
    </div>
  );
}
