import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../../../lib/firebaseAdmin";
import { requireAdmin } from "../../../../lib/adminAuth";

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);

  if (!authResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: authResult.error,
      },
      { status: authResult.status }
    );
  }

  try {
    const snapshot = await adminDb
      .collection("users")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const users = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        uid: doc.id,
        adSoyad: data.adSoyad ?? "-",
        email: data.email ?? "-",
        alan: data.alan ?? "-",
        sinif: data.sinif ?? "-",
        role: data.role ?? "student",
        createdAt:
          data.createdAt?.toDate?.()?.toISOString() ?? null,
      };
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Admin users API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Users could not be loaded.",
      },
      { status: 500 }
    );
  }
}