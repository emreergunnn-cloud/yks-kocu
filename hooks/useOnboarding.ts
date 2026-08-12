"use client";

import { useMemo, useState } from "react";

export interface OnboardingData {
  sinif: string;
  alan: string;
  hedefUniversite: string;
  hedefBolum: string;
  hedefSiralama: string;
  examYear: string;
  diplomaNotu: string;
  currentTYT: string;
  currentAYT: string;
  studyDays: string;
  studyHours: string;
}

export function useOnboarding() {
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
    return (
      (Number(currentTYT) || 0) +
      (Number(currentAYT) || 0)
    );
  }, [currentTYT, currentAYT]);

  const obp = useMemo(() => {
    const value = Number(diplomaNotu);

    if (Number.isNaN(value)) {
      return 0;
    }

    return Math.round(value * 5);
  }, [diplomaNotu]);

  const recommendedStudyHours = useMemo(() => {
    const target = Number(hedefSiralama);
    const capacity = Number(studyHours) || 0;

    let baseRecommendation = 2;
    if (target > 0) {
      if (target <= 1000) baseRecommendation = 8;
      else if (target <= 5000) baseRecommendation = 7;
      else if (target <= 10000) baseRecommendation = 6;
      else if (target <= 30000) baseRecommendation = 5;
      else if (target <= 60000) baseRecommendation = 4;
      else if (target <= 100000) baseRecommendation = 3;
    }

    if (capacity > 0) {
      return Math.min(baseRecommendation, capacity);
    }
    return baseRecommendation;
  }, [hedefSiralama, studyHours]);

  const targetTYT = useMemo(() => {
    const rank = Number(hedefSiralama) || 250000;
    
    let baseTYT = 60;
    if (rank <= 1000) baseTYT = 110;
    else if (rank <= 5000) baseTYT = 100;
    else if (rank <= 20000) baseTYT = 90;
    else if (rank <= 50000) baseTYT = 80;
    else if (rank <= 100000) baseTYT = 70;
    
    if (alan === "Sayısal") return baseTYT + 2;
    if (alan === "Sözel") return Math.max(50, baseTYT - 5);
    if (alan === "Dil") return Math.max(50, baseTYT - 10);
    
    return baseTYT;
  }, [alan, hedefSiralama]);

  const targetAYT = useMemo(() => {
    const rank = Number(hedefSiralama) || 250000;
    
    let baseAYT = 35;
    if (rank <= 1000) baseAYT = 75;
    else if (rank <= 5000) baseAYT = 70;
    else if (rank <= 20000) baseAYT = 60;
    else if (rank <= 50000) baseAYT = 50;
    else if (rank <= 100000) baseAYT = 45;
    
    if (alan === "Dil") {
        if (rank <= 5000) return 75;
        if (rank <= 20000) return 65;
        return 55;
    }
    
    return baseAYT;
  }, [alan, hedefSiralama]);

  const next = () => {
    if (step === 2 && (!sinif || !alan)) {
      alert("Sınıf ve alan seçiniz.");
      return false;
    }

    if (
      step === 3 &&
      (!hedefUniversite ||
        !hedefBolum ||
        !hedefSiralama)
    ) {
      alert("Hedef bilgilerini doldurun.");
      return false;
    }

    if (step === 4 && !diplomaNotu) {
      alert("Diploma notunu gir.");
      return false;
    }

    if (
      step === 5 &&
      (!currentTYT || !currentAYT)
    ) {
      alert("Netlerini gir.");
      return false;
    }

    if (
      step === 6 &&
      (!studyDays || !studyHours)
    ) {
      alert("Çalışma planını gir.");
      return false;
    }

    setStep((current) => Math.min(7, current + 1));

    return true;
  };

  const prev = () => {
    setStep((current) => Math.max(1, current - 1));
  };

  const data: OnboardingData = {
    sinif,
    alan,
    hedefUniversite,
    hedefBolum,
    hedefSiralama,
    examYear,
    diplomaNotu,
    currentTYT,
    currentAYT,
    studyDays,
    studyHours,
  };

  return {
    step,
    setStep,

    data,

    sinif,
    setSinif,

    alan,
    setAlan,

    hedefUniversite,
    setHedefUniversite,

    hedefBolum,
    setHedefBolum,

    hedefSiralama,
    setHedefSiralama,

    examYear,
    setExamYear,

    diplomaNotu,
    setDiplomaNotu,

    currentTYT,
    setCurrentTYT,

    currentAYT,
    setCurrentAYT,

    studyDays,
    setStudyDays,

    studyHours,
    setStudyHours,

    obp,
    totalCurrentNet,
    recommendedStudyHours,
    targetTYT,
    targetAYT,

    next,
    prev,
  };
}
