import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { runGemmaInference, parseEvaluationJSON } from "@/lib/ai-engine";

export async function GET() {
  const result: Record<string, any> = {
    timestamp: new Date().toISOString(),
    status: "ok",
    checks: {},
  };

  // 1. Check MongoDB
  try {
    const client = await clientPromise;
    const db = client.db("preppulse");
    await db.command({ ping: 1 });
    result.checks.mongodb = {
      status: "connected",
      database: "preppulse",
    };
  } catch (err: any) {
    result.status = "degraded";
    result.checks.mongodb = {
      status: "error",
      error: err.message,
    };
  }

  // 2. Check AI Engine
  try {
    const aiTest = await runGemmaInference(
      "Hello! Respond with a quick JSON confirming readiness.",
      'Output valid JSON only: {"ready": true, "engine": "gemma"}'
    );
    const parsed = parseEvaluationJSON(aiTest.raw);
    result.checks.ai = {
      status: "active",
      provider: aiTest.provider,
      sampleResponse: parsed,
    };
  } catch (err: any) {
    result.status = "degraded";
    result.checks.ai = {
      status: "error",
      error: err.message,
    };
  }

  const statusCode = result.status === "ok" ? 200 : 207;
  return NextResponse.json(result, { status: statusCode });
}
