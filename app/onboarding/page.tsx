"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState(1);

  const [sinif, setSinif] = useState("");
  const [alan, setAlan] = useState("");

  const [hedefUniversite, setHedefUniversite] = useState("");
  const [hedefBolum, setHedefBolum] = useState("");
  const [hedefSiralama, setHedefSiralama] = useState("");
  const [examYear, setExamYear] = useState("2027");

  const [diplomaNotu, setDiplomaNotu] = useState("");
  const [currentTYT, setCurrentTYT] = useState("");
const [currentAYT, setCurrentAYT] = useState("");

const [studyDays, setStudyDays] = useState("");
const [studyHours, setStudyHours] = useState("");
const totalCurrentNet = useMemo(() => {
  const tyt = Number(currentTYT) || 0;
  const ayt = Number(currentAYT) || 0;

  return tyt + ayt;
}, [currentTYT, currentAYT]);
  const obp = useMemo(() => {
    const n = Number(diplomaNotu);
    if (isNaN(n)) return 0;
    return Math.round(n * 5);
  }, [diplomaNotu]);

  const recommendedStudyHours = useMemo(() => {
  const target = Number(hedefSiralama);

  if (!target) return 0;

  if (target <= 1000) return 8;
  if (target <= 5000) return 7;
  if (target <= 10000) return 6;
  if (target <= 30000) return 5;
  if (target <= 60000) return 4;
  if (target <= 100000) return 3;

  return 2;
}, [hedefSiralama]);

const targetTYT = useMemo(() => {
  switch (alan) {
    case "Sayısal":
      return 105;

    case "Eşit Ağırlık":
      return 95;

    case "Sözel":
      return 90;

    case "Dil":
      return 85;

    default:
      return 90;
  }
}, [alan]);

