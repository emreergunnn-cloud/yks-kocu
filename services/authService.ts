"use client";

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  User as FirebaseUser,
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

/**
 * Firebase Authentication + Firestore kullanıcı işlemleri.
 *
 * Bu dosyanın görevi:
 * - Google giriş/kayıt
 * - Email giriş
 * - Email kayıt
 * - Şifre sıfırlama
 * - Çıkış
 * - Kullanıcı profilini Firestore'dan getirme
 *
 * UI ve yönlendirme burada yapılmaz.
 */

export interface AuthResult {
  user: FirebaseUser;
  profile: UserProfile | null;
  isNewUser: boolean;
}

/**
 * Firestore'daki kullanıcı profilini getirir.
 */
export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  const snapshot = await getDoc(
    doc(db, "users", uid)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
}

/**
 * Yeni öğrenci profili oluşturur.
 */
export async function createStudentProfile(
  user: FirebaseUser,
  name?: string
): Promise<UserProfile> {
  const displayName =
    name?.trim() ||
    user.displayName ||
    "";

  const profile: UserProfile = {
    uid: user.uid,

    adSoyad: displayName,
    email: user.email || "",

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
    doc(db, "users", user.uid),
    profile
  );

  return profile;
}

/**
 * Google ile giriş/kayıt.
 *
 * Kullanıcının Firestore profili yoksa
 * yeni öğrenci profili oluşturulur.
 */
export async function signInWithGoogle(): Promise<AuthResult> {
  const result = await signInWithPopup(
    auth,
    provider
  );

  const firebaseUser = result.user;

  let profile =
    await getUserProfile(
      firebaseUser.uid
    );

  let isNewUser = false;

  if (!profile) {
    profile =
      await createStudentProfile(
        firebaseUser
      );

    isNewUser = true;
  }

  return {
    user: firebaseUser,
    profile,
    isNewUser,
  };
}

/**
 * Email + şifre ile giriş.
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  const result =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  const firebaseUser = result.user;

  const profile =
    await getUserProfile(
      firebaseUser.uid
    );

  return {
    user: firebaseUser,
    profile,
    isNewUser: false,
  };
}

/**
 * Email + şifre ile yeni hesap oluşturur.
 */
export async function registerWithEmail(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  const result =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  const firebaseUser = result.user;

  await updateProfile(
    firebaseUser,
    {
      displayName: name,
    }
  );

  const profile =
    await createStudentProfile(
      firebaseUser,
      name
    );

  return {
    user: firebaseUser,
    profile,
    isNewUser: true,
  };
}

/**
 * Şifre sıfırlama emaili gönderir.
 */
export async function sendPasswordReset(
  email: string
): Promise<void> {
  await sendPasswordResetEmail(
    auth,
    email
  );
}

/**
 * Firebase çıkışı.
 */
export async function logout(): Promise<void> {
  await signOut(auth);
}

/**
 * Firebase ID token getirir.
 */
export async function getIdToken(
  user: FirebaseUser | null
): Promise<string | null> {
  if (!user) {
    return null;
  }

  return user.getIdToken();
}