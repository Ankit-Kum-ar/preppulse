import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { runGemmaInference, parseEvaluationJSON } from "@/lib/ai-engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, turn, question, answer, targetRole } = body;

    if (!sessionId || !turn || !question || !answer) {
      return NextResponse.json(
        { error: "sessionId, turn, question, and answer are required" },
        { status: 400 }
      );
    }

    const currentTurn = Number(turn);
    if (currentTurn > 3) {
      return NextResponse.json(
        { error: "Interview round cap (3) reached." },
        { status: 400 }
      );
    }

    const isFinalRound = currentTurn >= 3;
    const systemPrompt = `
You are a staff engineer and senior tech interviewer evaluating a candidate for a "${targetRole || "Software Engineer"}" position.
This is Round ${currentTurn} of 3.
${
  currentTurn === 1
    ? "Round 1 evaluates Core Fundamentals. Provide a follow-up Round 2 question focusing on Real-World Application / System Design or live coding."
    : currentTurn === 2
    ? "Round 2 evaluates Application. Provide a follow-up Round 3 question focusing on Edge Cases, Failure Modes, and Distributed Scale."
    : "Round 3 is the Final Round. Set next_question to 'CONCLUDED'."
}

Evaluate the candidate's answer constructively.
You MUST output valid JSON only in the following schema:
{
  "score": <number from 1 to 10>,
  "strengths": "<1-2 concise sentences highlighting exact points answered well>",
  "blindspots": "<1-2 concise sentences highlighting missed edge cases, performance pitfalls, or anti-patterns>",
  "better_phrasing": "<1-2 sentences illustrating benchmark phrasing expected from a Staff Engineer>",
  "next_question": "${isFinalRound ? "CONCLUDED" : "<Next progressive interview question>"}",
  "isCodeQuestion": <true or false>
}
`;

    const prompt = `Question: ${question}\nCandidate Answer: ${answer}`;

    const { raw, provider } = await runGemmaInference(prompt, systemPrompt);
    const evaluation = parseEvaluationJSON(raw);

    const client = await clientPromise;
    const db = client.db("preppulse");

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(sessionId);
    } catch {
      return NextResponse.json({ error: "Invalid sessionId format" }, { status: 400 });
    }

    const turnData = {
      turnNumber: currentTurn,
      question,
      userAnswer: answer,
      score: evaluation.score || 7,
      strengths: evaluation.strengths,
      blindspots: evaluation.blindspots,
      betterPhrasing: evaluation.better_phrasing,
      providerUsed: provider,
      createdAt: new Date(),
    };

    await db.collection("sessions").updateOne(
      { _id: objectId },
      { $push: { turns: turnData as any } }
    );

    return NextResponse.json({
      success: true,
      turn: currentTurn,
      isFinished: isFinalRound,
      evaluation,
      nextQuestion: evaluation.next_question,
      isCodeQuestion: Boolean(evaluation.isCodeQuestion),
    });
  } catch (err: any) {
    console.error("Error in /api/interview/turn:", err);
    return NextResponse.json(
      { error: "Failed to process interview turn", details: err.message },
      { status: 500 }
    );
  }
}
