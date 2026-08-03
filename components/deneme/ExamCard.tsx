"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExamResult, SectionScore } from "../../types/exam";
import { Badge } from "../ui/Badge";

interface ExamCardProps {
  exam: ExamResult;
  onDelete?: (id: string) => Promise<void>;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getSectionScore = (val: SectionScore | number | undefined): SectionScore | null => {
    if (!val) return null;
    if (typeof val === "number") {
      return { dogru: val, yanlis: 0, bos: 0, net: val };
    }
    return val;
  };

  const handleDelete = async () => {
    if (!exam.id || !onDelete) return;
    setDeleting(true);
    try {
      await onDelete(exam.id);
    } catch (err) {
      console.error("Delete exam error:", err);
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const formattedDate = exam.sinavTarihi
    ? new Date(exam.sinavTarihi).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : exam.createdAt?.seconds
    ? new Date(exam.createdAt.seconds * 1000).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Tarih Belirtilmedi";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {exam.yayinAdi || "Genel Deneme"}
            </h3>
            <Badge variant="primary">{exam.denemeTipi}</Badge>
            {exam.alan && <Badge variant="outline">{exam.alan}</Badge>}
          </div>
          {exam.sinavAdi && (
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              {exam.sinavAdi}
            </p>
          )}
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{formattedDate}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Toplam Net</span>
            <span className="text-xl font-black text-blue-600 dark:text-blue-400">
              {exam.toplamNet ?? 0}
            </span>
          </div>

          <div className="flex items-center gap-1 ml-2">
            {exam.id && (
              <Link
                href={`/deneme/${exam.id}/duzenle`}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Düzenle"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Link>
            )}
            {onDelete && (
              <button
                onClick={() => setShowConfirm(true)}
                className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                title="Sil"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Net Summaries Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {/* TYT Summary */}
        {(exam.denemeTipi === "TYT" || exam.denemeTipi === "TYT+AYT") && (
          <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl space-y-1 col-span-2">
            <div className="flex justify-between items-center font-bold text-slate-700 dark:text-slate-300">
              <span>TYT Toplam</span>
              <span className="text-blue-600 dark:text-blue-400">{exam.tytToplamNet ?? 0} Net</span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-[11px] text-slate-500 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
              <div>TR: {getSectionScore(exam.tytTurkce)?.net ?? 0}</div>
              <div>SOS: {getSectionScore(exam.tytSosyal)?.net ?? 0}</div>
              <div>MAT: {getSectionScore(exam.tytMat)?.net ?? 0}</div>
              <div>FEN: {getSectionScore(exam.tytFen)?.net ?? 0}</div>
            </div>
          </div>
        )}

        {/* AYT Summary */}
        {(exam.denemeTipi === "AYT" || exam.denemeTipi === "TYT+AYT") && (
          <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl space-y-1 col-span-2">
            <div className="flex justify-between items-center font-bold text-slate-700 dark:text-slate-300">
              <span>AYT Toplam ({exam.alan || "Sayısal"})</span>
              <span className="text-blue-600 dark:text-blue-400">{exam.aytToplamNet ?? 0} Net</span>
            </div>
            <div className="flex gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
              {exam.aytMat !== undefined && <div>MAT: {getSectionScore(exam.aytMat)?.net ?? 0}</div>}
              {exam.aytFizik !== undefined && <div>FZK: {getSectionScore(exam.aytFizik)?.net ?? 0}</div>}
              {exam.aytKimya !== undefined && <div>KMY: {getSectionScore(exam.aytKimya)?.net ?? 0}</div>}
              {exam.aytBiyoloji !== undefined && <div>BİY: {getSectionScore(exam.aytBiyoloji)?.net ?? 0}</div>}
              {exam.aytEdebiyat !== undefined && <div>EDB: {getSectionScore(exam.aytEdebiyat)?.net ?? 0}</div>}
            </div>
          </div>
        )}
      </div>

      {exam.notlar && (
        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/30 p-3 rounded-xl">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Not: </span>
          {exam.notlar}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Deneme Silinsin mi?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <strong>{exam.yayinAdi}</strong> denemesi kalıcı olarak silinecek. Bu işlem geri alınamaz.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Vazgeç
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md disabled:opacity-50"
              >
                {deleting ? "Siliniyor..." : "Evet, Sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
