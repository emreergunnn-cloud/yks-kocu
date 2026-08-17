"use client";

import {
  useEffect,
} from "react";

import {
  useAuth,
} from "@/context/AuthContext";

import {
  getUserSettings,
} from "@/services/settingsService";

import {
  applyTheme,
} from "./theme";

export function ThemeProvider({
  children,
}: {
  children:
    React.ReactNode;
}) {
  const { user } =
    useAuth();

  useEffect(() => {
    let active = true;

    if (!user) {
      applyTheme(
        "system"
      );

      return;
    }

    const uid =
      user.uid;

    async function load() {
      const settings =
        await getUserSettings(
          uid
        );

      if (active) {
        applyTheme(
          settings.theme
        );
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    const media =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    function handleChange() {
      if (
        document
          .documentElement
          .dataset
          .theme ===
        "system"
      ) {
        applyTheme(
          "system"
        );
      }
    }

    media.addEventListener(
      "change",
      handleChange
    );

    return () => {
      media.removeEventListener(
        "change",
        handleChange
      );
    };
  }, []);

  return (
    <>
      {children}
    </>
  );
}
