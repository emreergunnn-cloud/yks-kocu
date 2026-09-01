export function CountdownEmptyState({ year }: { year: number }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-6 text-white shadow-xl">
      <p className="text-xs font-bold text-blue-200">YKS {year}</p>
      <h3 className="mt-2 text-xl font-black">Sayaç için tarih seç</h3>
      <p className="mt-1 text-sm text-blue-100">ÖSYM henüz tarih açıklamadıysa Ayarlar bölümünden tahmini YKS tarihini girebilirsin.</p>
    </div>
  );
}
