export function OnboardingProgress({ step, total }: { step: number; total: number }) {
  const progress = Math.round((step / total) * 100);
  return (
    <div className="mb-8">
      <div className="mb-2 flex justify-between text-sm text-slate-600 dark:text-slate-400"><span>Adım {step} / {total}</span><span>%{progress}</span></div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"><div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} /></div>
    </div>
  );
}
