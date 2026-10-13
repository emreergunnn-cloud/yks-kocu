"use client";

import { useState } from "react";
import type { TrendPoint } from "@/services/analyticsService";

interface Props {
  data: TrendPoint[];
}

interface ChartPoint {
  x: number;
  y: number;
}

function buildPath(points: ChartPoint[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

export function TrendLineChart({ data }: Props) {
  const [hoveredPoint, setHoveredPoint] = useState<TrendPoint | null>(null);

  if (!data?.length) {
    return <div className="p-8 text-center text-xs text-slate-400">Grafik için henüz yeterli deneme verisi yok.</div>;
  }

  const width = 600;
  const height = 220;
  const padding = 35;
  const values = data.flatMap((item) => [item.tytNet, item.aytNet]).filter((value): value is number => value !== null);
  const maxVal = Math.max(...values, 120);
  const getX = (index: number) => data.length === 1 ? width / 2 : padding + (index / (data.length - 1)) * (width - padding * 2);
  const getY = (value: number) => height - padding - (value / maxVal) * (height - padding * 2);
  const tytPoints = data.flatMap((item, index) => item.tytNet === null ? [] : [{ x: getX(index), y: getY(item.tytNet) }]);
  const aytPoints = data.flatMap((item, index) => item.aytNet === null ? [] : [{ x: getX(index), y: getY(item.aytNet) }]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <LegendDot className="bg-blue-500" label="TYT Net" />
          <LegendDot className="bg-indigo-500" label="AYT Net" />
        </div>
        {hoveredPoint && <Tooltip point={hoveredPoint} />}
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full overflow-visible">
          {[0, 40, 80, 120].map((value) => (
            <g key={value}>
              <line x1={padding} y1={getY(value)} x2={width - padding} y2={getY(value)} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="4 4" />
              <text x={padding - 8} y={getY(value) + 3} textAnchor="end" className="fill-slate-400 font-mono text-[10px]">{value}</text>
            </g>
          ))}

          {tytPoints.length > 1 && <path d={buildPath(tytPoints)} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
          {aytPoints.length > 1 && <path d={buildPath(aytPoints)} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

          {data.map((item, index) => (
            <g key={item.id} onMouseEnter={() => setHoveredPoint(item)} onMouseLeave={() => setHoveredPoint(null)}>
              {item.tytNet !== null && <circle cx={getX(index)} cy={getY(item.tytNet)} r="4.5" className="cursor-pointer fill-blue-500 stroke-2 stroke-white dark:stroke-slate-900" />}
              {item.aytNet !== null && <circle cx={getX(index)} cy={getY(item.aytNet)} r="4.5" className="cursor-pointer fill-indigo-500 stroke-2 stroke-white dark:stroke-slate-900" />}
              <text x={getX(index)} y={height - 8} textAnchor="middle" className="fill-slate-400 text-[9px]">{item.date}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300"><span className={`inline-block h-3 w-3 rounded-full ${className}`} />{label}</div>;
}

function Tooltip({ point }: { point: TrendPoint }) {
  const values = [point.tytNet !== null ? `TYT ${point.tytNet}` : null, point.aytNet !== null ? `AYT ${point.aytNet}` : null].filter(Boolean).join(" · ");
  return <div className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-900 dark:bg-slate-800 dark:text-white">{point.yayin} ({point.date}): {values}</div>;
}
