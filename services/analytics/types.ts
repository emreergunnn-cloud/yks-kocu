export interface TrendPoint {
  id: string;
  date: string;
  yayin: string;
  tytNet: number | null;
  aytNet: number | null;
  toplamNet: number;
}

export interface SectionAverage {
  name: string;
  avgNet: number;
  maxScore: number;
  percentage: number;
}

export interface AnalyticsSummary {
  totalExams: number;
  avgTytNet: number;
  maxTytNet: number;
  latestTytNet: number;
  avgAytNet: number;
  maxAytNet: number;
  latestAytNet: number;
  avgToplamNet: number;
  trendData: TrendPoint[];
  sectionAverages: SectionAverage[];
  estimatedTargetNet: number;
  targetProgressPercentage: number;
}
