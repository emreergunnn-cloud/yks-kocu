import { AppLauncher } from "@capacitor/app-launcher";
import { Capacitor } from "@capacitor/core";

export async function openExternalUrl(
  url: string
): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

    return;
  }

  const result =
    await AppLauncher.openUrl({
      url,
    });

  if (!result.completed) {
    throw new Error(
      "Harici bağlantı açılamadı."
    );
  }
}