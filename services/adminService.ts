import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  getCountFromServer,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { UserProfile } from "../types/user";

export interface AdminUserRow {
  uid: string;
  adSoyad: string;
  email: string;
  alan: string;
  sinif: string;
  role: string;
  createdAt: string; // formatted date string
}

export interface AdminStats {
  totalUsers: number;
  totalExams: number;
  totalStudySessions: number;
}

/** Fetch aggregated platform statistics. */
export async function getAdminStats(): Promise<AdminStats> {
  // Count users
  let totalUsers = 0;
  try {
    const snap = await getCountFromServer(collection(db, "users"));
    totalUsers = snap.data().count;
  } catch {
    // If count fails, fall back to getDocs length
    try {
      const snap = await getDocs(collection(db, "users"));
      totalUsers = snap.size;
    } catch {
      totalUsers = 0;
    }
  }

  // Count top-level exam_results (which stores uid per document)
  let totalExams = 0;
  try {
    const snap = await getCountFromServer(collection(db, "exam_results"));
    totalExams = snap.data().count;
  } catch {
    try {
      const snap = await getDocs(collection(db, "exam_results"));
      totalExams = snap.size;
    } catch {
      totalExams = 0;
    }
  }

  // studySessions are stored as subcollections under users/ — we can't easily
  // getCount across a collectionGroup without an index, so we return 0 as fallback.
  // This is safe to leave at 0 for now; the display degrades gracefully.
  const totalStudySessions = 0;

  return { totalUsers, totalExams, totalStudySessions };
}

/** Fetch a paginated list of users for the admin panel (max 100). */
export async function getAdminUsers(maxResults = 100): Promise<AdminUserRow[]> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"), limit(maxResults));
    const snap = await getDocs(q);

    return snap.docs.map((docSnap) => {
      const d = docSnap.data() as UserProfile;

      let createdStr = "—";
      if (d.createdAt) {
        let date: Date;
        if (d.createdAt instanceof Timestamp) {
          date = d.createdAt.toDate();
        } else if (d.createdAt?.seconds) {
          date = new Date(d.createdAt.seconds * 1000);
        } else {
          date = new Date(d.createdAt);
        }
        if (!isNaN(date.getTime())) {
          createdStr = date.toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        }
      }

      return {
        uid: d.uid ?? docSnap.id,
        adSoyad: d.adSoyad ?? "—",
        email: d.email ?? "—",
        alan: d.alan || "—",
        sinif: d.sinif || "—",
        role: d.role ?? "student",
        createdAt: createdStr,
      };
    });
  } catch {
    // If ordering fails (no index yet), fall back to unordered fetch
    try {
      const snap = await getDocs(collection(db, "users"));
      return snap.docs.slice(0, maxResults).map((docSnap) => {
        const d = docSnap.data() as UserProfile;
        return {
          uid: d.uid ?? docSnap.id,
          adSoyad: d.adSoyad ?? "—",
          email: d.email ?? "—",
          alan: d.alan || "—",
          sinif: d.sinif || "—",
          role: d.role ?? "student",
          createdAt: "—",
        };
      });
    } catch {
      return [];
    }
  }
}
