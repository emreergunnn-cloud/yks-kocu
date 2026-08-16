"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  parseCalendarDate,
} from "@/services/calendar";

export function useStudyPlanDatePickerView(
  value: string
) {
  const [
    viewDate,
    setViewDate,
  ] = useState(() =>
    value
      ? parseCalendarDate(
          value
        )
      : new Date()
  );

  useEffect(() => {
    if (!value) {
      return;
    }

    const selected =
      parseCalendarDate(
        value
      );

    setViewDate(
      new Date(
        selected.getFullYear(),
        selected.getMonth(),
        1
      )
    );
  }, [value]);

  function moveMonth(
    amount: number
  ) {
    setViewDate(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() +
            amount,
          1
        )
    );
  }

  return {
    viewDate,
    moveMonth,
  };
}