const targetAYT = useMemo(() => {
  switch (alan) {
    case "Sayısal":
      return 72;

    case "Eşit Ağırlık":
      return 63;

    case "Sözel":
      return 68;

    case "Dil":
      return 72;

    default:
      return 60;
  }
}, [alan]);

  const next = () => {

  if (step === 2) {

    if (!sinif || !alan) {
      alert("Sınıf ve alan seçiniz.");
      return;
    }

  }

  if (step === 3) {

    if (
      !hedefUniversite ||
      !hedefBolum ||
      !hedefSiralama
    ) {
      alert("Hedef bilgilerini doldurun.");
      return;
    }

  }

  if (step === 4) {

    if (!diplomaNotu) {
      alert("Diploma notunu gir.");
      return;
    }

  }

  if (step === 5) {

    if (!currentTYT || !currentAYT) {
      alert("Netlerini gir.");
      return;
    }

  }

  if (step === 6) {

    if (!studyDays || !studyHours) {
      alert("Çalışma planını gir.");
      return;
    }

  }

  setStep((s) => Math.min(7, s + 1));
};

  const finishOnboarding = async () => {
  if (!user) return;

  try {
    await updateDoc(doc(db, "users", user.uid), {
      onboardingCompleted: true,

      sinif,
      alan,

      hedefUniversite,
      hedefBolum,
      hedefSiralama: Number(hedefSiralama),

      examYear,

      diplomaGrade: Number(diplomaNotu),
      obp,

      currentTYT: Number(currentTYT),
      currentAYT: Number(currentAYT),

      studyDays: Number(studyDays),
      studyHours: Number(studyHours),

      updatedAt: new Date(),
    });

    router.replace("/dashboard");
  } catch (err) {
    console.error(err);
    alert("Bilgiler kaydedilemedi.");
  }
};

  const prev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="max-w-3xl mx-auto py-10 px-5">

        <div className="mb-8">

          <div className="flex justify-between text-sm mb-2">

            <span>
              Adım {step} / 7
            </span>

            <span>
              %{Math.round((step / 7) * 100)}
            </span>

          </div>

          <div className="w-full h-3 rounded-full bg-slate-300 overflow-hidden">

            <div
              className="h-full bg-blue-600 transition-all"
              style={{
                width: `${(step / 7) * 100}%`,
              }}
            />

          </div>

        </div>

        <div className="bg-white text-slate-900 rounded-2xl shadow-lg p-8">

          {step === 1 && (

            <div className="space-y-6">

              <h1 className="text-4xl font-bold text-slate-900">
                Hoş Geldin 👋
              </h1>

              <p className="text-slate-600">

                Sana özel çalışma programı oluşturabilmemiz için
                birkaç bilgiye ihtiyacımız var.

              </p>

              <p className="text-slate-600">

                Bu işlem yaklaşık 2 dakika sürecek.

              </p>

            </div>

          )}

          {step === 2 && (

            <div className="space-y-6">

              <h2 className="text-3xl font-bold text-slate-900">
                Eğitim Bilgileri
              </h2>

              <div>

                <label className="font-medium block mb-2">
                  Sınıf
                </label>

                <select
                  value={sinif}
                  onChange={(e) => setSinif(e.target.value)}
                  className="w-full border rounded-xl p-3 bg-white text-slate-900"
                >
                  <option value="">Seçiniz</option>
                  <option>9</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                  <option>Mezun</option>
                </select>

              </div>

              <div>

                <label className="font-medium block mb-2">
                  Alan
                </label>

                <select
                  value={alan}
                  onChange={(e) => setAlan(e.target.value)}
                  className="w-full border rounded-xl p-3"
                >
                  <option value="">Seçiniz</option>

                  <option>Sayısal</option>

                  <option>Eşit Ağırlık</option>

                  <option>Sözel</option>

                  <option>Dil</option>

                </select>

              </div>

            </div>

          )}

            {step === 3 && (

  <div className="space-y-6">

    <h2 className="text-3xl font-bold text-slate-900">
    </h2>

    <div>

      <label className="font-medium block mb-2">
        Hedef Üniversite
      </label>

      <input
        value={hedefUniversite}
        onChange={(e) => setHedefUniversite(e.target.value)}
        className="w-full border rounded-xl p-3"
        placeholder="Örn: İTÜ"
      />

    </div>

    <div>

      <label className="font-medium block mb-2">
        Hedef Bölüm
      </label>

      <input
        value={hedefBolum}
        onChange={(e) => setHedefBolum(e.target.value)}
        className="w-full border rounded-xl p-3"
        placeholder="Bilgisayar Mühendisliği"
      />

    </div>

    <div>

      <label className="font-medium block mb-2">
        Hedef Sıralama
      </label>

      <input
        type="number"
        value={hedefSiralama}
        onChange={(e) => setHedefSiralama(e.target.value)}
        className="w-full border rounded-xl p-3"
        placeholder="8000"
      />

    </div>

    <div>

      <label className="font-medium block mb-2">
        Gireceğin Sınav
      </label>

      <select
        value={examYear}
        onChange={(e) => setExamYear(e.target.value)}
        className="w-full border rounded-xl p-3"
      >

        <option>2027</option>
        <option>2028</option>
        <option>2029</option>

      </select>

    </div>

  </div>

)}

      {step === 4 && (

  <div className="space-y-6">

    <h2 className="text-3xl font-bold text-slate-900">
      Diploma Bilgisi
    </h2>

    <div>

      <label className="font-medium block mb-2">
        Diploma Notun
      </label>

      <input
        type="number"
        value={diplomaNotu}
        onChange={(e) => setDiplomaNotu(e.target.value)}
        className="w-full border rounded-xl p-3"
        placeholder="92.50"
      />

    </div>

    <div className="rounded-xl bg-blue-50 p-6">

      <p className="text-sm text-slate-500">
        Hesaplanan OBP
      </p>

      <p className="text-5xl font-bold text-blue-700">
        {obp}
      </p>

    </div>

  </div>

)}

        {step === 5 && (

<div className="space-y-6">

<h2 className="text-3xl font-bold text-slate-900">

Mevcut Netlerin

</h2>

<div>

<label className="font-medium block mb-2">

TYT Netin

</label>

<input
type="number"
value={currentTYT}
onChange={(e)=>setCurrentTYT(e.target.value)}
className="w-full border rounded-xl p-3"
placeholder="70"
/>

</div>

<div>

<label className="font-medium block mb-2">

AYT Netin

</label>

<input
type="number"
value={currentAYT}
onChange={(e)=>setCurrentAYT(e.target.value)}
className="w-full border rounded-xl p-3"
placeholder="45"
/>

</div>

<div className="bg-green-50 rounded-xl p-6">

<p className="text-sm text-slate-500">

Toplam Net

</p>

<p className="text-5xl font-bold text-green-700">

{totalCurrentNet}

</p>

</div>

</div>

)}

        {step === 6 && (

<div className="space-y-6">

<h2 className="text-3xl font-bold text-slate-900">

Çalışma Düzenin

</h2>

<div>

<label className="font-medium block mb-2">

Haftada kaç gün çalışabilirsin?

</label>

<select

value={studyDays}

onChange={(e)=>setStudyDays(e.target.value)}

className="w-full border rounded-xl p-3"

>

<option value="">Seç</option>

<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
<option value="7">7</option>

</select>

</div>

<div>

<label className="font-medium block mb-2">

Günde kaç saat çalışabilirsin?

</label>

<input

type="number"

value={studyHours}

onChange={(e)=>setStudyHours(e.target.value)}

className="w-full border rounded-xl p-3"

placeholder="5"

/>

</div>

<div className="rounded-xl bg-yellow-50 p-5">

<p className="text-slate-700">

🤖 Yapay zeka bu bilgilere göre sana günlük program hazırlayacak.

</p>

</div>

</div>

)}

            {step === 7 && (

<div className="space-y-8">

<h1 className="text-4xl font-bold text-slate-900">

🎉 Hazırsın

</h1>

<p className="text-slate-700">

Artık sana özel çalışma programı oluşturabiliriz.

</p>

<div className="grid grid-cols-2 gap-4">

<div className="border rounded-xl p-4">

<p className="text-sm">

Alan

</p>

<b>{alan}</b>

</div>

<div className="border rounded-xl p-4">

<p className="text-sm">

Sınıf

</p>

<b>{sinif}</b>

</div>

<div className="border rounded-xl p-4">

<p className="text-sm">

TYT

</p>

<b>{currentTYT}</b>

</div>

<div className="border rounded-xl p-4">

<p className="text-sm">

AYT

</p>

<b>{currentAYT}</b>

</div>

<div className="border rounded-xl p-4">

<p className="text-sm">

OBP

</p>

<b>{obp}</b>

</div>

<div className="border rounded-xl p-4">

<p className="text-sm">

Hedef

</p>

<b>

{hedefUniversite}

</b>

</div>

</div>

<div className="grid md:grid-cols-2 gap-5 mt-8">

  <div className="rounded-xl bg-blue-50 p-5">

    <p className="text-sm text-slate-500">
      Önerilen Günlük Çalışma
    </p>

    <p className="text-4xl font-bold text-blue-700">
      {recommendedStudyHours} Saat
    </p>

  </div>

  <div className="rounded-xl bg-green-50 p-5">

    <p className="text-sm text-slate-500">
      Hedef TYT
    </p>

    <p className="text-4xl font-bold text-green-700">
      {targetTYT}
    </p>

  </div>

  <div className="rounded-xl bg-purple-50 p-5">

    <p className="text-sm text-slate-500">
      Hedef AYT
    </p>

    <p className="text-4xl font-bold text-purple-700">
      {targetAYT}
    </p>

  </div>

  <div className="rounded-xl bg-orange-50 p-5">

    <p className="text-sm text-slate-500">
      Toplam Net
    </p>

    <p className="text-4xl font-bold text-orange-700">
      {totalCurrentNet}
    </p>

  </div>

</div>

<div className="mt-8 rounded-2xl bg-slate-900 text-white p-8">

  <h2 className="text-2xl font-bold">
    🤖 AI Koç İlk Analizi
  </h2>

  <ul className="space-y-3 mt-6">

    <li>
      🎯 Üniversite:
      <strong> {hedefUniversite}</strong>
    </li>

    <li>
      📚 Bölüm:
      <strong> {hedefBolum}</strong>
    </li>

    <li>
      📈 Hedef Sıralama:
      <strong> {hedefSiralama}</strong>
    </li>

    <li>
      📝 Hedef TYT:
      <strong> {targetTYT}</strong>
    </li>

    <li>
      📝 Hedef AYT:
      <strong> {targetAYT}</strong>
    </li>

    <li>
      ⏰ Günlük önerilen çalışma:
      <strong> {recommendedStudyHours} saat</strong>
    </li>

  </ul>

</div>

</div>

)}

          <div className="mt-10 flex justify-between">

  <button
    onClick={prev}
    disabled={step === 1}
    className="px-6 py-3 rounded-xl border disabled:opacity-40"
  >
    Geri
  </button>

  {step < 7 ? (

    <button
      onClick={next}
      className="px-6 py-3 rounded-xl bg-blue-600 text-white"
    >
      İleri
    </button>

  ) : (

    <button
      onClick={finishOnboarding}
      className="px-6 py-3 rounded-xl bg-green-600 text-white"
    >
      Başla 🚀
    </button>

  )}

</div>

        </div>

      </div>

    </div>
  );
}