import type { ExamMetaForm } from "./types";
import type { ExamType } from "@/types/exam";
import type { AlanOption } from "@/types/user";

interface Props {
  meta: ExamMetaForm;
  onChange: (values: Partial<ExamMetaForm>) => void;
}

export function ExamMetaFields({ meta, onChange }: Props) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="border-b border-slate-100 pb-3 text-base font-bold dark:border-slate-800">
        Sınav Genel Bilgileri
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Yayın Adı">
          <input
            required
            value={meta.yayinAdi}
            onChange={(e) => onChange({ yayinAdi: e.target.value })}
            className={inputClass}
            placeholder="Örn. 3D Yayınları"
          />
        </Field>

        <Field label="Sınav Adı / Numarası">
          <input
            value={meta.sinavAdi}
            onChange={(e) => onChange({ sinavAdi: e.target.value })}
            className={inputClass}
            placeholder="Örn. Türkiye Geneli Deneme 1"
          />
        </Field>

        <Field label="Deneme Tipi">
          <select
            value={meta.denemeTipi}
            onChange={(e) =>
              onChange({ denemeTipi: e.target.value as ExamType })
            }
            className={inputClass}
          >
            <option value="TYT+AYT">TYT + AYT</option>
            <option value="TYT">Yalnızca TYT</option>
            <option value="AYT">Yalnızca AYT</option>
          </select>
        </Field>

        <Field label="Alan / Branş">
          <select
            value={meta.alan}
            onChange={(e) => onChange({ alan: e.target.value as AlanOption })}
            className={inputClass}
          >
            <option value="Sayısal">Sayısal</option>
            <option value="Eşit Ağırlık">Eşit Ağırlık</option>
            <option value="Sözel">Sözel</option>
            <option value="Dil">Dil</option>
          </select>
        </Field>

        <Field label="Sınav Tarihi">
          <input
            type="date"
            value={meta.sinavTarihi}
            onChange={(e) => onChange({ sinavTarihi: e.target.value })}
            className={inputClass}
          />
        </Field>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100";
