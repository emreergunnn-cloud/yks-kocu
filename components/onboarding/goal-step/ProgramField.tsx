import type { UniversityProgram } from "./types";
import { dropdownClass, dropdownItemClass, formatRank, inputClass, mutedTextClass } from "./utils";

interface Props { universitySelected: boolean; value: string; loading: boolean; selected: UniversityProgram | null; results: UniversityProgram[]; onChange: (value: string) => void; onSelect: (item: UniversityProgram) => void; }

export function ProgramField({ universitySelected, value, loading, selected, results, onChange, onSelect }: Props) {
  return (
    <div className="space-y-2">
      <label htmlFor="target-program" className="text-sm font-medium text-slate-700 dark:text-slate-200">Hedef Bölüm</label>
      <div className="relative">
        <input id="target-program" type="text" value={value} onChange={(event) => onChange(event.target.value)} disabled={!universitySelected || loading} placeholder={universitySelected ? "Bölüm ara..." : "Önce üniversite seçin"} autoComplete="off" className={inputClass} />
        {universitySelected && value.trim() && !selected && (
          <div className={dropdownClass}>
            {results.length > 0 ? results.map((program) => (
              <button key={`${program.code}-${program.name}`} type="button" onClick={() => onSelect(program)} className={dropdownItemClass}>
                <div className="font-medium text-slate-800 dark:text-slate-100">{program.name}</div>
                <div className={`mt-1 text-xs ${mutedTextClass}`}>{program.scoreType} • {program.type === "lisans" ? "Lisans" : "Ön Lisans"}{program.successRank && <> • Başarı sırası: {formatRank(program.successRank)}</>}</div>
              </button>
            )) : <div className={`px-4 py-5 text-center text-sm ${mutedTextClass}`}>Bölüm bulunamadı.</div>}
          </div>
        )}
      </div>
    </div>
  );
}
