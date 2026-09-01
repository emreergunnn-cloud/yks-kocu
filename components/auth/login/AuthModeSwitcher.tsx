import { RotateCcw } from "lucide-react";
import type { AuthMode } from "./types";

interface Props {
  mode: AuthMode;
  onSwitch: (mode: AuthMode) => void;
}

export function AuthModeSwitcher({ mode, onSwitch }: Props) {
  return (
    <div className="space-y-2 text-center text-xs">
      {mode === "login" && (
        <p className="text-slate-500">
          Hesabın yok mu?{" "}
          <button
            onClick={() => onSwitch("register")}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Kayıt Ol
          </button>
        </p>
      )}

      {mode === "register" && (
        <p className="text-slate-500">
          Zaten hesabın var mı?{" "}
          <button
            onClick={() => onSwitch("login")}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Giriş Yap
          </button>
        </p>
      )}

      {mode === "forgot" && (
        <button
          onClick={() => onSwitch("login")}
          className="flex items-center justify-center gap-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 w-full"
        >
          <RotateCcw className="w-3 h-3" /> Giriş sayfasına dön
        </button>
      )}
    </div>
  );
}
