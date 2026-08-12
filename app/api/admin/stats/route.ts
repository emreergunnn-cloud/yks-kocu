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
    const [usersSnapshot, examsSnapshot] = await Promise.all([
      adminDb.collection("users").count().get(),
      adminDb.collection("exam_results").count().get(),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: usersSnapshot.data().count,
        totalExams: examsSnapshot.data().count,
        totalStudySessions: 0,
      },
    });
  } catch (error) {
    console.error("Admin stats API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Stats could not be loaded.",
      },
      { status: 500 }
    );
  }
}