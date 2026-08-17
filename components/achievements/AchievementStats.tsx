interface Props {
  completedTopics:
    number;

  examCount:
    number;

  earnedBadges:
    number;
}

export function AchievementStats({
  completedTopics,
  examCount,
  earnedBadges,
}: Props) {
  const stats = [
    {
      label:
        "Tamamlanan Konu",

      value:
        completedTopics,

      className:
        "text-emerald-600 dark:text-emerald-400",
    },

    {
      label:
        "Deneme Sayısı",

      value:
        examCount,

      className:
        "text-blue-600 dark:text-blue-400",
    },

    {
      label:
        "Kazanılan Rozet",

      value:
        earnedBadges,

      className:
        "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(
        (stat) => (
          <div
            key={
              stat.label
            }
            className="rounded-xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-slate-900"
          >
            <p
              className={`text-2xl font-black ${stat.className}`}
            >
              {stat.value}
            </p>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {stat.label}
            </p>
          </div>
        )
      )}
    </div>
  );
}
