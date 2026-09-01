import { signOut, type User as FirebaseUser } from "firebase/auth";
import { auth } from "../../lib/firebase";

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function getIdToken(
  user: FirebaseUser | null
): Promise<string | null> {
  return user ? user.getIdToken() : null;
}
