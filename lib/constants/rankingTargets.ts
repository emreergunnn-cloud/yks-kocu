// lib/constants/rankingTargets.ts

export interface RankingTarget {
  rank: number;

  tytMin: number;
  tytMax: number;

  aytMin: number;
  aytMax: number;
}

export interface RankingTable {
  year: number;
  alan: "Sayısal" | "Eşit Ağırlık" | "Sözel" | "Dil";
  targets: RankingTarget[];
}

/*
Gerçek YKS verileri birebir olmadığı için
hedef netler aralık şeklinde tutuluyor.

Sistem daha sonra öğrenciye bu aralıktan
kişisel hedef belirleyecek.
*/

export const SAYISAL_2024: RankingTarget[] = [
  { rank: 1000, tytMin:108, tytMax:110, aytMin:72, aytMax:74 },
  { rank: 2500, tytMin:105, tytMax:107, aytMin:69, aytMax:71 },
  { rank: 5000, tytMin:102, tytMax:104, aytMin:66, aytMax:68 },
  { rank: 7500, tytMin:100, tytMax:102, aytMin:64, aytMax:66 },
  { rank:10000, tytMin:98,  tytMax:100, aytMin:62, aytMax:64 },
  { rank:15000, tytMin:95,  tytMax:97,  aytMin:59, aytMax:61 },
  { rank:20000, tytMin:93,  tytMax:95,  aytMin:57, aytMax:59 },
  { rank:30000, tytMin:89,  tytMax:91,  aytMin:53, aytMax:55 },
  { rank:40000, tytMin:86,  tytMax:88,  aytMin:50, aytMax:52 },
  { rank:50000, tytMin:83,  tytMax:85,  aytMin:48, aytMax:50 },
  { rank:60000, tytMin:80,  tytMax:82,  aytMin:45, aytMax:47 },
  { rank:70000, tytMin:78,  tytMax:80,  aytMin:43, aytMax:45 },
  { rank:80000, tytMin:76,  tytMax:78,  aytMin:41, aytMax:43 },
  { rank:90000, tytMin:74,  tytMax:76,  aytMin:39, aytMax:41 },
  { rank:100000,tytMin:72,  tytMax:74,  aytMin:37, aytMax:39 },
  { rank:125000,tytMin:68,  tytMax:70,  aytMin:33, aytMax:35 },
  { rank:150000,tytMin:65,  tytMax:67,  aytMin:30, aytMax:32 },
  { rank:175000,tytMin:62,  tytMax:64,  aytMin:28, aytMax:30 },
  { rank:200000,tytMin:59,  tytMax:61,  aytMin:26, aytMax:28 },
];

export const SAYISAL_2025: RankingTarget[] = [
  { rank:1000, tytMin:107, tytMax:109, aytMin:71, aytMax:73 },
  { rank:2500, tytMin:104, tytMax:106, aytMin:68, aytMax:70 },
  { rank:5000, tytMin:101, tytMax:103, aytMin:65, aytMax:67 },
  { rank:7500, tytMin:99,  tytMax:101, aytMin:63, aytMax:65 },
  { rank:10000,tytMin:97,  tytMax:99,  aytMin:61, aytMax:63 },
  { rank:15000,tytMin:94,  tytMax:96,  aytMin:58, aytMax:60 },
  { rank:20000,tytMin:92,  tytMax:94,  aytMin:56, aytMax:58 },
  { rank:30000,tytMin:88,  tytMax:90,  aytMin:52, aytMax:54 },
  { rank:40000,tytMin:85,  tytMax:87,  aytMin:49, aytMax:51 },
  { rank:50000,tytMin:82,  tytMax:84,  aytMin:47, aytMax:49 },
  { rank:60000,tytMin:79,  tytMax:81,  aytMin:44, aytMax:46 },
  { rank:70000,tytMin:77,  tytMax:79,  aytMin:42, aytMax:44 },
  { rank:80000,tytMin:75,  tytMax:77,  aytMin:40, aytMax:42 },
  { rank:90000,tytMin:73,  tytMax:75,  aytMin:38, aytMax:40 },
  { rank:100000,tytMin:71, tytMax:73,  aytMin:36, aytMax:38 },
  { rank:125000,tytMin:67, tytMax:69,  aytMin:32, aytMax:34 },
  { rank:150000,tytMin:64, tytMax:66,  aytMin:29, aytMax:31 },
  { rank:175000,tytMin:61, tytMax:63,  aytMin:27, aytMax:29 },
  { rank:200000,tytMin:58, tytMax:60,  aytMin:25, aytMax:27 },
];

export const SAYISAL_2026: RankingTarget[] = [
  { rank:1000, tytMin:107, tytMax:109, aytMin:71, aytMax:73 },
  { rank:2500, tytMin:104, tytMax:106, aytMin:68, aytMax:70 },
  { rank:5000, tytMin:101, tytMax:103, aytMin:65, aytMax:67 },
  { rank:7500, tytMin:99,  tytMax:101, aytMin:63, aytMax:65 },
  { rank:10000,tytMin:97,  tytMax:99,  aytMin:61, aytMax:63 },
  { rank:15000,tytMin:94,  tytMax:96,  aytMin:58, aytMax:60 },
  { rank:20000,tytMin:92,  tytMax:94,  aytMin:56, aytMax:58 },
  { rank:30000,tytMin:88,  tytMax:90,  aytMin:52, aytMax:54 },
  { rank:40000,tytMin:85,  tytMax:87,  aytMin:49, aytMax:51 },
  { rank:50000,tytMin:82,  tytMax:84,  aytMin:47, aytMax:49 },
  { rank:60000,tytMin:79,  tytMax:81,  aytMin:44, aytMax:46 },
  { rank:70000,tytMin:77,  tytMax:79,  aytMin:42, aytMax:44 },
  { rank:80000,tytMin:75,  tytMax:77,  aytMin:40, aytMax:42 },
  { rank:90000,tytMin:73,  tytMax:75,  aytMin:38, aytMax:40 },
  { rank:100000,tytMin:71, tytMax:73,  aytMin:36, aytMax:38 },
  { rank:125000,tytMin:67, tytMax:69,  aytMin:32, aytMax:34 },
  { rank:150000,tytMin:64, tytMax:66,  aytMin:29, aytMax:31 },
  { rank:175000,tytMin:61, tytMax:63,  aytMin:27, aytMax:29 },
  { rank:200000,tytMin:58, tytMax:60,  aytMin:25, aytMax:27 },
];

export const EA_2024: RankingTarget[] = [];
export const EA_2025: RankingTarget[] = [];
export const EA_2026: RankingTarget[] = [];

export const SOZEL_2024: RankingTarget[] = [];
export const SOZEL_2025: RankingTarget[] = [];
export const SOZEL_2026: RankingTarget[] = [];

export const DIL_2024: RankingTarget[] = [];
export const DIL_2025: RankingTarget[] = [];
export const DIL_2026: RankingTarget[] = [];