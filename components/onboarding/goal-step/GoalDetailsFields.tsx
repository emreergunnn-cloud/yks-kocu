import type { UniversityProgram } from "./types";
import { formatRank, inputClass, mutedTextClass } from "./utils";

interface Props { selectedProgram: UniversityProgram | null; rank: string; setRank: (value: string) => void; examYear: string; setExamYear: (value: string) => void; }

export function GoalDetailsFields({ selectedProgram, rank, setRank, examYear, setExamYear }: Props) {
  return (
    <>
      {selectedProgram && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/40">
          <div className={`text-xs font-medium uppercase tracking-wide ${mutedTextClass}`}>Seçilen hedef</div>
          <div className="mt-1 font-semibold text-slate-900 dark:text-white">{selectedProgram.name}</div>
          <div className={`mt-2 flex flex-wrap gap-2 text-xs ${mutedTextClass}`}><span>{selectedProgram.scoreType}</span><span>•</span><span>{selectedProgram.type === "lisans" ? "Lisans" : "Ön Lisans"}</span>{selectedProgram.duration && <><span>•</span><span>{selectedProgram.duration} yıl</span></>}</div>
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="target-rank" className="text-sm font-medium text-slate-700 dark:text-slate-200">Hedef Sıralama</label>
        <input id="target-rank" type="text" inputMode="numeric" value={formatRank(rank)} onChange={(event) => setRank(event.target.value.replace(/[^\d]/g, ""))} placeholder="Örn. 50.000" className={inputClass} />
        <p className={`text-xs ${mutedTextClass}`}>Bölüm seçildiğinde ÖSYM verisindeki başarı sırası otomatik olarak doldurulur. İstersen değiştirebilirsin.</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="exam-year" className="text-sm font-medium text-slate-700 dark:text-slate-200">Sınav Yılı</label>
        <select id="exam-year" value={examYear} onChange={(event) => setExamYear(event.target.value)} className={inputClass}>
          <option value="">Sınav yılı seçin</option><option value="2026">2026</option><option value="2027">2027</option><option value="2028">2028</option><option value="2029">2029</option>
        </select>
      </div>
    </>
  );
}
