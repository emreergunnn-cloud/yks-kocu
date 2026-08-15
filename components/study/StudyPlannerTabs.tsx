import type {
  ReactNode,
} from "react";

import {
  BarChart2,
  Calendar,
} from "lucide-react";

export type StudyPlannerTab =
  | "today"
  | "subjects";

interface Props {
  activeTab: StudyPlannerTab;

  onChange:
    (tab: StudyPlannerTab) => void;
}

export function StudyPlannerTabs({
  activeTab,
  onChange,
}: Props) {
  return (
    <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
      <TabButton
        active={
          activeTab === "today"
        }
        onClick={() =>
          onChange("today")
        }
        icon={
          <Calendar className="w-4 h-4" />
        }
        label="Bugünkü Plan"
      />

      <TabButton
        active={
          activeTab === "subjects"
        }
        onClick={() =>
          onChange("subjects")
        }
        icon={
          <BarChart2 className="w-4 h-4" />
        }
        label="Ders Durumu"
      />
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold ${
        active
          ? "bg-white dark:bg-slate-700 shadow-sm"
          : "text-slate-500"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}