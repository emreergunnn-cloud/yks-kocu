"use client";

import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserSettings } from "../../services/settingsService";

/**
 * ThemeProvider applies dark/light/system theme class to <html> element.
 * Reads from user settings in Firestore; falls back to system preference.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    const applyTheme = (theme: "light" | "dark" | "system") => {
      const html = document.documentElement;
      if (theme === "dark") {
        html.classList.add("dark");
      } else if (theme === "light") {
        html.classList.remove("dark");
      } else {
        // system
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) html.classList.add("dark");
        else html.classList.remove("dark");
      }
    };

    if (user) {
      getUserSettings(user.uid).then((settings) => {
        applyTheme(settings.theme);
      }).catch(() => {
        applyTheme("system");
      });
    } else {
      applyTheme("system");
    }
  }, [user]);

  // Also listen to system preference changes when theme is 'system'
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const html = document.documentElement;
      if (!html.dataset.theme) {
        if (e.matches) html.classList.add("dark");
        else html.classList.remove("dark");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return <>{children}</>;
}
