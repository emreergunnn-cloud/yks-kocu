import type {
  UserSettings,
} from "@/services/settingsService";

export type ThemePreference =
  UserSettings["theme"];

interface StoredMediaRule {
  rule: CSSMediaRule;
  original: string;
}

const darkRules: StoredMediaRule[] = [];
const knownRules =
  new WeakSet<CSSMediaRule>();

function scanRules(
  rules: CSSRuleList
) {
  for (
    const rule of Array.from(rules)
  ) {
    if (
      rule instanceof CSSMediaRule &&
      rule.media.mediaText.includes(
        "prefers-color-scheme"
      ) &&
      rule.media.mediaText.includes(
        "dark"
      )
    ) {
      if (!knownRules.has(rule)) {
        knownRules.add(rule);

        darkRules.push({
          rule,
          original:
            rule.media.mediaText,
        });
      }
    }

    const nested =
      "cssRules" in rule
        ? (rule as CSSRule & {
            cssRules?: CSSRuleList;
          }).cssRules
        : undefined;

    if (nested) {
      scanRules(nested);
    }
  }
}

function collectDarkRules() {
  for (
    const sheet of
      Array.from(
        document.styleSheets
      )
  ) {
    try {
      scanRules(sheet.cssRules);
    } catch {
      // Harici stylesheet ise gec.
    }
  }
}

function setMediaMode(
  theme: ThemePreference
) {
  collectDarkRules();

  for (
    const item of darkRules
  ) {
    if (theme === "dark") {
      item.rule.media.mediaText =
        "all";

      continue;
    }

    if (theme === "light") {
      item.rule.media.mediaText =
        "not all";

      continue;
    }

    item.rule.media.mediaText =
      item.original;
  }
}

export function applyTheme(
  theme: ThemePreference
) {
  if (
    typeof document ===
    "undefined"
  ) {
    return;
  }

  const html =
    document.documentElement;

  html.dataset.themeMode =
    theme;

  const systemDark =
    window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

  const dark =
    theme === "dark" ||
    (
      theme === "system" &&
      systemDark
    );

  html.dataset.theme =
    dark
      ? "dark"
      : "light";

  html.classList.toggle(
    "dark",
    dark
  );

  setMediaMode(theme);

  requestAnimationFrame(
    () => setMediaMode(theme)
  );

  window.setTimeout(
    () => setMediaMode(theme),
    100
  );
}