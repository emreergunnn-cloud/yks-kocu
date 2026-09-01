import type { ReactNode } from "react";
export type TabType = "daily" | "weekly" | "monthly";
export interface GoalItemData { id: string; title: string; current: number; target: number; unit: string; icon: ReactNode; color: string; }
