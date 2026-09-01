import type { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, runTransaction } from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { UserProfile } from "../../types/user";

function buildStudentProfile(
  user: FirebaseUser,
  name?: string
): UserProfile {
  return {
    uid: user.uid,
    adSoyad: name?.trim() || user.displayName || "Yeni Kullanıcı",
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
    examYear: new Date().getFullYear() + 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
}

export async function ensureStudentProfile(
  user: FirebaseUser,
  name?: string
): Promise<{ profile: UserProfile; isNewUser: boolean }> {
  const userRef = doc(db, "users", user.uid);
  const preferredName = name?.trim();

  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(userRef);

    if (snapshot.exists()) {
      const existing = snapshot.data() as UserProfile;

      if (
        preferredName &&
        (!existing.adSoyad || existing.adSoyad === "Yeni Kullanıcı")
      ) {
        const updatedAt = new Date();
        transaction.update(userRef, {
          adSoyad: preferredName,
          updatedAt,
        });

        return {
          profile: {
            ...existing,
            adSoyad: preferredName,
            updatedAt,
          },
          isNewUser: false,
        };
      }

      return { profile: existing, isNewUser: false };
    }

    const profile = buildStudentProfile(user, preferredName);
    transaction.set(userRef, profile);
    return { profile, isNewUser: true };
  });
}

export async function createStudentProfile(
  user: FirebaseUser,
  name?: string
): Promise<UserProfile> {
  return (await ensureStudentProfile(user, name)).profile;
}
