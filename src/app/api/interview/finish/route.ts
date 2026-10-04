import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("preppulse");

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(sessionId);
    } catch {
      return NextResponse.json({ error: "Invalid sessionId format" }, { status: 400 });
    }

    const session = await db.collection("sessions").findOne({ _id: objectId });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const turns = session.turns || [];
    const totalScore = turns.reduce((acc: number, t: any) => acc + (Number(t.score) || 0), 0);
    const avgScore = turns.length > 0 ? Math.round((totalScore / turns.length) * 10) / 10 : 0;

    const summary = `Candidate ${session.friendName} completed ${turns.length} rounds for ${session.targetRole} (${session.experienceLevel}) with an overall score of ${avgScore}/10.`;

    await db.collection("sessions").updateOne(
      { _id: objectId },
      {
        $set: {
          isCompleted: true,
          overallScore: avgScore,
          summary,
          completedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      sessionId: session._id.toString(),
      friendName: session.friendName,
      targetRole: session.targetRole,
      overallScore: avgScore,
      summary,
      turns,
    });
  } catch (err: any) {
    console.error("Error in /api/interview/finish:", err);
    return NextResponse.json(
      { error: "Failed to finalize session", details: err.message },
      { status: 500 }
    );
  }
}
