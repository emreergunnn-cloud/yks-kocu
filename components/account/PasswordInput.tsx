import { Eye, EyeOff } from "lucide-react";

interface Props {
  value: string;
  placeholder: string;
  show: boolean;
  onChange: (value: string) => void;
  onToggle?: () => void;
}

export function PasswordInput(props: Props) {
  return (
    <div className="relative">
      <input
        type={props.show ? "text" : "password"}
        minLength={6}
        required
        value={props.value}
        placeholder={props.placeholder}
        onChange={(event) => props.onChange(event.target.value)}
        autoComplete="new-password"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-slate-950"
      />
      {props.onToggle && (
        <button
          type="button"
          onClick={props.onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          aria-label={props.show ? "Şifreyi gizle" : "Şifreyi göster"}
        >
          {props.show ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
}
