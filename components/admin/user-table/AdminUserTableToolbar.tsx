import { Search } from "lucide-react";

interface Props {
  loading: boolean;
  search: string;
  shownCount: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
}

export function AdminUserTableToolbar({ loading, search, shownCount, totalCount, onSearchChange }: Props) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800">
      <div>
        <h2 className="font-semibold text-slate-900 dark:text-white">Kullanıcılar</h2>
        {!loading && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{shownCount} / {totalCount} kullanıcı gösteriliyor</p>}
      </div>
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text" value={search} onChange={(event) => onSearchChange(event.target.value)}
          placeholder="UID, ad, e-posta, alan veya rol ara..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
      </div>
    </div>
  );
}
