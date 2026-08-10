import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { UserProfile } from "../types/user";

export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
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

export async function saveUserProfile(
  profile: Partial<UserProfile> & { uid: string }
): Promise<void> {
  try {
    const ref = doc(db, "users", profile.uid);
    const existing = await getDoc(ref);

    // ----------------------------------------------------------
    // YENİ PROFİL
    // ----------------------------------------------------------
    if (!existing.exists()) {
      const newProfile = {
        ...profile,

        // Client tarafından role gönderilse bile
        // yeni kullanıcı her zaman student olur.
        role: "student" as const,

        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(ref, newProfile);
      return;
    }

    // ----------------------------------------------------------
    // MEVCUT PROFİL
    // ----------------------------------------------------------

    const existingData = existing.data() as UserProfile;

    // Kullanıcının değiştirmesine izin verilmeyen alanları
    // profile nesnesinden çıkarıyoruz.
    const {
      uid: _uid,
      role: _role,
      createdAt: _createdAt,
      ...safeProfile
    } = profile;

    await updateDoc(ref, {
      ...safeProfile,

      // UID ve role mevcut Firestore değerlerinden korunur.
      uid: existingData.uid,
      role: existingData.role ?? "student",

      // createdAt hiçbir zaman değişmez.
      createdAt: existingData.createdAt,

      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("saveUserProfile error:", error);
    throw error;
  }
}