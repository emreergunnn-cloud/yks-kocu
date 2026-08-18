import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "../../../../lib/firebaseAdmin";
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
    const requested =
      Number(request.nextUrl.searchParams.get("limit")) || 100;

    const limit =
      Math.min(Math.max(requested, 1), 1000);

    const authPage =
      await adminAuth.listUsers(limit);

    const refs =
      authPage.users.map((user) =>
        adminDb.collection("users").doc(user.uid)
      );

    const profileDocs =
      refs.length > 0
        ? await adminDb.getAll(...refs)
        : [];

    const profiles =
      new Map(
        profileDocs.map((doc) => [
          doc.id,
          doc.exists ? doc.data() ?? {} : {},
        ])
      );

    const users =
      authPage.users
        .map((authUser) => {
          const profile =
            profiles.get(authUser.uid) ?? {};

          const profileCreatedAt =
            profile.createdAt?.toDate?.()?.toISOString?.();

          return {
            uid: authUser.uid,
            adSoyad:
              profile.adSoyad ??
              authUser.displayName ??
              "-",
            email:
              authUser.email ??
              profile.email ??
              "-",
            alan:
              profile.alan ?? "-",
            sinif:
              profile.sinif ?? "-",
            role:
              profile.role ?? "student",
            createdAt:
              profileCreatedAt ??
              authUser.metadata.creationTime ??
              "",
          };
        })
        .sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt)
        );

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Admin users API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Kullanicilar yuklenemedi.",
      },
      { status: 500 }
    );
  }
}