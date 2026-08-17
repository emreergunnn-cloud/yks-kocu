interface Props {
  level: number;
  xp: number;
  levelXp: number;
}

export function AchievementLevelCard({
  level,
  xp,
  levelXp,
}: Props) {
  const percent =
    (
      levelXp /
      500
    ) * 100;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-xl shadow-blue-500/20">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-blue-200">
            Seviye
          </p>

          <p className="text-4xl font-black">
            {level}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wider text-blue-200">
            Toplam XP
          </p>

          <p className="text-2xl font-black">
            {xp}
          </p>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-blue-800/50">
        <div
          className="h-full rounded-full bg-white/80 transition-all"
          style={{
            width:
              `${percent}%`,
          }}
        />
      </div>

      <p className="mt-1.5 text-xs text-blue-200">
        {levelXp}/500 XP — Seviye {level + 1} için
      </p>
    </div>
  );
}
