interface Props {
  label: string;
  value: string;

  max: number;

  onChange:
    (value: string) => void;
}

export function StudyTaskNumberField({
  label,
  value,
  max,
  onChange,
}: Props) {
  return (
    <label className="space-y-1">
      <span className="text-[10px] text-slate-400">
        {label}
      </span>

      <input
        type="number"
        min={0}
        max={max}
        step={1}
        inputMode="numeric"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-lg border border-slate-200 bg-transparent px-2 py-2 text-sm outline-none dark:border-slate-700"
      />
    </label>
  );
}