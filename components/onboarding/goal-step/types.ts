export type UniversityProgram = {
  code: string;
  name: string;
  faculty: string;
  type: string;
  scoreType: string;
  duration: number | null;
  successRank: string;
  minScore: string;
};

export type University = { name: string; programs: UniversityProgram[] };
export type UniversitiesData = { universities: University[] };

export type GoalStepProps = {
  hedefUniversite: string;
  setHedefUniversite: (value: string) => void;
  hedefBolum: string;
  setHedefBolum: (value: string) => void;
  hedefSiralama: string;
  setHedefSiralama: (value: string) => void;
  examYear: string;
  setExamYear: (value: string) => void;
};
