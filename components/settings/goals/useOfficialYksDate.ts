"use client";

import { useEffect, useState } from "react";
import { fetchOfficialYksDate } from "@/services/yksDateService";

export function useOfficialYksDate(year: number) {
  const [officialDate, setOfficialDate] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    let active = true;
    async function check() {
      setChecking(true);
      const date = await fetchOfficialYksDate(year);
      if (!active) return;
      setOfficialDate(date);
      setChecking(false);
    }
    void check();
    return () => { active = false; };
  }, [year]);

  return { officialDate, checking };
}
