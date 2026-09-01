import { BookOpen } from "lucide-react";
import type { AuthMode } from "./types";

export function AuthHeader({ mode }: { mode: AuthMode }) {
  return (
    <div className="text-center space-y-3">
      <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-blue-500/30">
        <BookOpen className="w-8 h-8" />
      </div>
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          YKS Koçu
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {mode === "login" && "Hesabınıza giriş yapın"}
          {mode === "register" && "Yeni hesap oluşturun"}
          {mode === "forgot" && "Şifrenizi sıfırlayın"}
        </p>
      </div>
    </div>
  );
}
