"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  const [sinif, setSinif] = useState("");
  const [alan, setAlan] = useState("");
  const [hedefBolum, setHedefBolum] = useState("");
  const [hedefSiralama, setHedefSiralama] = useState("");

  const girisYap = async () => {
    const sonuc = await signInWithPopup(auth, provider);
    setUser(sonuc.user);
  };

  const kaydet = async () => {
    await setDoc(doc(db, "users", user.uid), {
      adSoyad: user.displayName,
      email: user.email,
      sinif,
      alan,
      hedefBolum,
      hedefSiralama,
      createdAt: new Date(),
    });

    alert("Kayıt tamamlandı");
  };

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <button
          onClick={girisYap}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Google ile Giriş Yap
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center gap-4 p-10">

      <h1 className="text-3xl font-bold">
        Hoş Geldin {user.displayName}
      </h1>

      <select
        value={sinif}
        onChange={(e) => setSinif(e.target.value)}
        className="border p-2 w-80"
      >
        <option value="">Sınıf Seç</option>
        <option>9</option>
        <option>10</option>
        <option>11</option>
        <option>12</option>
        <option>Mezun</option>
      </select>

      <select
        value={alan}
        onChange={(e) => setAlan(e.target.value)}
        className="border p-2 w-80"
      >
        <option value="">Alan Seç</option>
        <option>Sayısal</option>
        <option>Eşit Ağırlık</option>
        <option>Sözel</option>
        <option>Dil</option>
      </select>

      <input
        placeholder="Hedef Bölüm"
        value={hedefBolum}
        onChange={(e) => setHedefBolum(e.target.value)}
        className="border p-2 w-80"
      />

      <input
        placeholder="Hedef Sıralama"
        value={hedefSiralama}
        onChange={(e) => setHedefSiralama(e.target.value)}
        className="border p-2 w-80"
      />

      <button
        onClick={kaydet}
        className="bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        Kaydet
      </button>

    </main>
  );
}