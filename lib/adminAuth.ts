import { NextRequest } from "next/server";
import { adminAuth, adminDb } from "./firebaseAdmin";

type FirebaseUserData = {
  uid: string;
  email?: string;
  displayName?: string;
  role?: string;
  [key: string]: unknown;
  isSuperAdmin: boolean;
};

type AuthResult =
  | {
      success: true;
      uid: string;
      user: FirebaseUserData;
    }
  | {
      success: false;
      error: string;
      status: number;
    };

export async function requireAdmin(
  request: NextRequest
): Promise<AuthResult> {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization) {
      return {
        success: false,
        error: "Yetkilendirme bilgisi bulunamadı.",
        status: 401,
      };
    }

    if (!authorization.startsWith("Bearer ")) {
      return {
        success: false,
        error: "Geçersiz yetkilendirme formatı.",
        status: 401,
      };
    }

    const token = authorization.substring(7);

    if (!token) {
      return {
        success: false,
        error: "Token bulunamadı.",
        status: 401,
      };
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const userDoc = await adminDb.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return {
        success: false,
        error: "Kullanıcı kaydı bulunamadı.",
        status: 403,
      };
    }

    const userData = userDoc.data() ?? {};

    const role = String(
      userData.role ?? ""
    ).toLowerCase();

    const isSuperAdmin = role === "superadmin" || role === "super_admin" || role === "baş admin";
    const adminRoles = ["admin", "superadmin", "super_admin", "baş admin"];

    if (!adminRoles.includes(role)) {
      return {
        success: false,
        error: "Bu işlem için admin yetkisi gerekiyor.",
        status: 403,
      };
    }

    return {
      success: true,
      uid,
      user: {
        uid,
        email: decodedToken.email,
        displayName: decodedToken.name,
        role,
        isSuperAdmin,
        ...userData,
      },
    };
  } catch (error) {
    console.error("requireAdmin error:", error);

    return {
      success: false,
      error: "Yetkilendirme başarısız.",
      status: 401,
    };
  }
}