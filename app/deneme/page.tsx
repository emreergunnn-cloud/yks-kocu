"use client";

import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { AppLayout } from "../../components/layout/AppLayout";

export default function DenemePage() {
  const { user } = useAuth();

  const [tytTurkce, setTytTurkce] = useState("");
  const [tytSosyal, setTytSosyal] = useState("");
  const [tytMat, setTytMat] = useState("");
  const [tytFen, setTytFen] = useState("");

  const [aytMat, setAytMat] = useState("");
  const [aytFizik, setAytFizik] = useState("");
  const [aytKimya, setAytKimya] = useState("");
  const [aytBiyoloji, setAytBiyoloji] = useState("");

  const [saving, setSaving] = useState(false);

  const kaydet = async () => {
    if (!user) {
      alert("Önce giriş yapın.");
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, "exam_results"), {
        uid: user.uid,

        tytTurkce: Number(tytTurkce),
        tytSosyal: Number(tytSosyal),
        tytMat: Number(tytMat),
        tytFen: Number(tytFen),

        aytMat: Number(aytMat),
        aytFizik: Number(aytFizik),
        aytKimya: Number(aytKimya),
        aytBiyoloji: Number(aytBiyoloji),

        createdAt: Timestamp.now(),
      });

      alert("Deneme kaydedildi");
      setTytTurkce("");
      setTytSosyal("");
      setTytMat("");
      setTytFen("");
      setAytMat("");
      setAytFizik("");
      setAytKimya("");
      setAytBiyoloji("");
    } catch (error) {
      console.error("Deneme kaydetme hatası:", error);
      alert("Deneme kaydedilirken bir hata oluştu.");
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
              Deneme Sonucu Ekle
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              TYT ve AYT bölüm netlerinizi girin.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-slate-800 pb-2">
              TYT Netleri
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                placeholder="TYT Türkçe"
                type="number"
                value={tytTurkce}
                onChange={(e) => setTytTurkce(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <input
                placeholder="TYT Sosyal"
                type="number"
                value={tytSosyal}
                onChange={(e) => setTytSosyal(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <input
                placeholder="TYT Matematik"
                type="number"
                value={tytMat}
                onChange={(e) => setTytMat(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <input
                placeholder="TYT Fen"
                type="number"
                value={tytFen}
                onChange={(e) => setTytFen(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-slate-800 pb-2 pt-2">
              AYT Netleri
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                placeholder="AYT Matematik"
                type="number"
                value={aytMat}
                onChange={(e) => setAytMat(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <input
                placeholder="AYT Fizik"
                type="number"
                value={aytFizik}
                onChange={(e) => setAytFizik(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <input
                placeholder="AYT Kimya"
                type="number"
                value={aytKimya}
                onChange={(e) => setAytKimya(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <input
                placeholder="AYT Biyoloji"
                type="number"
                value={aytBiyoloji}
                onChange={(e) => setAytBiyoloji(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <button
              onClick={kaydet}
              disabled={saving}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-medium py-3 px-4 rounded-xl shadow-md transition-all disabled:opacity-50 mt-4"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}