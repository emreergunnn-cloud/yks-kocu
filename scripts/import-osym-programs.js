const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(process.cwd(), "data");

const files = [
  {
    file: "tablo-3-29u1s7pl.xls",
    type: "onlisans",
    successRankColumn: 9,
    minScoreColumn: 10,
  },
  {
    file: "tablo-4-hohu0j-30164357.xls",
    type: "lisans",
    successRankColumn: 10,
    minScoreColumn: 11,
  },
];

function clean(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function isProgramCode(value) {
  return /^\d{6,10}$/.test(clean(value));
}

function cleanUniversityName(value) {
  return clean(value)
    .replace(/\s+(Devlet Üniversitesi)$/i, "")
    .replace(/\s+(Vakıf Üniversitesi)$/i, "")
    .replace(/\s+(KKTC)$/i, "")
    .trim();
}

const programs = [];

for (const source of files) {
  const filePath = path.join(DATA_DIR, source.file);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Dosya bulunamadı: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
  });

  let university = "";
  let faculty = "";

  for (let i = 3; i < rows.length; i++) {
    const row = rows[i] || [];

    const code = clean(row[0]);
    const name = clean(row[1]);

    if (!name) continue;

    if (!code && /ÜNİVERSİTESİ/i.test(name)) {
      university = cleanUniversityName(name);
      faculty = "";
      continue;
    }

    if (!code) {
      const upper = name.toLocaleUpperCase("tr-TR");

      if (
        upper.includes("FAKÜLTESİ") ||
        upper.includes("YÜKSEKOKULU") ||
        upper.includes("MESLEK YÜKSEKOKULU") ||
        upper.includes("KONSERVATUVAR")
      ) {
        faculty = name;
      }

      continue;
    }

    if (!isProgramCode(code)) continue;

    programs.push({
      code,
      name,
      university,
      faculty,
      type: source.type,
      scoreType: clean(row[3]),
      duration: Number(row[2]) || null,
      successRank: clean(row[source.successRankColumn]),
      minScore: clean(row[source.minScoreColumn]),
    });
  }
}

const uniqueMap = new Map();

for (const program of programs) {
  const key = `${program.type}-${program.code}`;

  if (!uniqueMap.has(key)) {
    uniqueMap.set(key, program);
  }
}

const uniquePrograms = Array.from(uniqueMap.values());

const universityMap = new Map();

for (const program of uniquePrograms) {
  if (!program.university) continue;

  if (!universityMap.has(program.university)) {
    universityMap.set(program.university, {
      name: program.university,
      programs: [],
    });
  }

  universityMap.get(program.university).programs.push(program);
}

const universities = Array.from(universityMap.values()).sort((a, b) =>
  a.name.localeCompare(b.name, "tr")
);

for (const university of universities) {
  university.programs.sort((a, b) =>
    a.name.localeCompare(b.name, "tr")
  );
}

const output = {
  source: "ÖSYM YKS Tercih Kılavuzu",
  generatedAt: new Date().toISOString(),

  statistics: {
    universityCount: universities.length,
    programCount: uniquePrograms.length,
    lisansProgramCount: uniquePrograms.filter(
      (x) => x.type === "lisans"
    ).length,
    onlisansProgramCount: uniquePrograms.filter(
      (x) => x.type === "onlisans"
    ).length,
  },

  universities,
};

const outputPath = path.join(
  DATA_DIR,
  "universities-programs.json"
);

fs.writeFileSync(
  outputPath,
  JSON.stringify(output, null, 2),
  "utf8"
);

console.log("");
console.log("========================================");
console.log("ÖSYM VERİSİ BAŞARIYLA İŞLENDİ");
console.log("========================================");
console.log("Üniversite sayısı:", universities.length);
console.log("Toplam program sayısı:", uniquePrograms.length);
console.log(
  "Lisans programı:",
  output.statistics.lisansProgramCount
);
console.log(
  "Ön lisans programı:",
  output.statistics.onlisansProgramCount
);
console.log("");
console.log("Oluşturulan dosya:", outputPath);
console.log("========================================");