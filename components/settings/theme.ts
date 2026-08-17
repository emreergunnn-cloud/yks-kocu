import type {
  UserSettings,
} from "@/services/settingsService";

export function applyTheme(
  theme:
    UserSettings["theme"]
) {
  if (
    typeof document ===
    "undefined"
  ) {
    return;
  }

  const html =
    document.documentElement;

  html.dataset.theme =
    theme;

  const dark =
    theme === "dark" ||
    (
      theme === "system" &&
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
    );

  html.classList.toggle(
    "dark",
    dark
  );
}
