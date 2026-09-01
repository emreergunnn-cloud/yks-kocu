import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, provider } from "../../lib/firebase";
import { logToServer } from "@/services/logService";

async function signInNative(): Promise<FirebaseUser> {
  logToServer("info", "[AuthContext] Starting native Google sign-in");

  const result = await FirebaseAuthentication.signInWithGoogle();

  if (!result.credential?.idToken) {
    throw new Error("Google girişinden Firebase ID token alınamadı.");
  }

  const credential = GoogleAuthProvider.credential(result.credential.idToken);
  const firebaseResult = await signInWithCredential(auth, credential);
  return firebaseResult.user;
}

async function signInWeb(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function authenticateWithGoogle(): Promise<FirebaseUser> {
  return Capacitor.isNativePlatform() ? signInNative() : signInWeb();
}
