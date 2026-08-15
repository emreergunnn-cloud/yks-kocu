/**
 * Konunun tahmini çalışma süresini belirler.
 *
 * Buradaki mantık daha sonra gerçek veriyle geliştirilebilir:
 * - öğrencinin geçmiş çalışma süresi
 * - soru başına harcadığı süre
 * - deneme başarı oranı
 * - konu zorluğu
 *
 * Şimdilik konu adına göre başlangıç seviyesi tahmini kullanıyoruz.
 */

const DIFFICULT_KEYWORDS = [
  "fonksiyon",
  "polinom",
  "trigonometri",
  "limit",
  "türev",
  "integral",
  "problem",
  "paragraf",
  "geometri",
  "elektrik",
  "manyetizma",
  "modern fizik",
  "organik",
  "denge",
  "çözeltiler",
  "kalıtım",
  "ekosistem",
];

const EASY_KEYWORDS = [
  "giriş",
  "temel",
  "mantık",
  "kümeler",
  "sözcükte anlam",
  "tarih bilimine giriş",
];

export function getTopicDuration(topicName: string): number {
  const name = topicName.toLocaleLowerCase("tr-TR");

  if (DIFFICULT_KEYWORDS.some((keyword) => name.includes(keyword))) {
    return 75;
  }

  if (EASY_KEYWORDS.some((keyword) => name.includes(keyword))) {
    return 35;
  }

  return 50;
}