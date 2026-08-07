import { InfoCard } from "@/components/ui/InfoCard";

export function CalculatorInfo() {
  return (
    <InfoCard title="💡 Bilgilendirme">

      <p className="leading-8 text-slate-600 dark:text-slate-300">
        Bu hesaplama geçmiş yılların TYT, AYT ve OBP verileri
        kullanılarak oluşturulmuş tahmini başarı sıralamasıdır.

        Gerçek sonuçlar;

        sınavın zorluk derecesi,

        standart sapma,

        aday performansı

        ve ÖSYM değerlendirmelerine göre değişebilir.
      </p>

    </InfoCard>
  );
}