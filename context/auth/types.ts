import type { User as FirebaseUser } from "firebase/auth";
import type { UserProfile } from "../../types/user";

export interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<boolean>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}
