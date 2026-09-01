import { createContext } from "react";
import type { AuthContextType } from "./types";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signInWithGoogle: async () => false,
  signInWithEmail: async () => {},
  registerWithEmail: async () => {},
  sendPasswordReset: async () => {},
  logout: async () => {},
  refreshUserProfile: async () => {},
  getIdToken: async () => null,
});
