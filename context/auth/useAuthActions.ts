import type { Dispatch, SetStateAction } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import {
  AuthError,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { auth } from "../../lib/firebase";
import type { UserProfile } from "../../types/user";
import { logToServer } from "@/services/logService";
import { authenticateWithGoogle } from "./google";
import {
  createAuthUserProfile,
  fetchAuthUserProfile,
  loadOrCreateAuthUserProfile,
} from "./profile";

interface StateSetters {
  user: FirebaseUser | null;
  setUser: Dispatch<SetStateAction<FirebaseUser | null>>;
  setUserProfile: Dispatch<SetStateAction<UserProfile | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export function useAuthActions({
  user,
  setUser,
  setUserProfile,
  setLoading,
}: StateSetters) {
  const signInWithGoogle = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const firebaseUser = await authenticateWithGoogle();
      setUser(firebaseUser);
      const result = await loadOrCreateAuthUserProfile(firebaseUser);
      setUserProfile(result.profile);
      return !result.profile.onboardingCompleted;
    } catch (error) {
      const authError = error as AuthError;
      logToServer("error", "[AuthContext] Google sign-in error", {
        code: authError.code,
        message: authError.message,
      });
      console.error("[AuthContext] Google sign-in error:", error);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      const profile = await fetchAuthUserProfile(result.user.uid);

      if (profile) {
        setUserProfile(profile);
      } else {
        setUserProfile(await createAuthUserProfile(result.user));
      }
    } catch (error) {
      const authError = error as AuthError;
      logToServer("error", "[AuthContext] Email sign-in error", {
        code: authError.code,
        message: authError.message,
        email,
      });
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (
    name: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      const profile = await createAuthUserProfile(result.user, name);
      setUser(result.user);
      setUserProfile(profile);
    } catch (error) {
      const authError = error as AuthError;
      logToServer("error", "[AuthContext] Email registration error", {
        code: authError.code,
        message: authError.message,
        email,
      });
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
  try {
    auth.languageCode = "tr";
    await sendPasswordResetEmail(auth, email);
    } catch (error) {
      const authError = error as AuthError;
      logToServer("error", "[AuthContext] Password reset error", {
        code: authError.code,
        message: authError.message,
        email,
      });
      throw authError;
    }
  };

  const logout = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await FirebaseAuthentication.signOut();
      }
    } catch (error) {
      console.warn("[AuthContext] Native sign out warning:", error);
    }

    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const refreshUserProfile = async () => {
    if (!user?.uid) return;
    setUserProfile(await fetchAuthUserProfile(user.uid));
  };

  const getIdToken = async (): Promise<string | null> => {
    try {
      return user ? await user.getIdToken(true) : null;
    } catch (error) {
      logToServer("error", "[AuthContext] getIdToken error", { error });
      return null;
    }
  };

  return {
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    sendPasswordReset,
    logout,
    refreshUserProfile,
    getIdToken,
  };
}
