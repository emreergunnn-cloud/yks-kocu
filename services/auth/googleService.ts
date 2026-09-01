import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../lib/firebase";
import { ensureStudentProfile } from "./profileService";
import type { AuthResult } from "./types";

export async function signInWithGoogle(): Promise<AuthResult> {
  const result = await signInWithPopup(auth, provider);
  const firebaseUser = result.user;
  const { profile, isNewUser } = await ensureStudentProfile(firebaseUser);

  return {
    user: firebaseUser,
    profile,
    isNewUser,
  };
}
