export function calculateObp(diplomaNotu: string) {
  const value = Number(diplomaNotu);
  return Number.isNaN(value) ? 0 : Math.round(value * 5);
}

export function calculateStudyHours(hedefSiralama: string, studyHours: string) {
  const target = Number(hedefSiralama);
  const capacity = Number(studyHours) || 0;
  let base = 2;
  if (target > 0) {
    if (target <= 1000) base = 8;
    else if (target <= 5000) base = 7;
    else if (target <= 10000) base = 6;
    else if (target <= 30000) base = 5;
    else if (target <= 60000) base = 4;
    else if (target <= 100000) base = 3;
  }
  return capacity > 0 ? Math.min(base, capacity) : base;
}

export function calculateTargetTYT(alan: string, hedefSiralama: string) {
  const rank = Number(hedefSiralama) || 250000;
  let base = 60;
  if (rank <= 1000) base = 110;
  else if (rank <= 5000) base = 100;
  else if (rank <= 20000) base = 90;
  else if (rank <= 50000) base = 80;
  else if (rank <= 100000) base = 70;
  if (alan === "Sayısal") return base + 2;
  if (alan === "Sözel") return Math.max(50, base - 5);
  if (alan === "Dil") return Math.max(50, base - 10);
  return base;
}

export function calculateTargetAYT(alan: string, hedefSiralama: string) {
  const rank = Number(hedefSiralama) || 250000;
  let base = 35;
  if (rank <= 1000) base = 75;
  else if (rank <= 5000) base = 70;
  else if (rank <= 20000) base = 60;
  else if (rank <= 50000) base = 50;
  else if (rank <= 100000) base = 45;
  if (alan === "Dil") {
    if (rank <= 5000) return 75;
    if (rank <= 20000) return 65;
    return 55;
  }
  return base;
}
