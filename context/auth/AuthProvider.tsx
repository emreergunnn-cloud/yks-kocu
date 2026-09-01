"use client";

import React, { useEffect, useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import type { UserProfile } from "../../types/user";
import { logToServer } from "@/services/logService";
import { AuthContext } from "./context";
import { loadOrCreateAuthUserProfile } from "./profile";
import { useAuthActions } from "./useAuthActions";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);

      if (!firebaseUser) {
        setUser(null);
        setUserProfile(null);
        setLoading(false);
        return;
      }

      logToServer("info", "[AuthContext] Firebase user logged in", {
        uid: firebaseUser.uid,
      });
      setUser(firebaseUser);

      try {
        const result = await loadOrCreateAuthUserProfile(firebaseUser);
        setUserProfile(result.profile);
      } catch (error) {
        logToServer("error", "[AuthContext] Profile loading failed", {
          error,
        });
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const actions = useAuthActions({
    user,
    setUser,
    setUserProfile,
    setLoading,
  });

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, ...actions }}>
      {children}
    </AuthContext.Provider>
  );
};
