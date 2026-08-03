"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { AppLayout } from "../components/layout/AppLayout";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Home() {
  const { user, userProfile, refreshUserProfile } = useAuth();

  const [sinif, setSinif] = useState(userProfile?.sinif || "");
  const [alan, setAlan] = useState(userProfile?.alan || "");
  const [hedefBolum, setHedefBolum] = useState(userProfile?.hedefBolum || "");
  const [hedefSiralama, setHedefSiralama] = useState(userProfile?.hedefSiralama || "");
  const [saving, setSaving] = useState(false);

  const kaydet = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          adSoyad: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          sinif,
          alan,
          hedefBolum,
          hedefSiralama,
          createdAt: userProfile?.createdAt || new Date(),
          updatedAt: new Date(),
        },
        { merge: true }
      );

      await refreshUserProfile();
      alert("Bilgileriniz kaydedildi.");
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Kayıt sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Hoş Geldin, {user?.displayName || "Öğrenci"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              YKS hedeflerinizi belirleyin ve netlerinizi takip etmeye başlayın.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Sınıf Seviyesi
              </label>
              <select
                value={sinif}
                onChange={(e) => setSinif(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                YKS Alanı
              </label>
              <select
                value={alan}
                onChange={(e) => setAlan(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">Alan Seçin</option>
                <option value="Sayısal">Sayısal</option>
                <option value="Eşit Ağırlık">Eşit Ağırlık</option>
                <option value="Sözel">Sözel</option>
                <option value="Dil">Dil</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Hedef Bölüm
              </label>
              <input
                placeholder="Örn. Bilgisayar Mühendisliği"
                value={hedefBolum}
                onChange={(e) => setHedefBolum(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Hedef Sıralama
              </label>
              <input
                placeholder="Örn. 5000"
                type="number"
                value={hedefSiralama}
                onChange={(e) => setHedefSiralama(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <button
              onClick={kaydet}
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium py-3 px-4 rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}