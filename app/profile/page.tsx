"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { AppLayout } from "../../components/layout/AppLayout";
import { saveUserProfile } from "../../services/userService";
import { SinifOption, AlanOption } from "../../types/user";

export default function ProfilePage() {
  const { user, userProfile, refreshUserProfile, logout } = useAuth();

  const [adSoyad, setAdSoyad] = useState(userProfile?.adSoyad || user?.displayName || "");
  const [sinif, setSinif] = useState<SinifOption | "">(userProfile?.sinif || "");
  const [alan, setAlan] = useState<AlanOption | "">(userProfile?.alan || "");
  const [hedefUniversite, setHedefUniversite] = useState(userProfile?.hedefUniversite || "");
  const [hedefBolum, setHedefBolum] = useState(userProfile?.hedefBolum || "");
  const [hedefSiralama, setHedefSiralama] = useState(userProfile?.hedefSiralama || "");
  const [mezuniyetYili, setMezuniyetYili] = useState(userProfile?.mezuniyetYili || new Date().getFullYear());
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (userProfile) {
      setAdSoyad(userProfile.adSoyad || user?.displayName || "");
      setSinif(userProfile.sinif || "");
      setAlan(userProfile.alan || "");
      setHedefUniversite(userProfile.hedefUniversite || "");
      setHedefBolum(userProfile.hedefBolum || "");
      setHedefSiralama(userProfile.hedefSiralama || "");
      setMezuniyetYili(userProfile.mezuniyetYili || new Date().getFullYear());
    }
  }, [userProfile, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMsg(null);

    try {
      await saveUserProfile({
        uid: user.uid,
        adSoyad,
        email: user.email,
        photoURL: user.photoURL,
        sinif,
        alan,
        hedefUniversite,
        hedefBolum,
        hedefSiralama: Number(hedefSiralama) || 0,
        mezuniyetYili: Number(mezuniyetYili) || new Date().getFullYear(),
      });

      await refreshUserProfile();
      setMsg({ type: "success", text: "Profil ve hedef bilgileriniz başarıyla güncellendi." });
    } catch (err) {
      console.error("Profile update error:", err);
      setMsg({ type: "error", text: "Profil güncellenirken bir hata oluştu." });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Öğrenci Profil & Hedef Yönetimi
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kişisel bilgilerinizi ve YKS hedeflerinizi yönetin.
          </p>
        </div>

        {msg && (
          <div
            className={`p-4 rounded-xl text-sm font-medium border ${
              msg.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800"
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "Kullanıcı"}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500/20"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xl ring-2 ring-blue-500/20">
                  {(user.displayName || "K").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Kişisel Bilgiler
                </h2>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={adSoyad}
                  onChange={(e) => setAdSoyad(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Sınıf Seviyesi
                </label>
                <select
                  value={sinif}
                  onChange={(e) => setSinif(e.target.value as SinifOption)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">Sınıf Seçin</option>
                  <option value="9">9. Sınıf</option>
                  <option value="10">10. Sınıf</option>
                  <option value="11">11. Sınıf</option>
                  <option value="12">12. Sınıf</option>
                  <option value="Mezun">Mezun</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  YKS Alanı / Branş
                </label>
                <select
                  value={alan}
                  onChange={(e) => setAlan(e.target.value as AlanOption)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">Alan Seçin</option>
                  <option value="Sayısal">Sayısal</option>
                  <option value="Eşit Ağırlık">Eşit Ağırlık</option>
                  <option value="Sözel">Sözel</option>
                  <option value="Dil">Dil</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  YKS Sınav Yılı / Mezuniyet Yılı
                </label>
                <input
                  type="number"
                  placeholder="2026"
                  value={mezuniyetYili}
                  onChange={(e) => setMezuniyetYili(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
          </div>

          {/* Target Preferences */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Üniversite ve Bölüm Hedefleri
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Hedef Üniversite
                </label>
                <input
                  type="text"
                  placeholder="Örn. Orta Doğu Teknik Üniversitesi (ODTÜ)"
                  value={hedefUniversite}
                  onChange={(e) => setHedefUniversite(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Hedef Bölüm
                </label>
                <input
                  type="text"
                  placeholder="Örn. Bilgisayar Mühendisliği"
                  value={hedefBolum}
                  onChange={(e) => setHedefBolum(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Hedef Sıralama (Derece)
                </label>
                <input
                  type="number"
                  placeholder="Örn. 5000"
                  value={hedefSiralama}
                  onChange={(e) => setHedefSiralama(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/70 rounded-xl text-sm font-medium transition-all"
            >
              Çıkış Yap
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium text-sm rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {saving ? "Güncelleniyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
