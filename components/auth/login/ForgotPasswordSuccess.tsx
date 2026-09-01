import { CheckCircle2, RotateCcw } from "lucide-react";

interface Props {
  email: string;
  onBack: () => void;
}

export function ForgotPasswordSuccess({ email, onBack }: Props) {
  return (
    <div className="text-center space-y-4 py-2">
      <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">
          E-posta gönderildi
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          <strong>{email}</strong> adresine şifre sıfırlama bağlantısı gönderildi.
          Gelen kutunuzu ve spam klasörünüzü kontrol edin.
        </p>
      </div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
      >
        <RotateCcw className="w-3.5 h-3.5" /> Giriş sayfasına dön
      </button>
    </div>
  );
}
