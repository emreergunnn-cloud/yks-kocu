import {
  Check,
  Save,
  Settings,
} from "lucide-react";

interface Props {
  saving: boolean;
  saved: boolean;
  error: string;

  onSave: () => void;
}

export function SettingsHeader({
  saving,
  saved,
  error,
  onSave,
}: Props) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <Settings className="h-5 w-5 text-blue-600" />

            Ayarlar
          </h1>

          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Uygulama tercihlerinizi yönetin
          </p>
        </div>

        <button
          type="button"
          onClick={
            onSave
          }
          disabled={
            saving
          }
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Kaydedildi
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />

              {saving
                ? "Kaydediliyor..."
                : "Kaydet"}
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
