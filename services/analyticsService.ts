import { ExamResult, SectionScore } from "../types/exam";
import { UserProfile } from "../types/user";

export interface TrendPoint {
  id: string;
  date: string;
  yayin: string;
  tytNet: number;
  aytNet: number;
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
  daysRemainingToYks: number;
}

export function getSectionNet(val: SectionScore | number | undefined): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === "number") return val;
  return val.net ?? 0;
}

export function computeAnalyticsSummary(
  exams: ExamResult[],
  userProfile: UserProfile | null
): AnalyticsSummary {
  if (!exams || exams.length === 0) {
    // Calculate YKS countdown days
    const yksDate = new Date("2026-06-20T10:00:00");
    const now = new Date();
    const diffTime = yksDate.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    return {
      totalExams: 0,
      avgTytNet: 0,
      maxTytNet: 0,
      latestTytNet: 0,
      avgAytNet: 0,
      maxAytNet: 0,
      latestAytNet: 0,
      avgToplamNet: 0,
      trendData: [],
      sectionAverages: [],
      estimatedTargetNet: 150,
      targetProgressPercentage: 0,
      daysRemainingToYks: daysRemaining,
    };
  }

  // Sort exams chronologically (oldest to newest for charts)
  const sortedExams = [...exams].sort((a, b) => {
    const dateA = a.sinavTarihi ? new Date(a.sinavTarihi).getTime() : a.createdAt?.seconds * 1000 || 0;
    const dateB = b.sinavTarihi ? new Date(b.sinavTarihi).getTime() : b.createdAt?.seconds * 1000 || 0;
    return dateA - dateB;
  });

  const totalExams = sortedExams.length;

  const tytNets = sortedExams.map((e) => e.tytToplamNet || 0);
  const aytNets = sortedExams.map((e) => e.aytToplamNet || 0);
  const toplamNets = sortedExams.map((e) => e.toplamNet || 0);

  const avgTytNet = Number((tytNets.reduce((a, b) => a + b, 0) / totalExams).toFixed(2));
  const maxTytNet = Math.max(...tytNets, 0);
  const latestTytNet = tytNets[tytNets.length - 1] || 0;

  const avgAytNet = Number((aytNets.reduce((a, b) => a + b, 0) / totalExams).toFixed(2));
  const maxAytNet = Math.max(...aytNets, 0);
  const latestAytNet = aytNets[aytNets.length - 1] || 0;

  const avgToplamNet = Number((toplamNets.reduce((a, b) => a + b, 0) / totalExams).toFixed(2));

  // Build trend points
  const trendData: TrendPoint[] = sortedExams.map((e) => ({
    id: e.id || Math.random().toString(),
    date: e.sinavTarihi
      ? new Date(e.sinavTarihi).toLocaleDateString("tr-TR", { month: "short", day: "numeric" })
      : "Tarihsiz",
    yayin: e.yayinAdi || "Deneme",
    tytNet: e.tytToplamNet || 0,
    aytNet: e.aytToplamNet || 0,
    toplamNet: e.toplamNet || 0,
  }));

  // Calculate Section Averages
  const secTytTurkce = Number((sortedExams.reduce((acc, e) => acc + getSectionNet(e.tytTurkce), 0) / totalExams).toFixed(1));
  const secTytSosyal = Number((sortedExams.reduce((acc, e) => acc + getSectionNet(e.tytSosyal), 0) / totalExams).toFixed(1));
  const secTytMat = Number((sortedExams.reduce((acc, e) => acc + getSectionNet(e.tytMat), 0) / totalExams).toFixed(1));
  const secTytFen = Number((sortedExams.reduce((acc, e) => acc + getSectionNet(e.tytFen), 0) / totalExams).toFixed(1));

  const secAytMat = Number((sortedExams.reduce((acc, e) => acc + getSectionNet(e.aytMat), 0) / totalExams).toFixed(1));
  const secAytFizik = Number((sortedExams.reduce((acc, e) => acc + getSectionNet(e.aytFizik), 0) / totalExams).toFixed(1));
  const secAytKimya = Number((sortedExams.reduce((acc, e) => acc + getSectionNet(e.aytKimya), 0) / totalExams).toFixed(1));
  const secAytBiyo = Number((sortedExams.reduce((acc, e) => acc + getSectionNet(e.aytBiyoloji), 0) / totalExams).toFixed(1));

  const sectionAverages: SectionAverage[] = [
    { name: "TYT Türkçe", avgNet: secTytTurkce, maxScore: 40, percentage: Math.round((secTytTurkce / 40) * 100) },
    { name: "TYT Sosyal", avgNet: secTytSosyal, maxScore: 20, percentage: Math.round((secTytSosyal / 20) * 100) },
    { name: "TYT Matematik", avgNet: secTytMat, maxScore: 40, percentage: Math.round((secTytMat / 40) * 100) },
    { name: "TYT Fen", avgNet: secTytFen, maxScore: 20, percentage: Math.round((secTytFen / 20) * 100) },
    { name: "AYT Matematik", avgNet: secAytMat, maxScore: 40, percentage: Math.round((secAytMat / 40) * 100) },
    { name: "AYT Fizik", avgNet: secAytFizik, maxScore: 14, percentage: Math.round((secAytFizik / 14) * 100) },
    { name: "AYT Kimya", avgNet: secAytKimya, maxScore: 13, percentage: Math.round((secAytKimya / 13) * 100) },
    { name: "AYT Biyoloji", avgNet: secAytBiyo, maxScore: 13, percentage: Math.round((secAytBiyo / 13) * 100) },
  ];

  // Target estimation logic
  const targetRank = Number(userProfile?.hedefSiralama) || 20000;
  let estimatedTargetNet = 140;
  if (targetRank <= 5000) estimatedTargetNet = 175;
  else if (targetRank <= 15000) estimatedTargetNet = 160;
  else if (targetRank <= 30000) estimatedTargetNet = 145;
  else if (targetRank <= 50000) estimatedTargetNet = 130;
  else estimatedTargetNet = 110;

  const currentMax = maxTytNet + maxAytNet;
  const targetProgressPercentage = Math.min(100, Math.round((currentMax / estimatedTargetNet) * 100));

  // YKS Countdown
  const yksDate = new Date("2026-06-20T10:00:00");
  const now = new Date();
  const diffTime = yksDate.getTime() - now.getTime();
  const daysRemainingToYks = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return {
    totalExams,
    avgTytNet,
    maxTytNet,
    latestTytNet,
    avgAytNet,
    maxAytNet,
    latestAytNet,
    avgToplamNet,
    trendData,
    sectionAverages,
    estimatedTargetNet,
    targetProgressPercentage,
    daysRemainingToYks,
  };
}
