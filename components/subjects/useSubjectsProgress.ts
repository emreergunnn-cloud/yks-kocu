"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  getTopicProgress,
  saveTopicStatus,
  type SubjectProgressMap,
} from "@/services/topicService";

import {
  getNextTopicStatus,
} from "./constants";

export function useSubjectsProgress() {
  const { user } =
    useAuth();

  const [
    progressMap,
    setProgressMap,
  ] =
    useState<SubjectProgressMap>(
      {}
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState<Set<string>>(
      new Set()
    );

  useEffect(() => {
    if (!user) {
      setProgressMap({});
      setLoading(false);

      return;
    }

    let active = true;
    const uid = user.uid;

    async function load() {
      setLoading(true);

      const progress =
        await getTopicProgress(
          uid
        );

      if (active) {
        setProgressMap(
          progress
        );

        setLoading(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [user]);

  const changeStatus =
    useCallback(
      async (
        subjectId: string,
        topicId: string
      ) => {
        if (!user) {
          return;
        }

        const current =
          progressMap[
            subjectId
          ]?.[topicId];

        const next =
          getNextTopicStatus(
            current
          );

        const key =
          `${subjectId}:${topicId}`;

        setSaving(
          (previous) =>
            new Set(
              previous
            ).add(key)
        );

        try {
          await saveTopicStatus(
            user.uid,
            subjectId,
            topicId,
            next
          );

          setProgressMap(
            (previous) => ({
              ...previous,

              [subjectId]: {
                ...previous[
                  subjectId
                ],

                [topicId]:
                  next,
              },
            })
          );
        } catch (error) {
          console.error(
            "Konu durumu kaydedilemedi:",
            error
          );
        } finally {
          setSaving(
            (previous) => {
              const nextSet =
                new Set(
                  previous
                );

              nextSet.delete(
                key
              );

              return nextSet;
            }
          );
        }
      },
      [
        user,
        progressMap,
      ]
    );

  return {
    progressMap,
    loading,
    saving,
    changeStatus,
  };
}

