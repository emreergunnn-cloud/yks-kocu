import type { University } from "./types";
import { dropdownClass, dropdownItemClass, inputClass, mutedTextClass } from "./utils";

interface Props { value: string; loading: boolean; selected?: University; results: University[]; onChange: (value: string) => void; onSelect: (item: University) => void; }

export function UniversityField({ value, loading, selected, results, onChange, onSelect }: Props) {
  return (
    <div className="space-y-2">
      <label htmlFor="target-university" className="text-sm font-medium text-slate-700 dark:text-slate-200">Hedef Üniversite</label>
      <div className="relative">
        <input id="target-university" type="text" value={value} onChange={(event) => onChange(event.target.value)} disabled={loading} placeholder={loading ? "Üniversiteler yükleniyor..." : "Üniversite ara..."} autoComplete="off" className={inputClass} />
        {value.trim() && !selected && !loading && (
          <div className={dropdownClass}>
            {results.length > 0 ? results.map((university) => (
              <button key={university.name} type="button" onClick={() => onSelect(university)} className={dropdownItemClass}>
                <div className="font-medium text-slate-800 dark:text-slate-100">{university.name}</div>
                <div className={`mt-1 text-xs ${mutedTextClass}`}>{university.programs.length} bölüm</div>
              </button>
            )) : <div className={`px-4 py-5 text-center text-sm ${mutedTextClass}`}>Üniversite bulunamadı.</div>}
          </div>
        )}
      </div>
      {selected && <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-slate-700/40"><span className="font-medium text-slate-700 dark:text-slate-200">Seçildi:</span><span className={mutedTextClass}>{selected.name}</span></div>}
    </div>
  );
}
