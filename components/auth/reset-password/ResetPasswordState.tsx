import Link from "next/link";
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";

export function ResetPasswordLoading() {
  return (
    <div className="space-y-3 py-4 text-center">
      <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-blue-600" />
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Bağlantı doğrulanıyor…
      </p>
    </div>
  );
}

export function ResetPasswordInvalid({ message }: { message: string }) {
  return (
    <div className="space-y-4 py-2 text-center">
      <CircleAlert className="mx-auto h-10 w-10 text-rose-500" />
      <div>
        <h2 className="font-semibold text-slate-900 dark:text-white">
          Bağlantı kullanılamıyor
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message}</p>
      </div>
      <Link
        href="/forgot-password"
        className="inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Yeni bağlantı iste
      </Link>
    </div>
  );
}

export function ResetPasswordSuccess() {
  return (
    <div className="space-y-4 py-2 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
        <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div>
        <h2 className="font-semibold text-slate-900 dark:text-white">
          Şifreniz güncellendi
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Yeni şifrenizle YKS Koçu hesabınıza giriş yapabilirsiniz.
        </p>
      </div>
      <Link
        href="/login"
        className="inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Giriş Yap
      </Link>
    </div>
  );
}
