import {
  Search,
} from "lucide-react";

import {
  TOPIC_STATUSES,
  type StatusFilter,
  type SubjectTab,
} from "./constants";

interface Props {
  search: string;
  tab: SubjectTab;

  status:
    StatusFilter;

  onSearch:
    (value: string) =>
      void;

  onTab:
    (
      value:
        SubjectTab
    ) => void;

  onStatus:
    (
      value:
        StatusFilter
    ) => void;
}

export function SubjectsFilters({
  search,
  tab,
  status,
  onSearch,
  onTab,
  onStatus,
}: Props) {
  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Ders veya konu ara..."
            value={search}
            onChange={(
              event
            ) =>
              onSearch(
                event
                  .target
                  .value
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <div className="flex gap-2">
          {(
            [
              "all",
              "TYT",
              "AYT",
            ] as SubjectTab[]
          ).map(
            (value) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  onTab(
                    value
                  )
                }
                className={`rounded-xl px-3 py-2 text-sm font-medium ${
                  tab ===
                  value
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                }`}
              >
                {value ===
                "all"
                  ? "Tümü"
                  : value}
              </button>
            )
          )}
        </div>

        <select
          value={status}
          onChange={(
            event
          ) =>
            onStatus(
              event
                .target
                .value as StatusFilter
            )
          }
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="all">
            Tüm Durumlar
          </option>

          {TOPIC_STATUSES.map(
            (value) => (
              <option
                key={value}
                value={value}
              >
                {value}
              </option>
            )
          )}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {TOPIC_STATUSES.map(
          (value) => (
            <span
              key={value}
              className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 dark:border-slate-700"
            >
              {value}
            </span>
          )
        )}

        <span className="self-center text-xs text-slate-400">
          Tıkla → durum değiştir
        </span>
      </div>
    </>
  );
}
