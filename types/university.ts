export interface UniversityProgram {
  code: string;
  name: string;
  faculty: string;
  type: "lisans" | "onlisans";
  scoreType: string;
  duration: number | null;
  successRank: string;
  minScore: string;
}

export interface University {
  name: string;
  programs: UniversityProgram[];
}

export interface UniversityData {
  source: string;
  generatedAt: string;
  statistics: {
    universityCount: number;
    programCount: number;
    lisansProgramCount: number;
    onlisansProgramCount: number;
  };
  universities: University[];
}