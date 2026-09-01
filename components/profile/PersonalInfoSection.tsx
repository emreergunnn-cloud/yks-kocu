import type { User } from "firebase/auth";
import type { AlanOption, SinifOption } from "@/types/user";

interface Props { user: User; adSoyad: string; setAdSoyad: (v: string) => void; sinif: SinifOption | ""; setSinif: (v: SinifOption) => void; alan: AlanOption | ""; setAlan: (v: AlanOption) => void; mezuniyetYili: string | number; setMezuniyetYili: (v: string) => void; }
const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100";

export function PersonalInfoSection({ user, adSoyad, setAdSoyad, sinif, setSinif, alan, setAlan, mezuniyetYili, setMezuniyetYili }: Props) {
  return <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">{user.photoURL ? <img src={user.photoURL} alt={user.displayName || "Kullanıcı"} className="h-14 w-14 rounded-full object-cover ring-2 ring-blue-500/20" /> : <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white ring-2 ring-blue-500/20">{(user.displayName || "K").charAt(0).toUpperCase()}</div>}<div><h2 className="text-base font-bold text-slate-900 dark:text-white">Kişisel Bilgiler</h2><p className="text-xs text-slate-500">{user.email}</p></div></div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Ad Soyad<input type="text" value={adSoyad} onChange={(e) => setAdSoyad(e.target.value)} className={`mt-1 ${inputClass}`} /></label>
      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Sınıf Seviyesi<select value={sinif} onChange={(e) => setSinif(e.target.value as SinifOption)} className={`mt-1 ${inputClass}`}><option value="">Sınıf Seçin</option><option value="9">9. Sınıf</option><option value="10">10. Sınıf</option><option value="11">11. Sınıf</option><option value="12">12. Sınıf</option><option value="Mezun">Mezun</option></select></label>
      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">YKS Alanı / Branş<select value={alan} onChange={(e) => setAlan(e.target.value as AlanOption)} className={`mt-1 ${inputClass}`}><option value="">Alan Seçin</option><option value="Sayısal">Sayısal</option><option value="Eşit Ağırlık">Eşit Ağırlık</option><option value="Sözel">Sözel</option><option value="Dil">Dil</option></select></label>
      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">YKS Sınav Yılı / Mezuniyet Yılı<input type="number" placeholder="2026" value={mezuniyetYili} onChange={(e) => setMezuniyetYili(e.target.value)} className={`mt-1 ${inputClass}`} /></label>
    </div>
  </div>;
}
