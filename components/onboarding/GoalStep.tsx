"use client";

import { useEffect, useMemo, useState } from "react";

type UniversityProgram = {
  code: string;
  name: string;
  faculty: string;
  type: string;
  scoreType: string;
  duration: number | null;
  successRank: string;
  minScore: string;
};

type University = {
  name: string;
  programs: UniversityProgram[];
};

type UniversitiesData = {
  universities: University[];
};

type GoalStepProps = {
  hedefUniversite: string;
  setHedefUniversite: (value: string) => void;

  hedefBolum: string;
  setHedefBolum: (value: string) => void;

  hedefSiralama: string;
  setHedefSiralama: (value: string) => void;

  examYear: string;
  setExamYear: (value: string) => void;
};

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/ı/g, "i")
    .trim();
}

function formatRank(value: string) {
  if (!value) return "";

  const cleaned = value.replace(/[^\d]/g, "");

  if (!cleaned) return "";

  return Number(cleaned).toLocaleString("tr-TR");
}

/* ── Shared input class ─────────────────────────────────────────────── */
const inputClass =
  "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60";

const dropdownClass =
  "absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg";

const dropdownItemClass =
  "block w-full border-b border-slate-100 dark:border-slate-700 px-4 py-3 text-left text-sm transition last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700";

const mutedTextClass = "text-slate-500 dark:text-slate-400";

