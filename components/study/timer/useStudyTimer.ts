"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  YKS_SUBJECTS,
} from "@/lib/constants/subjects";

import {
  getUserSettings,
} from "@/services/settingsService";

import {
  getRecentStudySessions,
} from "@/services/studyService";

import {
  getStudyStats,
  type StudyStats,
} from "@/services/studyStatsService";

import {
  completeStudySession,
} from "@/services/studySessionCompletionService";

import {
  getModeSeconds,
  PRESETS,
} from "./constants";

import type {
  PomodoroMode,
  Preset,
  RecentTimerSession,
} from "./types";

const EMPTY_STATS:
  StudyStats = {
    todayMinutes: 0,
    weekMinutes: 0,
    monthMinutes: 0,

    todaySessions: 0,
    weekSessions: 0,
    monthSessions: 0,
  };

export function useStudyTimer() {
  const { user } =
    useAuth();

  const searchParams =
    useSearchParams();

  const urlSubjectId =
    searchParams.get(
      "subjectId"
    );

  const urlTopicId =
    searchParams.get(
      "topicId"
    );

  const urlDuration =
    searchParams.get(
      "duration"
    );

  const [
    preset,
    setPreset,
  ] =
    useState<Preset>(
      PRESETS[0]
    );

  const [
    mode,
    setMode,
  ] =
    useState<PomodoroMode>(
      "pomodoro"
    );

  const [
    timeLeft,
    setTimeLeft,
  ] =
    useState(
      PRESETS[0].work *
        60
    );

  const [
    isRunning,
    setIsRunning,
  ] =
    useState(false);

  const [
    cycleCount,
    setCycleCount,
  ] =
    useState(0);

  const [
    subject,
    setSubject,
  ] =
    useState("");

  const [
    note,
    setNote,
  ] =
    useState("");

  const [
    subjectId,
    setSubjectId,
  ] =
    useState("");

  const [
    topicId,
    setTopicId,
  ] =
    useState("");

  const [
    stats,
    setStats,
  ] =
    useState<StudyStats>(
      EMPTY_STATS
    );

  const [
    recentSessions,
    setRecentSessions,
  ] =
    useState<
      RecentTimerSession[]
    >([]);

  const [
    successSession,
    setSuccessSession,
  ] =
    useState<
      RecentTimerSession |
      null
    >(null);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const endAtRef =
    useRef<
      number | null
    >(null);

  const savingRef =
    useRef(false);

  const refreshHistory =
    useCallback(
      async () => {
        if (!user) {
          setStats(
            EMPTY_STATS
          );

          setRecentSessions(
            []
          );

          return;
        }

        const [
          nextStats,
          sessions,
        ] =
          await Promise.all([
            getStudyStats(
              user.uid
            ),

            getRecentStudySessions(
              user.uid
            ),
          ]);

        setStats(
          nextStats
        );

        setRecentSessions(
          sessions
            .slice(0, 5)
            .map(
              (session) => ({
                subject:
                  session.subject,

                duration:
                  session.duration,

                ts:
                  session.endTime.toDate(),
              })
            )
        );
      },
      [user]
    );

  useEffect(() => {
    void refreshHistory();
  }, [refreshHistory]);

  useEffect(() => {
    setSubjectId(
      urlSubjectId ?? ""
    );

    setTopicId(
      urlTopicId ?? ""
    );

    if (
      urlSubjectId &&
      urlTopicId
    ) {
      const foundSubject =
        YKS_SUBJECTS.find(
          (item) =>
            item.id ===
            urlSubjectId
        );

      const foundTopic =
        foundSubject?.topics.find(
          (item) =>
            item.id ===
            urlTopicId
        );

      if (
        foundSubject &&
        foundTopic
      ) {
        setSubject(
          `${foundSubject.name} - ${foundTopic.name}`
        );
      }
    }

    if (!urlDuration) {
      return;
    }

    const minutes =
      Number.parseInt(
        urlDuration,
        10
      );

    if (
      !Number.isFinite(
        minutes
      ) ||
      minutes <= 0
    ) {
      return;
    }

    const existing =
      PRESETS.find(
        (item) =>
          item.work ===
          minutes
      );

    const nextPreset =
      existing ?? {
        label:
          `${minutes} Dk`,

        work:
          minutes,

        short: 5,
        long: 15,
      };

    setPreset(
      nextPreset
    );

    setMode(
      "pomodoro"
    );

    setTimeLeft(
      nextPreset.work *
        60
    );
  }, [
    urlSubjectId,
    urlTopicId,
    urlDuration,
  ]);

  useEffect(() => {
    if (
      !user ||
      urlDuration
    ) {
      return;
    }

    let active = true;
    const uid = user.uid;

    async function load() {
      const settings =
        await getUserSettings(
          uid
        );

      if (!active) {
        return;
      }

      const matchingPreset =
        PRESETS.find(
          (item) =>
            item.work ===
            settings
              .pomodoroLength
        );

      const nextPreset:
        Preset = {
          label:
            matchingPreset
              ?.label ??
            `${settings.pomodoroLength} Dk`,

          work:
            settings
              .pomodoroLength,

          short:
            settings
              .breakLength,

          long:
            settings
              .longBreakLength,
        };

      setPreset(
        nextPreset
      );

      setMode(
        "pomodoro"
      );

      setTimeLeft(
        nextPreset.work *
          60
      );
    }

    void load();

    return () => {
      active = false;
    };
  }, [
    user,
    urlDuration,
  ]);

  const saveSession =
    useCallback(
      async (
        seconds: number
      ) => {
        if (
          !user ||
          seconds <= 0 ||
          savingRef.current
        ) {
          return;
        }

        savingRef.current =
          true;

        setSaving(true);
        setError(null);

        try {
          const saved =
            await completeStudySession({
              uid:
                user.uid,

              subject:
                subject ||
                "Genel",

              duration:
                seconds,

              subjectId:
                subjectId ||
                undefined,

              topicId:
                topicId ||
                undefined,

              note:
                note ||
                undefined,
            });

          setSuccessSession({
            subject:
              subject ||
              "Genel",

            duration:
              seconds,

            ts:
              saved.endTime.toDate(),
          });

          await refreshHistory();
        } catch (saveError) {
          console.error(
            saveError
          );

          setError(
            "Çalışma seansı kaydedilemedi."
          );
        } finally {
          savingRef.current =
            false;

          setSaving(false);
        }
      },
      [
        user,
        subject,
        subjectId,
        topicId,
        note,
        refreshHistory,
      ]
    );

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    if (!endAtRef.current) {
      endAtRef.current =
        Date.now() +
        timeLeft * 1000;
    }

    const tick = () => {
      if (
        !endAtRef.current
      ) {
        return;
      }

      const remaining =
        Math.max(
          0,
          Math.ceil(
            (
              endAtRef.current -
              Date.now()
            ) / 1000
          )
        );

      setTimeLeft(
        remaining
      );

      if (remaining > 0) {
        return;
      }

      endAtRef.current =
        null;

      setIsRunning(
        false
      );

      if (
        mode ===
        "pomodoro"
      ) {
        setCycleCount(
          (value) =>
            value + 1
        );

        void saveSession(
          getModeSeconds(
            preset,
            "pomodoro"
          )
        );
      }
    };

    tick();

    const interval =
      window.setInterval(
        tick,
        250
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [
    isRunning,
    mode,
    preset,
    timeLeft,
    saveSession,
  ]);

  const changeMode =
    useCallback(
      (
        nextMode:
          PomodoroMode
      ) => {
        endAtRef.current =
          null;

        setIsRunning(
          false
        );

        setMode(
          nextMode
        );

        setTimeLeft(
          getModeSeconds(
            preset,
            nextMode
          )
        );
      },
      [preset]
    );

  const changePreset =
    useCallback(
      (
        nextPreset:
          Preset
      ) => {
        endAtRef.current =
          null;

        setIsRunning(
          false
        );

        setPreset(
          nextPreset
        );

        setMode(
          "pomodoro"
        );

        setTimeLeft(
          nextPreset.work *
            60
        );
      },
      []
    );

  const toggleRunning =
    useCallback(() => {
      if (isRunning) {
        if (
          endAtRef.current
        ) {
          setTimeLeft(
            Math.max(
              0,
              Math.ceil(
                (
                  endAtRef.current -
                  Date.now()
                ) / 1000
              )
            )
          );
        }

        endAtRef.current =
          null;

        setIsRunning(
          false
        );

        return;
      }

      if (timeLeft <= 0) {
        return;
      }

      endAtRef.current =
        Date.now() +
        timeLeft * 1000;

      setIsRunning(
        true
      );
    }, [
      isRunning,
      timeLeft,
    ]);

  const reset =
    useCallback(() => {
      endAtRef.current =
        null;

      setIsRunning(
        false
      );

      setTimeLeft(
        getModeSeconds(
          preset,
          mode
        )
      );
    }, [
      preset,
      mode,
    ]);

  const skip =
    useCallback(() => {
      if (
        mode ===
        "pomodoro"
      ) {
        const total =
          getModeSeconds(
            preset,
            "pomodoro"
          );

        const elapsed =
          total -
          timeLeft;

        if (elapsed > 60) {
          void saveSession(
            elapsed
          );
        }

        const longBreak =
          cycleCount > 0 &&
          cycleCount % 4 === 0;

        changeMode(
          longBreak
            ? "long_break"
            : "short_break"
        );

        return;
      }

      changeMode(
        "pomodoro"
      );
    }, [
      mode,
      preset,
      timeLeft,
      cycleCount,
      saveSession,
      changeMode,
    ]);

  return {
    preset,
    mode,
    timeLeft,
    isRunning,

    cycleCount,
    stats,
    recentSessions,

    subject,
    note,

    error,
    saving,

    successSession,

    setSubject,
    setNote,

    changePreset,
    changeMode,

    toggleRunning,
    reset,
    skip,

    closeSuccess:
      () =>
        setSuccessSession(
          null
        ),
  };
}

