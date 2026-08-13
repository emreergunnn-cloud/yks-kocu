"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import {
  auth,
  provider,
  db,
} from "../lib/firebase";

import { UserProfile } from "../types/user";
import { logToServer } from "@/services/logService";

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;

  signInWithGoogle: () => Promise<boolean>;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<void>;

  registerWithEmail: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;

  sendPasswordReset: (
    email: string
  ) => Promise<void>;

  logout: () => Promise<void>;

  refreshUserProfile: () => Promise<void>;

  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
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

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  // ---------------------------------------------------------
  // Kullanıcı profilini Firestore'dan getir
  // ---------------------------------------------------------

  const fetchUserProfile = async (uid: string) => {
    logToServer('info', "[AuthContext] Starting fetchUserProfile", { uid });
    try {
      const snap = await getDoc(
        doc(db, "users", uid)
      );

      if (snap.exists()) {
        logToServer('info', "[AuthContext] User profile found in Firestore.");
        setUserProfile(
          snap.data() as UserProfile
        );
      } else {
        logToServer('warn', "[AuthContext] User profile NOT found in Firestore", { uid });
        setUserProfile(null);
      }
    } catch (error) {
      logToServer('error', "[AuthContext] FATAL: User profile fetch error", { error });
      setUserProfile(null);
    }
  };

  // ---------------------------------------------------------
  // Profil yenile
  // ---------------------------------------------------------

  const refreshUserProfile = async () => {
    if (user?.uid) {
      await fetchUserProfile(user.uid);
    }
  };

  // ---------------------------------------------------------
  // Firebase ID Token
  // API isteklerinde kullanılacak
  // ---------------------------------------------------------

  const getIdToken = async (): Promise<
    string | null
  > => {
    try {
      if (!user) {
        return null;
      }

      return await user.getIdToken();
    } catch (error) {
      console.error(
        "Firebase ID token error:",
        error
      );

      return null;
    }
  };

  // ---------------------------------------------------------
  // Auth state
  // ---------------------------------------------------------

  useEffect(() => {
    logToServer('info', "[AuthContext] useEffect for onAuthStateChanged mounted.");
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        logToServer('info', "[AuthContext] onAuthStateChanged triggered", { uid: currentUser?.uid || 'null' });
        setUser(currentUser);

        if (currentUser) {
          await fetchUserProfile(
            currentUser.uid
          );
        } else {
          logToServer('info', "[AuthContext] No currentUser, setting profile to null.");
          setUserProfile(null);
        }

        logToServer('info', "[AuthContext] Setting loading to false.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ---------------------------------------------------------
  // Google Login
  // ---------------------------------------------------------

  const signInWithGoogle = async (): Promise<boolean> => {
  setLoading(true);

  try {
    const result = await signInWithPopup(
      auth,
      provider
    );

    const googleUser = result.user;

    setUser(googleUser);

    const userRef = doc(
      db,
      "users",
      googleUser.uid
    );

    const userSnap = await getDoc(userRef);

    // Google ile ilk kez giriş yapan kullanıcı
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: googleUser.uid,

        adSoyad:
          googleUser.displayName || "",

        email:
          googleUser.email || "",

        role: "student",

        onboardingCompleted: false,

        sinif: "",
        alan: "",

        hedefUniversite: "",
        hedefBolum: "",
        hedefSiralama: 0,

        diplomaNotu: 0,
        obp: 0,

        currentTYT: 0,
        currentAYT: 0,

        targetTYT: 0,
        targetAYT: 0,

        studyDays: 0,
        studyHours: 0,

        examYear:
          new Date().getFullYear() + 1,

        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await fetchUserProfile(
        googleUser.uid
      );

      // İlk Google kaydı → onboarding
      return true;
    }

    // Mevcut kullanıcının profilini al
    const profile =
      userSnap.data() as UserProfile;

    setUserProfile(profile);

    // Profil var ama onboarding tamamlanmamış
    if (
      profile.onboardingCompleted !== true
    ) {
      return true;
    }

    // Onboarding tamamlanmış
    return false;
  } finally {
    setLoading(false);
  }
};

  // ---------------------------------------------------------
  // Email Login
  // ---------------------------------------------------------

  const signInWithEmail = async (
    email: string,
    password: string
  ) => {
    setLoading(true);

    try {
      const result =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      setUser(result.user);

      await fetchUserProfile(
        result.user.uid
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Email Register
  // ---------------------------------------------------------

  const registerWithEmail = async (
    name: string,
    email: string,
    password: string
  ) => {
    setLoading(true);

    try {
      const result =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      await updateProfile(result.user, {
        displayName: name,
      });

      await setDoc(
        doc(db, "users", result.user.uid),
        {
          uid: result.user.uid,

          adSoyad: name,
          email: email,

          role: "student",

          onboardingCompleted: false,

          sinif: "",
          alan: "",

          hedefUniversite: "",
          hedefBolum: "",
          hedefSiralama: 0,

          diplomaNotu: 0,
          obp: 0,

          currentTYT: 0,
          currentAYT: 0,

          targetTYT: 0,
          targetAYT: 0,

          studyDays: 0,
          studyHours: 0,

          examYear:
            new Date().getFullYear() + 1,

          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );

      setUser(result.user);

      await fetchUserProfile(
        result.user.uid
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Şifre sıfırlama
  // ---------------------------------------------------------

  const sendPasswordReset = async (
    email: string
  ) => {
    await sendPasswordResetEmail(
      auth,
      email
    );
  };

  // ---------------------------------------------------------
  // Logout
  // ---------------------------------------------------------

  const logout = async () => {
    await signOut(auth);

    setUser(null);
    setUserProfile(null);
  };

  // ---------------------------------------------------------
  // Provider
  // ---------------------------------------------------------

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,

        signInWithGoogle,
        signInWithEmail,
        registerWithEmail,

        sendPasswordReset,

        logout,

        refreshUserProfile,

        getIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ---------------------------------------------------------
// Hook
// ---------------------------------------------------------

export const useAuth = () =>
  useContext(AuthContext);