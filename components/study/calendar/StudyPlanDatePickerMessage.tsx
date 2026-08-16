import type {
  StudyPlanMode,
} from "./types";

interface Props {
  mode: StudyPlanMode;

  loading: boolean;

  unavailable: boolean;
}

export function StudyPlanDatePickerMessage({
  mode,
  loading,
  unavailable,
}: Props) {
  if (loading) {
    return (
      <p className="mt-2 text-[10px] text-slate-400">
        Takvim kontrol
        ediliyor...
      </p>
    );
  }

  if (unavailable) {
    return (
      <p className="mt-2 text-[10px] font-semibold text-rose-500">
        Bu tarih
        ödevlendirme için
        kullanılamaz.
      </p>
    );
  }

  return (
    <p className="mt-2 text-[10px] text-slate-400">
      {mode === "daily"
        ? "Kırmızı günlerde mevcut ödev var."
        : "Seçilen 7 günlük aralıkta mevcut ödev bulunamaz."}
    </p>
  );
}