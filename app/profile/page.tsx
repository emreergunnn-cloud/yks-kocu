"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PersonalInfoSection } from "@/components/profile/PersonalInfoSection";
import { TargetSection } from "@/components/profile/TargetSection";
import { useProfileForm } from "@/components/profile/useProfileForm";

export default function ProfilePage() {
  const form = useProfileForm();
  if (!form.user) return null;
  return <AppLayout><div className="mx-auto max-w-3xl space-y-6"><div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Öğrenci Profil & Hedef Yönetimi</h1><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Kişisel bilgilerinizi ve YKS hedeflerinizi yönetin.</p></div>
    {form.msg && <div className={`rounded-xl border p-4 text-sm font-medium ${form.msg.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" : "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-400"}`}>{form.msg.text}</div>}
    <form onSubmit={form.handleSave} className="space-y-6">
      <PersonalInfoSection user={form.user} adSoyad={form.adSoyad} setAdSoyad={form.setAdSoyad} sinif={form.sinif} setSinif={form.setSinif} alan={form.alan} setAlan={form.setAlan} mezuniyetYili={form.mezuniyetYili} setMezuniyetYili={form.setMezuniyetYili} />
      <TargetSection university={form.hedefUniversite} setUniversity={form.setHedefUniversite} department={form.hedefBolum} setDepartment={form.setHedefBolum} ranking={form.hedefSiralama} setRanking={form.setHedefSiralama} />
      <div className="flex items-center justify-between pt-2"><button type="button" onClick={form.logout} className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600 transition-all hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/70">Çıkış Yap</button><button type="submit" disabled={form.saving} className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50">{form.saving ? "Güncelleniyor..." : "Değişiklikleri Kaydet"}</button></div>
    </form>
  </div></AppLayout>;
}
