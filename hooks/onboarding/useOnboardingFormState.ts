"use client";

import { useState } from "react";
import type { OnboardingData } from "./types";

export function useOnboardingFormState() {
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

  const data: OnboardingData = { sinif, alan, hedefUniversite, hedefBolum, hedefSiralama, examYear, diplomaNotu, currentTYT, currentAYT, studyDays, studyHours };
  return {
    data,
    sinif, setSinif, alan, setAlan,
    hedefUniversite, setHedefUniversite, hedefBolum, setHedefBolum,
    hedefSiralama, setHedefSiralama, examYear, setExamYear,
    diplomaNotu, setDiplomaNotu, currentTYT, setCurrentTYT, currentAYT, setCurrentAYT,
    studyDays, setStudyDays, studyHours, setStudyHours,
  };
}
