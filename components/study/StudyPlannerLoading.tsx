export function StudyPlannerLoading() {
  return (
    <div className="p-6 space-y-4 max-w-5xl mx-auto">
      {[1, 2, 3].map(
        (item) => (
          <div
            key={item}
            className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"
          />
        )
      )}
    </div>
  );
}