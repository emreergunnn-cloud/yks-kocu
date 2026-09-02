import { Eye, EyeOff, LockKeyhole } from "lucide-react";

interface Props {
  email: string;
  password: string;
  confirm: string;
  showPassword: boolean;
  saving: boolean;
  error: string;
  onPasswordChange: (value: string) => void;
  onConfirmChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

function PasswordField({
  value,
  placeholder,
  showPassword,
  onChange,
  onToggle,
}: {
  value: string;
  placeholder: string;
  showPassword: boolean;
  onChange: (value: string) => void;
  onToggle?: () => void;
}) {
  return (
    <div className="relative">
      <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type={showPassword ? "text" : "password"}
        minLength={6}
        required
        value={value}
        placeholder={placeholder}
        autoComplete="new-password"
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
      />
      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}

export function ResetPasswordForm(props: Props) {
  return (
    <form onSubmit={props.onSubmit} className="space-y-4">
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200">
        <span className="font-semibold">{props.email}</span> hesabı için yeni bir şifre belirleyin.
      </div>

      <PasswordField
        value={props.password}
        placeholder="Yeni şifre"
        showPassword={props.showPassword}
        onChange={props.onPasswordChange}
        onToggle={props.onTogglePassword}
      />
      <PasswordField
        value={props.confirm}
        placeholder="Yeni şifre tekrar"
        showPassword={props.showPassword}
        onChange={props.onConfirmChange}
      />

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Şifreniz en az 6 karakter olmalıdır.
      </p>

      {props.error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-600 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-400">
          {props.error}
        </p>
      )}

      <button
        type="submit"
        disabled={props.saving}
        className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
      >
        {props.saving ? "Şifre güncelleniyor…" : "Yeni Şifreyi Kaydet"}
      </button>
    </form>
  );
}
