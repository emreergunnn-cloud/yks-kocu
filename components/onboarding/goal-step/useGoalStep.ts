"use client";

import { useEffect, useMemo, useState } from "react";
import type { GoalStepProps, UniversitiesData, University, UniversityProgram } from "./types";
import { normalizeText } from "./utils";

export function useGoalStep(props: GoalStepProps) {
  const [universities, setUniversities] = useState<University[]>([]);
  const [universitySearch, setUniversitySearch] = useState(props.hedefUniversite || "");
  const [selectedProgram, setSelectedProgram] = useState<UniversityProgram | null>(null);
  const [programSearch, setProgramSearch] = useState(props.hedefBolum || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadPrograms() {
      try {
        setLoading(true); setError("");
        const response = await fetch("/api/universities-programs");
        if (!response.ok) throw new Error("Üniversite verileri alınamadı.");
        const data: UniversitiesData = await response.json();
        if (!cancelled) setUniversities(data.universities ?? []);
      } catch {
        if (!cancelled) setError("Üniversite ve bölüm verileri yüklenemedi. Lütfen tekrar deneyin.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadPrograms();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => setUniversitySearch(props.hedefUniversite || ""), [props.hedefUniversite]);
  useEffect(() => setProgramSearch(props.hedefBolum || ""), [props.hedefBolum]);

  const currentUniversity = useMemo(() => universities.find((item) => item.name === props.hedefUniversite), [universities, props.hedefUniversite]);
  const filteredUniversities = useMemo(() => {
    const search = normalizeText(universitySearch);
    if (!search) return [];
    return universities.filter((university) => {
      const normalized = normalizeText(university.name);
      return normalized.startsWith(search) || normalized.split(/\s+/).some((word) => word.startsWith(search));
    }).sort((a, b) => a.name.localeCompare(b.name, "tr-TR")).slice(0, 50);
  }, [universities, universitySearch]);
  const filteredPrograms = useMemo(() => {
    if (!currentUniversity) return [];
    const search = normalizeText(programSearch);
    if (!search) return [];
    return currentUniversity.programs.filter((program) => normalizeText(program.name).includes(search)).sort((a, b) => a.name.localeCompare(b.name, "tr-TR")).slice(0, 100);
  }, [currentUniversity, programSearch]);

  const changeUniversity = (value: string) => {
    setUniversitySearch(value); setSelectedProgram(null); setProgramSearch("");
    props.setHedefUniversite(""); props.setHedefBolum(""); props.setHedefSiralama("");
  };
  const selectUniversity = (university: University) => {
    setUniversitySearch(university.name); props.setHedefUniversite(university.name);
    setSelectedProgram(null); setProgramSearch(""); props.setHedefBolum(""); props.setHedefSiralama("");
  };
  const changeProgram = (value: string) => { setProgramSearch(value); setSelectedProgram(null); props.setHedefBolum(value); };
  const selectProgram = (program: UniversityProgram) => {
    setSelectedProgram(program); setProgramSearch(program.name); props.setHedefBolum(program.name);
    const rank = program.successRank?.trim() ?? "";
    props.setHedefSiralama(rank ? rank.replace(/[^\d]/g, "") : "");
  };

  return { universitySearch, programSearch, selectedProgram, loading, error, currentUniversity, filteredUniversities, filteredPrograms, changeUniversity, selectUniversity, changeProgram, selectProgram };
}
