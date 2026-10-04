import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("preppulse");

    const recentSessions = await db
      .collection("sessions")
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({
      success: true,
      sessions: recentSessions.map((s) => ({
        sessionId: s._id.toString(),
        friendName: s.friendName,
        targetRole: s.targetRole,
        experienceLevel: s.experienceLevel,
        overallScore: s.overallScore,
        isCompleted: s.isCompleted,
        summary: s.summary,
        turnsCount: s.turns?.length || 0,
        createdAt: s.createdAt,
      })),
    });
  } catch (err: any) {
    console.error("Error fetching history:", err);
    return NextResponse.json(
      { error: "Failed to fetch session history", details: err.message },
      { status: 500 }
    );
  }
}
