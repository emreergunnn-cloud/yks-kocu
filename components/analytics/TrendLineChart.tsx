"use client";

import React, { useState } from "react";
import { TrendPoint } from "../../services/analyticsService";

interface TrendLineChartProps {
  data: TrendPoint[];
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState<TrendPoint | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">
        Grafik için henüz yeterli deneme verisi yok.
      </div>
    );
  }

  const width = 600;
  const height = 220;
  const padding = 35;

  const maxVal = Math.max(...data.map((d) => Math.max(d.tytNet, d.aytNet, d.toplamNet)), 120);
  const minVal = 0;

  const getX = (index: number) => {
    if (data.length === 1) return width / 2;
    return padding + (index / (data.length - 1)) * (width - padding * 2);
  };

  const getY = (val: number) => {
    return height - padding - ((val - minVal) / (maxVal - minVal)) * (height - padding * 2);
  };

  const tytPath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.tytNet)}`)
    .join(" ");

  const aytPath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.aytNet)}`)
    .join(" ");

  return (
    <div className="space-y-3">
      {/* Legend & Tooltip Header */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
            TYT Net
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
            AYT Net
          </div>
        </div>
        {hoveredPoint && (
          <div className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-slate-900 dark:text-white transition-all">
            {hoveredPoint.yayin} ({hoveredPoint.date}): <span className="text-blue-500">TYT {hoveredPoint.tytNet}</span> | <span className="text-indigo-500">AYT {hoveredPoint.aytNet}</span>
          </div>
        )}
      </div>

      {/* SVG Container */}
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Grid lines */}
          {[0, 40, 80, 120].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Lines */}
          <path d={tytPath} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d={aytPath} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Interactive Data Points */}
          {data.map((d, i) => (
            <g key={d.id || i} onMouseEnter={() => setHoveredPoint(d)}>
              {/* TYT Dot */}
              <circle
                cx={getX(i)}
                cy={getY(d.tytNet)}
                r="4.5"
                className="fill-blue-500 stroke-white dark:stroke-slate-900 stroke-2 hover:r-6 transition-all cursor-pointer"
              />
              {/* AYT Dot */}
              <circle
                cx={getX(i)}
                cy={getY(d.aytNet)}
                r="4.5"
                className="fill-indigo-500 stroke-white dark:stroke-slate-900 stroke-2 hover:r-6 transition-all cursor-pointer"
              />
              {/* Date Label */}
              <text
                x={getX(i)}
                y={height - 10}
                textAnchor="middle"
                className="text-[9px] fill-slate-400"
              >
                {d.date}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