export default function GoalStep({
  hedefUniversite,
  setHedefUniversite,
  hedefBolum,
  setHedefBolum,
  hedefSiralama,
  setHedefSiralama,
  examYear,
  setExamYear,
}: GoalStepProps) {
  const [universities, setUniversities] = useState<University[]>([]);
  const [universitySearch, setUniversitySearch] = useState(
    hedefUniversite || ""
  );
  const [selectedProgram, setSelectedProgram] =
    useState<UniversityProgram | null>(null);
  const [programSearch, setProgramSearch] = useState(hedefBolum || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPrograms() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/universities-programs");

        if (!response.ok) {
          throw new Error("Üniversite verileri alınamadı.");
        }

        const data: UniversitiesData = await response.json();

        if (!cancelled) {
          setUniversities(data.universities ?? []);
        }
      } catch {
        if (!cancelled) {
          setError(
            "Üniversite ve bölüm verileri yüklenemedi. Lütfen tekrar deneyin."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPrograms();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setUniversitySearch(hedefUniversite || "");
  }, [hedefUniversite]);

  useEffect(() => {
    setProgramSearch(hedefBolum || "");
  }, [hedefBolum]);

  const currentUniversity = useMemo(() => {
    return universities.find(
      (university) => university.name === hedefUniversite
    );
  }, [universities, hedefUniversite]);

  /* ── University search: filter only when user has typed ≥ 1 char ── */
  const filteredUniversities = useMemo(() => {
    const search = normalizeText(universitySearch);

    // Don't show results if the search is empty
    if (!search) {
      return [];
    }

    return universities
      .filter((university) => {
        const normalized = normalizeText(university.name);

        // Check if the full name starts with the search term
        if (normalized.startsWith(search)) {
          return true;
        }

        // Check if any word in the name starts with the search term
        const words = normalized.split(/\s+/);
        return words.some((word) => word.startsWith(search));
      })
      .sort((a, b) => a.name.localeCompare(b.name, "tr-TR"))
      .slice(0, 50);
  }, [universities, universitySearch]);

  /* ── Program search: same logic — filter only when typed ────────── */
  const filteredPrograms = useMemo(() => {
    if (!currentUniversity) {
      return [];
    }

    const search = normalizeText(programSearch);

    if (!search) {
      return [];
    }

    return currentUniversity.programs
      .filter((program) =>
        normalizeText(program.name).includes(search)
      )
      .sort((a, b) => a.name.localeCompare(b.name, "tr-TR"))
      .slice(0, 100);
  }, [currentUniversity, programSearch]);

  function handleUniversitySearchChange(value: string) {
    setUniversitySearch(value);

    setSelectedProgram(null);
    setProgramSearch("");

    setHedefUniversite("");
    setHedefBolum("");
    setHedefSiralama("");
  }

  function handleUniversitySelect(university: University) {
    setUniversitySearch(university.name);
    setHedefUniversite(university.name);

    setSelectedProgram(null);
    setProgramSearch("");

    setHedefBolum("");
    setHedefSiralama("");
  }

  function handleProgramSearchChange(value: string) {
    setProgramSearch(value);
    setSelectedProgram(null);
    setHedefBolum(value);
  }

  function handleProgramSelect(program: UniversityProgram) {
    setSelectedProgram(program);
    setProgramSearch(program.name);
    setHedefBolum(program.name);

    const rank = program.successRank?.trim() ?? "";

    if (rank) {
      setHedefSiralama(rank.replace(/[^\d]/g, ""));
    } else {
      setHedefSiralama("");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Hedefini belirle
        </h2>

        <p className={`mt-2 text-sm ${mutedTextClass}`}>
          Hedef üniversiteni ve bölümünü seç. ÖSYM verisindeki başarı
          sıralaması otomatik olarak hedef sıralamana aktarılır.
        </p>
      </div>

      <div className="grid gap-5">
        {/* ── Hedef Üniversite ─────────────────────────────────────── */}
        <div className="space-y-2">
          <label
            htmlFor="target-university"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Hedef Üniversite
          </label>

          <div className="relative">
            <input
              id="target-university"
              type="text"
              value={universitySearch}
              onChange={(event) =>
                handleUniversitySearchChange(event.target.value)
              }
              disabled={loading}
              placeholder={
                loading
                  ? "Üniversiteler yükleniyor..."
                  : "Üniversite ara..."
              }
              autoComplete="off"
              className={inputClass}
            />

            {universitySearch.trim() &&
              !currentUniversity &&
              !loading && (
                <div className={dropdownClass}>
                  {filteredUniversities.length > 0 ? (
                    filteredUniversities.map((university) => (
                      <button
                        key={university.name}
                        type="button"
                        onClick={() =>
                          handleUniversitySelect(university)
                        }
                        className={dropdownItemClass}
                      >
                        <div className="font-medium text-slate-800 dark:text-slate-100">
                          {university.name}
                        </div>

                        <div className={`mt-1 text-xs ${mutedTextClass}`}>
                          {university.programs.length} bölüm
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className={`px-4 py-5 text-center text-sm ${mutedTextClass}`}>
                      Üniversite bulunamadı.
                    </div>
                  )}
                </div>
              )}
          </div>

          {currentUniversity && (
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-700/40 px-3 py-2 text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-200">
                Seçildi:
              </span>
              <span className={mutedTextClass}>{currentUniversity.name}</span>
            </div>
          )}
        </div>

        {/* ── Hedef Bölüm ─────────────────────────────────────────── */}
        <div className="space-y-2">
          <label
            htmlFor="target-program"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Hedef Bölüm
          </label>

          <div className="relative">
            <input
              id="target-program"
              type="text"
              value={programSearch}
              onChange={(event) =>
                handleProgramSearchChange(event.target.value)
              }
              disabled={!hedefUniversite || loading}
              placeholder={
                hedefUniversite
                  ? "Bölüm ara..."
                  : "Önce üniversite seçin"
              }
              autoComplete="off"
              className={inputClass}
            />

            {hedefUniversite &&
              programSearch.trim() &&
              !selectedProgram && (
                <div className={dropdownClass}>
                  {filteredPrograms.length > 0 ? (
                    filteredPrograms.map((program) => (
                      <button
                        key={`${program.code}-${program.name}`}
                        type="button"
                        onClick={() =>
                          handleProgramSelect(program)
                        }
                        className={dropdownItemClass}
                      >
                        <div className="font-medium text-slate-800 dark:text-slate-100">
                          {program.name}
                        </div>

                        <div className={`mt-1 text-xs ${mutedTextClass}`}>
                          {program.scoreType}

                          {" • "}

                          {program.type === "lisans"
                            ? "Lisans"
                            : "Ön Lisans"}

                          {program.successRank && (
                            <>
                              {" • Başarı sırası: "}
                              {formatRank(program.successRank)}
                            </>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className={`px-4 py-5 text-center text-sm ${mutedTextClass}`}>
                      Bölüm bulunamadı.
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>

        {/* ── Seçilen Hedef ────────────────────────────────────────── */}
        {selectedProgram && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 p-4">
            <div className={`text-xs font-medium uppercase tracking-wide ${mutedTextClass}`}>
              Seçilen hedef
            </div>

            <div className="mt-1 font-semibold text-slate-900 dark:text-white">
              {selectedProgram.name}
            </div>

            <div className={`mt-2 flex flex-wrap gap-2 text-xs ${mutedTextClass}`}>
              <span>{selectedProgram.scoreType}</span>

              <span>•</span>

              <span>
                {selectedProgram.type === "lisans"
                  ? "Lisans"
                  : "Ön Lisans"}
              </span>

              {selectedProgram.duration && (
                <>
                  <span>•</span>

                  <span>
                    {selectedProgram.duration} yıl
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Hedef Sıralama ──────────────────────────────────────── */}
        <div className="space-y-2">
          <label
            htmlFor="target-rank"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Hedef Sıralama
          </label>

          <input
            id="target-rank"
            type="text"
            inputMode="numeric"
            value={formatRank(hedefSiralama)}
            onChange={(event) => {
              const value = event.target.value.replace(
                /[^\d]/g,
                ""
              );

              setHedefSiralama(value);
            }}
            placeholder="Örn. 50.000"
            className={inputClass}
          />

          <p className={`text-xs ${mutedTextClass}`}>
            Bölüm seçildiğinde ÖSYM verisindeki başarı sırası
            otomatik olarak doldurulur. İstersen değiştirebilirsin.
          </p>
        </div>

        {/* ── Sınav Yılı ──────────────────────────────────────────── */}
        <div className="space-y-2">
          <label
            htmlFor="exam-year"
            className="text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Sınav Yılı
          </label>

          <select
            id="exam-year"
            value={examYear}
            onChange={(event) =>
              setExamYear(event.target.value)
            }
            className={inputClass}
          >
            <option value="">Sınav yılı seçin</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
            <option value="2029">2029</option>
          </select>
        </div>

        {/* ── Error ───────────────────────────────────────────────── */}
        {error && (
          <div className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-sm text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
