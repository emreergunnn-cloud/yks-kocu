"use client";

import { useMemo, useState } from "react";

export function useCalendarMonth() {
  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const previousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((value) => value - 1);
      return;
    }
    setMonth((value) => value - 1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((value) => value + 1);
      return;
    }
    setMonth((value) => value + 1);
  };

  return { year, month, previousMonth, nextMonth };
}
