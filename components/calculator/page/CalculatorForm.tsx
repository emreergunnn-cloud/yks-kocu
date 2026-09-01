import { Card } from "@/components/ui/Card";
import { NumberInput } from "@/components/ui/NumberInput";
import { Select } from "@/components/ui/Select";
import type { CalculatorAlan } from "./types";

interface Props { alan: CalculatorAlan; setAlan: (v: CalculatorAlan) => void; tyt: number | ""; setTyt: (v: number | "") => void; ayt: number | ""; setAyt: (v: number | "") => void; obp: number | ""; setObp: (v: number | "") => void; error: string; onCalculate: () => void; }
export function CalculatorForm({ alan, setAlan, tyt, setTyt, ayt, setAyt, obp, setObp, error, onCalculate }: Props) {
  return <Card><h2 className="mb-4 text-xl font-bold">Sınav Bilgileri</h2><div className="space-y-4">
    <Select label="Alan" value={alan} onChange={(e) => setAlan(e.target.value as CalculatorAlan)}><option value="Sayısal">Sayısal</option><option value="Eşit Ağırlık">Eşit Ağırlık</option><option value="Sözel">Sözel</option><option value="Dil">Dil</option></Select>
    <NumberInput label="Diploma Notu (OBP)" value={obp} onChange={(e) => setObp(e.target.value === "" ? "" : Number(e.target.value))} min={50} max={100} />
    <NumberInput label="Toplam TYT Neti" value={tyt} onChange={(e) => setTyt(e.target.value === "" ? "" : Number(e.target.value))} min={0} max={120} />
    <NumberInput label={alan === "Dil" ? "Toplam YDT Neti" : "Toplam AYT Neti"} value={ayt} onChange={(e) => setAyt(e.target.value === "" ? "" : Number(e.target.value))} min={0} max={80} />
    {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    <button onClick={onCalculate} className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700">Hesapla</button>
  </div></Card>;
}
