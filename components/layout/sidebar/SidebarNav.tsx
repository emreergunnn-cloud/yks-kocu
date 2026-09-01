import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { navGroups } from "./navConfig";

interface Props { isAdmin: boolean; isActive: (href: string) => boolean; onClose?: () => void; }

export function SidebarNav({ isAdmin, isActive, onClose }: Props) {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-3 py-5">
      {navGroups.map((group) => (
        <div key={group.label} className="mb-4">
          <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">{group.label}</p>
          <nav className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={onClose} className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${active ? "bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-950/60 dark:text-blue-400" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"}`}>
                  <span className={active ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"}>{item.icon}</span>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">{item.badge}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
      {isAdmin && (
        <div className="mb-4">
          <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">Yönetim</p>
          <Link href="/admin" onClick={onClose} className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${isActive("/admin") ? "bg-red-50 text-red-700 shadow-sm dark:bg-red-950/40 dark:text-red-400" : "text-slate-600 hover:bg-red-50 hover:text-red-700 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"}`}>
            <ShieldCheck className="h-4 w-4" />
            <span className="flex-1">Admin Paneli</span>
          </Link>
        </div>
      )}
      <div className="mt-auto border-t border-slate-200 pt-4 text-center text-[10px] text-slate-400 dark:border-slate-800">YKS Koçu v0.5.0</div>
    </div>
  );
}
