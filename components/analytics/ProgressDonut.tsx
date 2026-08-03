import React from "react";

interface ProgressDonutProps {
  percentage: number;
  label?: string;
  size?: number;
}

export const ProgressDonut: React.FC<ProgressDonutProps> = ({
  percentage,
  label = "Hedef Ulaşımı",
  size = 140,
}) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute text-center">
          <span className="text-2xl font-black text-slate-900 dark:text-white">% {percentage}</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
};
