import { createContext } from "react";
import type { PremiumContextType } from "./types";

export const PremiumContext = createContext<PremiumContextType | null>(null);
