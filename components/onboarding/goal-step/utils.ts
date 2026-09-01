export const inputClass = "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60";
export const dropdownClass = "absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg";
export const dropdownItemClass = "block w-full border-b border-slate-100 dark:border-slate-700 px-4 py-3 text-left text-sm transition last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700";
export const mutedTextClass = "text-slate-500 dark:text-slate-400";

export function normalizeText(value: string) {
  return value.toLocaleLowerCase("tr-TR").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c").replace(/ı/g, "i").trim();
}

export function formatRank(value: string) {
  if (!value) return "";
  const cleaned = value.replace(/[^\d]/g, "");
  return cleaned ? Number(cleaned).toLocaleString("tr-TR") : "";
}
