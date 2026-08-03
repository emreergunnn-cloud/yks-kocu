"use client";

import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

export default function DenemePage() {
  const [tytTurkce, setTytTurkce] = useState("");
  const [tytSosyal, setTytSosyal] = useState("");
  const [tytMat, setTytMat] = useState("");
  const [tytFen, setTytFen] = useState("");

  const [aytMat, setAytMat] = useState("");
  const [aytFizik, setAytFizik] = useState("");
  const [aytKimya, setAytKimya] = useState("");
  const [aytBiyoloji, setAytBiyoloji] = useState("");

  const kaydet = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Önce giriş yap");
      return;
    }

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
  };

  return (
    <main className="min-h-screen flex flex-col items-center gap-3 p-10">

      <h1 className="text-3xl font-bold">
        Deneme Sonucu Ekle
      </h1>

      <input placeholder="TYT Türkçe" value={tytTurkce} onChange={(e) => setTytTurkce(e.target.value)} className="border p-2 w-72" />
      <input placeholder="TYT Sosyal" value={tytSosyal} onChange={(e) => setTytSosyal(e.target.value)} className="border p-2 w-72" />
      <input placeholder="TYT Matematik" value={tytMat} onChange={(e) => setTytMat(e.target.value)} className="border p-2 w-72" />
      <input placeholder="TYT Fen" value={tytFen} onChange={(e) => setTytFen(e.target.value)} className="border p-2 w-72" />

      <input placeholder="AYT Matematik" value={aytMat} onChange={(e) => setAytMat(e.target.value)} className="border p-2 w-72" />
      <input placeholder="AYT Fizik" value={aytFizik} onChange={(e) => setAytFizik(e.target.value)} className="border p-2 w-72" />
      <input placeholder="AYT Kimya" value={aytKimya} onChange={(e) => setAytKimya(e.target.value)} className="border p-2 w-72" />
      <input placeholder="AYT Biyoloji" value={aytBiyoloji} onChange={(e) => setAytBiyoloji(e.target.value)} className="border p-2 w-72" />

      <button
        onClick={kaydet}
        className="bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        Kaydet
      </button>

    </main>
  );
}