"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ExamResult, ExamType, SectionScore } from "../../types/exam";
import { AlanOption } from "../../types/user";
import { calculateNet, buildSectionScore, createExamResult, updateExamResult } from "../../services/examService";
import { useAuth } from "../../context/AuthContext";

interface ExamFormProps {
  initialData?: ExamResult;
  isEdit?: boolean;
}

export const ExamForm: React.FC<ExamFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const { user, userProfile } = useAuth();

  const [yayinAdi, setYayinAdi] = useState(initialData?.yayinAdi || "");
  const [sinavAdi, setSinavAdi] = useState(initialData?.sinavAdi || "");
  const [denemeTipi, setDenemeTipi] = useState<ExamType>(initialData?.denemeTipi || "TYT+AYT");
  const [alan, setAlan] = useState<AlanOption>(initialData?.alan || userProfile?.alan || "Sayısal");
  const [sinavTarihi, setSinavTarihi] = useState(
    initialData?.sinavTarihi || new Date().toISOString().split("T")[0]
  );
  const [notlar, setNotlar] = useState(initialData?.notlar || "");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Helper to extract initial D / Y
  const getInitialValue = (field: SectionScore | number | undefined, key: "dogru" | "yanlis") => {
    if (!field) return "";
    if (typeof field === "number") {
      return key === "dogru" ? String(field) : "";
    }
    return String(field[key] ?? "");
  };

  // TYT Section Inputs (Doğru / Yanlış)
  const [tytTurkceD, setTytTurkceD] = useState(getInitialValue(initialData?.tytTurkce, "dogru"));
  const [tytTurkceY, setTytTurkceY] = useState(getInitialValue(initialData?.tytTurkce, "yanlis"));

  const [tytSosyalD, setTytSosyalD] = useState(getInitialValue(initialData?.tytSosyal, "dogru"));
  const [tytSosyalY, setTytSosyalY] = useState(getInitialValue(initialData?.tytSosyal, "yanlis"));

  const [tytMatD, setTytMatD] = useState(getInitialValue(initialData?.tytMat, "dogru"));
  const [tytMatY, setTytMatY] = useState(getInitialValue(initialData?.tytMat, "yanlis"));

  const [tytFenD, setTytFenD] = useState(getInitialValue(initialData?.tytFen, "dogru"));
  const [tytFenY, setTytFenY] = useState(getInitialValue(initialData?.tytFen, "yanlis"));

  // AYT Section Inputs
  const [aytMatD, setAytMatD] = useState(getInitialValue(initialData?.aytMat, "dogru"));
  const [aytMatY, setAytMatY] = useState(getInitialValue(initialData?.aytMat, "yanlis"));

  const [aytFizikD, setAytFizikD] = useState(getInitialValue(initialData?.aytFizik, "dogru"));
  const [aytFizikY, setAytFizikY] = useState(getInitialValue(initialData?.aytFizik, "yanlis"));

  const [aytKimyaD, setAytKimyaD] = useState(getInitialValue(initialData?.aytKimya, "dogru"));
  const [aytKimyaY, setAytKimyaY] = useState(getInitialValue(initialData?.aytKimya, "yanlis"));

  const [aytBiyoD, setAytBiyoD] = useState(getInitialValue(initialData?.aytBiyoloji, "dogru"));
  const [aytBiyoY, setAytBiyoY] = useState(getInitialValue(initialData?.aytBiyoloji, "yanlis"));

  const [aytEdebiyatD, setAytEdebiyatD] = useState(getInitialValue(initialData?.aytEdebiyat, "dogru"));
  const [aytEdebiyatY, setAytEdebiyatY] = useState(getInitialValue(initialData?.aytEdebiyat, "yanlis"));

  const [aytTarih1D, setAytTarih1D] = useState(getInitialValue(initialData?.aytTarih1, "dogru"));
  const [aytTarih1Y, setAytTarih1Y] = useState(getInitialValue(initialData?.aytTarih1, "yanlis"));

  const [aytCografya1D, setAytCografya1D] = useState(getInitialValue(initialData?.aytCografya1, "dogru"));
  const [aytCografya1Y, setAytCografya1Y] = useState(getInitialValue(initialData?.aytCografya1, "yanlis"));

  // Live Net Calculations
  const tytTurkceNet = calculateNet(Number(tytTurkceD), Number(tytTurkceY));
  const tytSosyalNet = calculateNet(Number(tytSosyalD), Number(tytSosyalY));
  const tytMatNet = calculateNet(Number(tytMatD), Number(tytMatY));
  const tytFenNet = calculateNet(Number(tytFenD), Number(tytFenY));
  const tytToplamNet = Number((tytTurkceNet + tytSosyalNet + tytMatNet + tytFenNet).toFixed(2));

  const aytMatNet = calculateNet(Number(aytMatD), Number(aytMatY));
  const aytFizikNet = calculateNet(Number(aytFizikD), Number(aytFizikY));
  const aytKimyaNet = calculateNet(Number(aytKimyaD), Number(aytKimyaY));
  const aytBiyoNet = calculateNet(Number(aytBiyoD), Number(aytBiyoY));
  const aytEdebiyatNet = calculateNet(Number(aytEdebiyatD), Number(aytEdebiyatY));
  const aytTarih1Net = calculateNet(Number(aytTarih1D), Number(aytTarih1Y));
  const aytCografya1Net = calculateNet(Number(aytCografya1D), Number(aytCografya1Y));

  const aytToplamNet = Number(
    (
      (alan === "Sayısal" ? aytMatNet + aytFizikNet + aytKimyaNet + aytBiyoNet : 0) +
      (alan === "Eşit Ağırlık" ? aytMatNet + aytEdebiyatNet + aytTarih1Net + aytCografya1Net : 0) +
      (alan === "Sözel" ? aytEdebiyatNet + aytTarih1Net + aytCografya1Net : 0)
    ).toFixed(2)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setErrorMsg("");

    setSaving(true);
    try {
      const examData: Omit<ExamResult, "id"> = {
        uid: user.uid,
        yayinAdi: yayinAdi.trim() || "Genel Deneme",
        sinavAdi: sinavAdi.trim() || "Deneme Sınavı",
        denemeTipi,
        alan,
        sinavTarihi,
        notlar,

        // TYT
        tytTurkce: buildSectionScore(Number(tytTurkceD), Number(tytTurkceY), 40),
        tytSosyal: buildSectionScore(Number(tytSosyalD), Number(tytSosyalY), 20),
        tytMat: buildSectionScore(Number(tytMatD), Number(tytMatY), 40),
        tytFen: buildSectionScore(Number(tytFenD), Number(tytFenY), 20),
        tytToplamNet,

        // AYT
        aytMat: buildSectionScore(Number(aytMatD), Number(aytMatY), 40),
        aytFizik: buildSectionScore(Number(aytFizikD), Number(aytFizikY), 14),
        aytKimya: buildSectionScore(Number(aytKimyaD), Number(aytKimyaY), 13),
        aytBiyoloji: buildSectionScore(Number(aytBiyoD), Number(aytBiyoY), 13),
        aytEdebiyat: buildSectionScore(Number(aytEdebiyatD), Number(aytEdebiyatY), 24),
        aytTarih1: buildSectionScore(Number(aytTarih1D), Number(aytTarih1Y), 10),
        aytCografya1: buildSectionScore(Number(aytCografya1D), Number(aytCografya1Y), 6),
        aytToplamNet,

        toplamNet: Number((tytToplamNet + aytToplamNet).toFixed(2)),
        createdAt: initialData?.createdAt || new Date(),
      };

      if (isEdit && initialData?.id) {
        await updateExamResult(initialData.id, examData);
      } else {
        await createExamResult(examData);
      }

      router.push("/deneme");
      router.refresh();
    } catch (err: any) {
      console.error("Exam submit error:", err);
      setErrorMsg("Sınav kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  const renderSectionInput = (
    label: string,
    maxCount: number,
    dVal: string,
    setD: (v: string) => void,
    yVal: string,
    setY: (v: string) => void,
    netVal: number
  ) => (
    <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-xl space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {label} <span className="text-slate-400 font-normal">({maxCount} S)</span>
        </span>
        <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md">
          {netVal} Net
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] text-slate-500 mb-0.5">Doğru</label>
          <input
            type="number"
            min="0"
            max={maxCount}
            value={dVal}
            onChange={(e) => setD(e.target.value)}
            placeholder="0"
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-500 mb-0.5">Yanlış</label>
          <input
            type="number"
            min="0"
            max={maxCount}
            value={yVal}
            onChange={(e) => setY(e.target.value)}
            placeholder="0"
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Basic Meta Info */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          Sınav Genel Bilgileri
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Yayın Adı
            </label>
            <input
              type="text"
              required
              placeholder="Örn. 3D Yayınları, Bilgi Sarmal"
              value={yayinAdi}
              onChange={(e) => setYayinAdi(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Sınav Adı / Numarası
            </label>
            <input
              type="text"
              placeholder="Örn. Türkiye Geneli Deneme 1"
              value={sinavAdi}
              onChange={(e) => setSinavAdi(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Deneme Tipi
            </label>
            <select
              value={denemeTipi}
              onChange={(e) => setDenemeTipi(e.target.value as ExamType)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="TYT+AYT">TYT + AYT</option>
              <option value="TYT">Yalnızca TYT</option>
              <option value="AYT">Yalnızca AYT</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Alan / Branş
            </label>
            <select
              value={alan}
              onChange={(e) => setAlan(e.target.value as AlanOption)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="Sayısal">Sayısal</option>
              <option value="Eşit Ağırlık">Eşit Ağırlık</option>
              <option value="Sözel">Sözel</option>
              <option value="Dil">Dil</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Sınav Tarihi
            </label>
            <input
              type="date"
              value={sinavTarihi}
              onChange={(e) => setSinavTarihi(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
      </div>

      {/* TYT Scores Section */}
      {(denemeTipi === "TYT" || denemeTipi === "TYT+AYT") && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              TYT Bölüm Netleri
            </h2>
            <span className="text-sm font-black text-blue-600 dark:text-blue-400">
              Toplam TYT: {tytToplamNet} / 120 Net
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {renderSectionInput("Türkçe", 40, tytTurkceD, setTytTurkceD, tytTurkceY, setTytTurkceY, tytTurkceNet)}
            {renderSectionInput("Sosyal Bilimler", 20, tytSosyalD, setTytSosyalD, tytSosyalY, setTytSosyalY, tytSosyalNet)}
            {renderSectionInput("Temel Matematik", 40, tytMatD, setTytMatD, tytMatY, setTytMatY, tytMatNet)}
            {renderSectionInput("Fen Bilimleri", 20, tytFenD, setTytFenD, tytFenY, setTytFenY, tytFenNet)}
          </div>
        </div>
      )}

      {/* AYT Scores Section */}
      {(denemeTipi === "AYT" || denemeTipi === "TYT+AYT") && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AYT Bölüm Netleri ({alan})
            </h2>
            <span className="text-sm font-black text-blue-600 dark:text-blue-400">
              Toplam AYT: {aytToplamNet} / 80 Net
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(alan === "Sayısal" || alan === "Eşit Ağırlık") &&
              renderSectionInput("AYT Matematik", 40, aytMatD, setAytMatD, aytMatY, setAytMatY, aytMatNet)}

            {alan === "Sayısal" && (
              <>
                {renderSectionInput("Fizik", 14, aytFizikD, setAytFizikD, aytFizikY, setAytFizikY, aytFizikNet)}
                {renderSectionInput("Kimya", 13, aytKimyaD, setAytKimyaD, aytKimyaY, setAytKimyaY, aytKimyaNet)}
                {renderSectionInput("Biyoloji", 13, aytBiyoD, setAytBiyoD, aytBiyoY, setAytBiyoY, aytBiyoNet)}
              </>
            )}

            {(alan === "Eşit Ağırlık" || alan === "Sözel") && (
              <>
                {renderSectionInput("Edebiyat", 24, aytEdebiyatD, setAytEdebiyatD, aytEdebiyatY, setAytEdebiyatY, aytEdebiyatNet)}
                {renderSectionInput("Tarih-1", 10, aytTarih1D, setAytTarih1D, aytTarih1Y, setAytTarih1Y, aytTarih1Net)}
                {renderSectionInput("Coğrafya-1", 6, aytCografya1D, setAytCografya1D, aytCografya1Y, setAytCografya1Y, aytCografya1Net)}
              </>
            )}
          </div>
        </div>
      )}

      {/* Notes & Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Sınav Notları / Değerlendirme
          </label>
          <textarea
            rows={3}
            placeholder="Sınav hakkındaki genel izlenimleriniz, zorlandığınız konular..."
            value={notlar}
            onChange={(e) => setNotlar(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium text-sm rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : isEdit ? "Güncelle" : "Sınavı Kaydet"}
          </button>
        </div>
      </div>
    </form>
  );
};
