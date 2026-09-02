import { BookOpen } from "lucide-react";

export function ResetPasswordHeader() {
  return (
    <div className="space-y-3 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/30">
        <BookOpen className="h-8 w-8" />
      </div>
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          YKS Koçu
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Yeni şifrenizi belirleyin
        </p>
      </div>
    </div>
  );
}
