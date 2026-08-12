import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "../../../../../lib/firebaseAdmin";
import { requireAdmin } from "../../../../../lib/adminAuth";

type RouteContext = {
  params: Promise<{ uid: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const authResult = await requireAdmin(request);
  if (!authResult.success) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { uid } = await params;

    const userRecord = await adminAuth.getUser(uid);
    const userDoc = await adminDb.collection("users").doc(uid).get();

    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email ?? null,
        displayName: userRecord.displayName ?? null,
        phoneNumber: userRecord.phoneNumber ?? null,
        ...(userDoc.exists ? userDoc.data() : {}),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/users/[uid] error:", error);
    return NextResponse.json(
      { success: false, error: "Kullanıcı bulunamadı." },
      { status: 404 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  const authResult = await requireAdmin(request);
  if (!authResult.success) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

  if (!authResult.user.isSuperAdmin) {
    return NextResponse.json(
      { success: false, error: "Rol değiştirmek için superadmin yetkisi gereklidir." },
      { status: 403 }
    );
  }

  try {
    const { uid } = await params;
    
    if (uid === authResult.uid) {
      return NextResponse.json(
        { success: false, error: "Kendi rolünüzü değiştiremezsiniz." },
        { status: 400 }
      );
    }

    const targetUserDoc = await adminDb.collection("users").doc(uid).get();
    if (!targetUserDoc.exists) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    const targetRole = String(targetUserDoc.data()?.role ?? "").toLowerCase();
    
    if (targetRole === "superadmin" || targetRole === "super_admin") {
      return NextResponse.json(
        { success: false, error: "Superadmin kullanıcıların rolü değiştirilemez." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const newRole = body.role;

    const allowedRoles = ["student", "parent", "coach", "secretary", "admin"];
    if (!allowedRoles.includes(newRole)) {
      return NextResponse.json(
        { success: false, error: "Geçersiz rol. Superadmin atanması engellenmiştir." },
        { status: 400 }
      );
    }

    await adminDb.collection("users").doc(uid).update({
      role: newRole,
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: "Kullanıcı rolü başarıyla güncellendi."
    });
  } catch (error) {
    console.error("PATCH /api/admin/users/[uid] error:", error);
    return NextResponse.json(
      { success: false, error: "Kullanıcı güncellenemedi." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  const authResult = await requireAdmin(request);
  if (!authResult.success) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: authResult.status }
    );
  }

  if (!authResult.user.isSuperAdmin) {
    return NextResponse.json(
      { success: false, error: "Kullanıcı silmek için superadmin yetkisi gereklidir." },
      { status: 403 }
    );
  }

  try {
    const { uid } = await params;

    if (uid === authResult.uid) {
      return NextResponse.json(
        { success: false, error: "Kendi hesabınızı silemezsiniz." },
        { status: 400 }
      );
    }

    const targetUserDoc = await adminDb.collection("users").doc(uid).get();
    if (targetUserDoc.exists) {
      const targetRole = String(targetUserDoc.data()?.role ?? "").toLowerCase();
      if (targetRole === "superadmin" || targetRole === "super_admin") {
        return NextResponse.json(
          { success: false, error: "Superadmin kullanıcılar silinemez." },
          { status: 403 }
        );
      }
    }

    await adminAuth.deleteUser(uid);
    await adminDb.collection("users").doc(uid).delete();

    return NextResponse.json({
      success: true,
      message: "Kullanıcı başarıyla silindi.",
    });
  } catch (error) {
    console.error("DELETE /api/admin/users/[uid] error:", error);
    return NextResponse.json(
      { success: false, error: "Kullanıcı silinemedi." },
      { status: 500 }
    );
  }
}