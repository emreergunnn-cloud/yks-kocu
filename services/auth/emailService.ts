import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import { createStudentProfile, getUserProfile } from "./profileService";
import type { AuthResult } from "./types";

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = result.user;
  const profile = await getUserProfile(firebaseUser.uid);

  return {
    user: firebaseUser,
    profile,
    isNewUser: false,
  };
}

export async function registerWithEmail(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = result.user;

  await updateProfile(firebaseUser, { displayName: name });
  const profile = await createStudentProfile(firebaseUser, name);

  return {
    user: firebaseUser,
    profile,
    isNewUser: true,
  };
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}
