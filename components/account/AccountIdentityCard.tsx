import { CheckCircle2, Mail } from "lucide-react";
import type { User } from "firebase/auth";
import {
  hasGoogleProvider,
  hasPasswordProvider,
} from "@/services/auth/passwordService";

interface Props {
  user: User;
}

function MethodBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">
      <CheckCircle2 className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

export function AccountIdentityCard({ user }: Props) {
  const googleEnabled = hasGoogleProvider(user);
  const passwordEnabled = hasPasswordProvider(user);

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300">
          Hesap Bilgileri
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Hesabınıza bağlı e-posta ve giriş yöntemleri.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
        <Mail className="h-4 w-4 shrink-0 text-slate-400" />
        <div className="min-w-0">
          <p className="text-xs text-slate-500">E-posta</p>
          <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
            {user.email ?? "E-posta bulunamadı"}
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-slate-500">Giriş yöntemleri</p>
        <div className="flex flex-wrap gap-2">
          {googleEnabled && <MethodBadge label="Google" />}
          {passwordEnabled && <MethodBadge label="E-posta ve Şifre" />}
        </div>
      </div>
    </section>
  );
}
