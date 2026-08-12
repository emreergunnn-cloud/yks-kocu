import { auth } from "../lib/firebase";

export interface AdminUserRow {
  uid: string;
  adSoyad: string;
  email: string;
  alan: string;
  sinif: string;
  role: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalExams: number;
  totalStudySessions: number;
}

async function getAdminToken(): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Oturum bulunamadı.");
  }

  return user.getIdToken();
}

async function readResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    throw new Error(
      `Sunucudan boş cevap geldi. HTTP ${response.status}`
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Sunucudan geçersiz cevap geldi. HTTP ${response.status}`
    );
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  const token = await getAdminToken();

  const response = await fetch("/api/admin/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await readResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.error || "İstatistikler alınamadı.");
  }

  return data.stats;
}

export async function getAdminUsers(
  maxResults = 100
): Promise<AdminUserRow[]> {
  const token = await getAdminToken();

  const response = await fetch(
    `/api/admin/users?limit=${maxResults}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const data = await readResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Kullanıcılar alınamadı.");
  }

  return data.users;
}

export async function updateAdminUserRole(
  uid: string,
  role: "student" | "parent" | "coach" | "secretary" | "admin"
): Promise<void> {
  const token = await getAdminToken();

  const response = await fetch(`/api/admin/users/${uid}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  });

  const data = await readResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(
      data.error || "Kullanıcı rolü değiştirilemedi."
    );
  }
}

export async function deleteAdminUser(uid: string): Promise<void> {
  const token = await getAdminToken();

  const response = await fetch(`/api/admin/users/${uid}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await readResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Kullanıcı silinemedi.");
  }
}