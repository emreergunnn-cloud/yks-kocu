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
  AuthError,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

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

  const fetchUserProfile = async (uid: string): Promise<boolean> => {
    try {
      logToServer(
        "info",
        "[AuthContext] Starting fetchUserProfile",
        { uid }
      );

      const snap = await getDoc(
        doc(db, "users", uid)
      );

      if (snap.exists()) {
        setUserProfile(
          snap.data() as UserProfile
        );
        return true;
      }

      setUserProfile(null);
      return false;
    } catch (error) {
      logToServer(
        "error",
        "[AuthContext] User profile fetch error",
        { error }
      );
      setUserProfile(null);
      throw error;
    }
  };

  const refreshUserProfile = async () => {
    if (user?.uid) {
      await fetchUserProfile(user.uid);
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    try {
      if (!user) {
        return null;
      }

      return await user.getIdToken(true);
    } catch (error) {
      logToServer(
        "error",
        "[AuthContext] getIdToken error",
        { error }
      );
      return null;
    }
  };

  const createNewUserProfile = async (
    firebaseUser: FirebaseUser
  ) => {
    const newUserProfile: UserProfile = {
      uid: firebaseUser.uid,
      adSoyad:
        firebaseUser.displayName ||
        "Yeni Kullanıcı",
      email: firebaseUser.email || "",
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
    };

    await setDoc(
      doc(
        db,
        "users",
        firebaseUser.uid
      ),
      newUserProfile
    );

    setUserProfile(newUserProfile);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        setLoading(true);

        if (firebaseUser) {
          logToServer(
            "info",
            "[AuthContext] Firebase user logged in",
            {
              uid: firebaseUser.uid,
            }
          );

          setUser(firebaseUser);

          try {
            const profileExists =
              await fetchUserProfile(
                firebaseUser.uid
              );

            if (!profileExists) {
              await createNewUserProfile(
                firebaseUser
              );
            }
          } catch (error) {
            logToServer(
              "error",
              "[AuthContext] Profile loading failed",
              { error }
            );
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signInWithGoogle =
    async (): Promise<boolean> => {
      setLoading(true);

      try {
        /*
         * ANDROID / CAPACITOR
         * Native Google Sign-In
         */
        if (Capacitor.isNativePlatform()) {
          logToServer(
            "info",
            "[AuthContext] Starting native Google sign-in"
          );

          const result =
            await FirebaseAuthentication.signInWithGoogle();

          if (!result.credential?.idToken) {
            throw new Error(
              "Google girişinden Firebase ID token alınamadı."
            );
          }

          /*
           * Native plugin Firebase Authentication
           * oturumunu Firebase Web SDK ile senkronize etmek
           * için credential bilgisini kullanıyoruz.
           */
          const {
            GoogleAuthProvider,
            signInWithCredential,
          } = await import(
            "firebase/auth"
          );

          const credential =
            GoogleAuthProvider.credential(
              result.credential.idToken
            );

          const firebaseResult =
            await signInWithCredential(
              auth,
              credential
            );

          setUser(firebaseResult.user);

          const profileExists =
            await fetchUserProfile(
              firebaseResult.user.uid
            );

          if (!profileExists) {
            await createNewUserProfile(
              firebaseResult.user
            );

            return true;
          }

          return false;
        }

        /*
         * WEB
         * Mevcut çalışan Google Popup sistemi
         */
        const result =
          await signInWithPopup(
            auth,
            provider
          );

        setUser(result.user);

        const profileExists =
          await fetchUserProfile(
            result.user.uid
          );

        if (!profileExists) {
          await createNewUserProfile(
            result.user
          );

          return true;
        }

        return false;
      } catch (error) {
        const authError =
          error as AuthError;

        logToServer(
          "error",
          "[AuthContext] Google sign-in error",
          {
            code: authError.code,
            message: authError.message,
          }
        );

        console.error(
          "[AuthContext] Google sign-in error:",
          error
        );

        throw authError;
      } finally {
        setLoading(false);
      }
    };

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

      const profileExists =
        await fetchUserProfile(
          result.user.uid
        );

      if (!profileExists) {
        await createNewUserProfile(
          result.user
        );
      }
    } catch (error) {
      const authError =
        error as AuthError;

      logToServer(
        "error",
        "[AuthContext] Email sign-in error",
        {
          code: authError.code,
          message: authError.message,
          email,
        }
      );

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
      const result =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      await updateProfile(
        result.user,
        {
          displayName: name,
        }
      );

      const newUser =
        result.user;

      const newUserProfileData:
        UserProfile = {
        uid: newUser.uid,
        adSoyad: name,
        email,
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
      };

      await setDoc(
        doc(
          db,
          "users",
          newUser.uid
        ),
        newUserProfileData
      );

      setUser(newUser);
      setUserProfile(
        newUserProfileData
      );
    } catch (error) {
      const authError =
        error as AuthError;

      logToServer(
        "error",
        "[AuthContext] Email registration error",
        {
          code: authError.code,
          message: authError.message,
          email,
        }
      );

      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (
    email: string
  ) => {
    try {
      await sendPasswordResetEmail(
        auth,
        email
      );
    } catch (error) {
      const authError =
        error as AuthError;

      logToServer(
        "error",
        "[AuthContext] Password reset error",
        {
          code: authError.code,
          message: authError.message,
          email,
        }
      );

      throw authError;
    }
  };

  const logout = async () => {
    try {
      if (
        Capacitor.isNativePlatform()
      ) {
        await FirebaseAuthentication.signOut();
      }
    } catch (error) {
      console.warn(
        "[AuthContext] Native sign out warning:",
        error
      );
    }

    await signOut(auth);

    setUser(null);
    setUserProfile(null);
  };

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

export const useAuth = () =>
  useContext(AuthContext);