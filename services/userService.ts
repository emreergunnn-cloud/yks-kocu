import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { UserProfile } from "../types/user";

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("getUserProfile error:", error);
    throw error;
  }
}

export async function saveUserProfile(profile: Partial<UserProfile> & { uid: string }): Promise<void> {
  try {
    const ref = doc(db, "users", profile.uid);
    const existing = await getDoc(ref);
    if (existing.exists()) {
      await updateDoc(ref, {
        ...profile,
        updatedAt: new Date(),
      });
    } else {
      await setDoc(ref, {
        ...profile,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("saveUserProfile error:", error);
    throw error;
  }
}
