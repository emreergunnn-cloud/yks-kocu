import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "../../../../lib/firebaseAdmin";
import { requireAdmin } from "../../../../lib/adminAuth";

async function countAuthUsers() {
  let total = 0;
  let pageToken: string | undefined;

  do {
    const page =
      await adminAuth.listUsers(
        1000,
        pageToken
      );

    total += page.users.length;
    pageToken = page.pageToken;
  } while (pageToken);

  return total;
}

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
    const [totalUsers, examsSnapshot] =
      await Promise.all([
        countAuthUsers(),
        adminDb
          .collection("exam_results")
          .count()
          .get(),
      ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalExams:
          examsSnapshot.data().count,
        totalStudySessions: 0,
      },
    });
  } catch (error) {
    console.error("Admin stats API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Istatistikler yuklenemedi.",
      },
      { status: 500 }
    );
  }
}