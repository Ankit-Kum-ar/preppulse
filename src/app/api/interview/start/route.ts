import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { runGemmaInference, parseEvaluationJSON } from "@/lib/ai-engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { friendName, targetRole, experienceLevel } = body;

    if (!friendName || !targetRole) {
      return NextResponse.json(
        { error: "friendName and targetRole are required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("preppulse");

    const systemPrompt = `
You are a senior technical interviewer conducting an adaptive 3-round mock interview for a candidate targeting "${targetRole}" (${experienceLevel || "Mid-Level"}).
This is Round 1 of 3: Focus on Core Fundamentals and Concepts.
You MUST output valid JSON only in the following schema:
{
  "question": "<A sharp, realistic interview question focusing on core fundamentals>",
  "isCodeQuestion": <true or false>
}
`;

    const prompt = `Candidate: ${friendName}. Target Role: ${targetRole}. Experience Level: ${experienceLevel || "Mid-Level"}. Generate the opening interview question.`;

    const { raw } = await runGemmaInference(prompt, systemPrompt);
    const parsed = parseEvaluationJSON(raw);

    const questionText = parsed.question || "Explain the core architecture and execution model of your primary language/runtime.";
    const isCodeQuestion = Boolean(parsed.isCodeQuestion);

    const newSession = {
      friendName,
      targetRole,
      experienceLevel: experienceLevel || "Mid-Level",
      overallScore: null,
      isCompleted: false,
      summary: null,
      createdAt: new Date(),
      turns: [],
    };

    const result = await db.collection("sessions").insertOne(newSession);

    return NextResponse.json({
      success: true,
      sessionId: result.insertedId.toString(),
      turn: 1,
      question: questionText,
      isCodeQuestion,
    });
  } catch (err: any) {
    console.error("Error in /api/interview/start:", err);
    return NextResponse.json(
      { error: "Failed to initialize interview session", details: err.message },
      { status: 500 }
    );
  }
}
