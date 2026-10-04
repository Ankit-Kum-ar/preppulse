# PrepPulse — Comprehensive End-to-End Build Specification

## 1. Project Identity & Objective
- **Name:** PrepPulse
- **Built For:** Anxious developer friends preparing for technical interviews who freeze during live problem-solving or struggle to articulate trade-offs under pressure.
- **What it does:** An adaptive, 3-round technical interview partner powered by Google's open-weight Gemma models. Evaluates candidates across communication clarity, edge-case coverage, and architectural depth with instant structured scorecards.
- **Hackathon Targets:**
  - **Best Use of Gemma ($200):** Google Gemma 2 27B / Gemma 2 9B as the core evaluation engine.
  - **Best Use of Backboard ($100):** Primary low-latency inference gateway using partner credits.
  - **Best Use of MongoDB Atlas ($100):** Unified document store for sessions, turns, and scores.

---

## 2. Installation & Environment Setup

### 2.1 Dependencies Installation
Run this single command in the project root (`preppulse`):

```bash
npm install mongodb @uiw/react-codemirror @codemirror/lang-javascript @uiw/codemirror-theme-vscode lucide-react canvas-confetti
```

Add the remaining shadcn components:

```bash
npx shadcn@latest add button card tabs badge progress textarea input label
```

### 2.2 Environment Variables (`.env.local`)

Create or update `.env.local` in the project root:

```env
# MongoDB Atlas Connection
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/preppulse?retryWrites=true&w=majority"

# Primary AI Provider (Backboard API)
BACKBOARD_API_KEY="your_backboard_api_key"

# Fallback AI Provider (OpenRouter Free Tier)
OPENROUTER_API_KEY="your_openrouter_api_key"
```

---

## 3. Architecture & Data Flow

```text
┌────────────────────────────────────────────────────────┐
│                      End User                          │
│   (Role Setup -> 3-Round Interactive Workspace)        │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP JSON API
                            ▼
┌────────────────────────────────────────────────────────┐
│                  Next.js App Router                    │
│                                                        │
│  1. POST /api/interview/start   (Init session & Q1)    │
│  2. POST /api/interview/turn    (Evaluate & Next Q)    │
│  3. POST /api/interview/finish  (Final summary card)   │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
               ▼                          ▼
┌───────────────────────────┐  ┌─────────────────────────┐
│       MongoDB Atlas       │  │    Dual AI Pipeline     │
│    Database: `preppulse`  │  │   Tier 1: Backboard     │
│   Collection: `sessions`  │  │   Tier 2: OpenRouter    │
│                           │  │   Tier 3: Offline Mock  │
└───────────────────────────┘  └─────────────────────────┘
```

---

## 4. Database Schema (MongoDB Atlas)

**Collection:** `sessions`

```json
{
  "_id": "ObjectId(...)",
  "friendName": "Ankit",
  "targetRole": "Full-Stack Web Developer",
  "experienceLevel": "Junior",
  "overallScore": 8,
  "isCompleted": false,
  "summary": "Solid fundamentals on async mechanics; needs focus on system edge cases.",
  "createdAt": "2026-10-04T16:30:00.000Z",
  "turns": [
    {
      "turnNumber": 1,
      "question": "How does Node.js handle asynchronous operations behind the scenes?",
      "userAnswer": "It uses libuv and the event loop with worker threads.",
      "score": 8,
      "strengths": "Directly referenced libuv and the event loop model.",
      "blindspots": "Did not clarify the difference between microtask and macrotask queues.",
      "betterPhrasing": "Node.js delegates non-blocking I/O to libuv, executing microtasks before draining the macrotask queue.",
      "providerUsed": "Backboard (Gemma 27B)",
      "createdAt": "2026-10-04T16:32:00.000Z"
    }
  ]
}
```

---

## 5. Backend Implementation Plan

### File 1: `lib/mongodb.js` (Connection Cache)

Maintains a single `MongoClient` instance to prevent connection pooling exhaustion during Next.js hot-reloads.

```javascript
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Missing MONGODB_URI in environment variables.");

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
```

---

### File 2: `lib/ai-engine.js` (Resilient Dual Inference)

Coordinates requests to Backboard and OpenRouter with automatic failover and JSON extraction.

```javascript
export function parseEvaluationJSON(rawText) {
  try {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found");
    return JSON.parse(match[0]);
  } catch (err) {
    return {
      score: 7,
      strengths: "Structured response covering primary concepts.",
      blindspots: "Could elaborate on edge cases and system performance.",
      better_phrasing: "Frame with the architectural trade-off first, then detail implementation.",
      next_question: "How would you handle caching or edge performance for this setup?"
    };
  }
}

async function queryBackboard(prompt, systemPrompt) {
  const res = await fetch("https://api.backboard.io/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.BACKBOARD_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemma-2-27b-it",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.6,
    }),
  });
  if (!res.ok) throw new Error(`Backboard failed: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

async function queryOpenRouter(prompt, systemPrompt) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      models: [
        "google/gemma-2-9b-it:free",
        "google/gemma-3-12b-it:free",
        "openrouter/free"
      ],
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.6,
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter failed: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

export async function runGemmaInference(prompt, systemPrompt) {
  try {
    const raw = await queryBackboard(prompt, systemPrompt);
    return { raw, provider: "Backboard (Gemma 27B)" };
  } catch (e1) {
    console.warn("Backboard unavailable, falling back to OpenRouter:", e1.message);
    try {
      const raw = await queryOpenRouter(prompt, systemPrompt);
      return { raw, provider: "OpenRouter Free (Gemma 9B)" };
    } catch (e2) {
      console.error("All AI providers exhausted:", e2.message);
      return {
        raw: JSON.stringify({
          score: 7,
          strengths: "Addressed the core question effectively.",
          blindspots: "Could detail error recovery patterns.",
          better_phrasing: "Clarify system state guarantees during unexpected downtime.",
          next_question: "How do you trace failures across distributed services?"
        }),
        provider: "Emergency Cache"
      };
    }
  }
}
```

---

### File 3: `app/api/interview/start/route.js`

Creates the session and generates Question 1.

```javascript
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { runGemmaInference, parseEvaluationJSON } from "@/lib/ai-engine";

export async function POST(req) {
  try {
    const { friendName, targetRole, experienceLevel } = await req.json();

    const client = await clientPromise;
    const db = client.db("preppulse");

    const systemPrompt = `
You are a senior tech interviewer conducting a mock interview for a friend targeting a "${targetRole}" (${experienceLevel}).
Generate Question 1 of 3: Focus on Core Fundamentals.
Output valid JSON only:
{
  "question": "<The question string>",
  "isCodeQuestion": <true or false>
}
`;

    const { raw } = await runGemmaInference(
      `Candidate: ${friendName}. Target Role: ${targetRole}. Generate the first interview question.`,
      systemPrompt
    );
    const parsed = parseEvaluationJSON(raw);

    const newSession = {
      friendName,
      targetRole,
      experienceLevel,
      overallScore: null,
      isCompleted: false,
      summary: null,
      createdAt: new Date(),
      turns: []
    };

    const result = await db.collection("sessions").insertOne(newSession);

    return NextResponse.json({
      success: true,
      sessionId: result.insertedId,
      turn: 1,
      question: parsed.question || "Explain the core architecture of your primary framework.",
      isCodeQuestion: Boolean(parsed.isCodeQuestion)
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to initialize interview" }, { status: 500 });
  }
}
```

---

### File 4: `app/api/interview/turn/route.js`

Evaluates the user's answer, enforces the 3-round cap, and saves the turn.

```javascript
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { runGemmaInference, parseEvaluationJSON } from "@/lib/ai-engine";

export async function POST(req) {
  try {
    const { sessionId, turn, question, answer, targetRole } = await req.json();

    if (turn > 3) {
      return NextResponse.json({ error: "Interview round cap (3) reached." }, { status: 400 });
    }

    const isFinalRound = turn >= 3;
    const systemPrompt = `
You are a senior tech interviewer evaluating a friend for a "${targetRole}" role.
This is turn ${turn} of 3.
Evaluate the answer constructively.
You MUST output valid JSON only:
{
  "score": <number 1-10>,
  "strengths": "<1-2 concise sentences on what was answered correctly>",
  "blindspots": "<1-2 concise sentences on missing edge cases or anti-patterns>",
  "better_phrasing": "<1-2 sentences showing benchmark phrasing by a staff engineer>",
  "next_question": "${isFinalRound ? 'CONCLUDED' : '<Follow-up deeper digging question>'}",
  "isCodeQuestion": <true or false>
}
`;

    const { raw, provider } = await runGemmaInference(
      `Question: ${question}\nCandidate Answer: ${answer}`,
      systemPrompt
    );

    const evaluation = parseEvaluationJSON(raw);

    const client = await clientPromise;
    const db = client.db("preppulse");

    const turnData = {
      turnNumber: turn,
      question,
      userAnswer: answer,
      score: evaluation.score || 7,
      strengths: evaluation.strengths,
      blindspots: evaluation.blindspots,
      betterPhrasing: evaluation.better_phrasing,
      providerUsed: provider,
      createdAt: new Date()
    };

    await db.collection("sessions").updateOne(
      { _id: new ObjectId(sessionId) },
      { $push: { turns: turnData } }
    );

    return NextResponse.json({
      success: true,
      turn,
      isFinished: isFinalRound,
      evaluation,
      nextQuestion: evaluation.next_question,
      isCodeQuestion: Boolean(evaluation.isCodeQuestion)
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to process turn" }, { status: 500 });
  }
}
```

---

### File 5: `app/api/interview/finish/route.js`

Calculates the final average score and closes the session.

```javascript
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { sessionId } = await req.json();

    const client = await clientPromise;
    const db = client.db("preppulse");

    const session = await db.collection("sessions").findOne({ _id: new ObjectId(sessionId) });
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

    const totalScore = session.turns.reduce((acc, t) => acc + (t.score || 0), 0);
    const avgScore = session.turns.length ? Math.round(totalScore / session.turns.length) : 0;

    const summary = `Candidate completed ${session.turns.length} rounds for ${session.targetRole} with an average score of ${avgScore}/10.`;

    await db.collection("sessions").updateOne(
      { _id: new ObjectId(sessionId) },
      { $set: { isCompleted: true, overallScore: avgScore, summary } }
    );

    return NextResponse.json({
      success: true,
      overallScore: avgScore,
      summary,
      turns: session.turns
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to finalize session" }, { status: 500 });
  }
}
```

---

## 6. Frontend Implementation Plan

### File 6: `components/AnswerEditor.jsx`

Dual-mode editor toggling between plain-text explanation and CodeMirror.

```jsx
"use client";

import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Textarea } from "@/components/ui/textarea";

export default function AnswerEditor({ isCodeQuestion, value, onChange }) {
  const [tab, setTab] = useState(isCodeQuestion ? "code" : "text");

  useEffect(() => {
    setTab(isCodeQuestion ? "code" : "text");
  }, [isCodeQuestion]);

  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden bg-[#1e1e1e]">
      <div className="flex justify-between items-center bg-[#252526] px-3 py-1.5 border-b border-neutral-800">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("text")}
            className={`text-xs px-2.5 py-1 rounded transition-colors ${
              tab === "text" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Conceptual / Text
          </button>
          <button
            type="button"
            onClick={() => setTab("code")}
            className={`text-xs px-2.5 py-1 rounded transition-colors ${
              tab === "code" ? "bg-neutral-800 text-white" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            &lt;/&gt; Code Editor
          </button>
        </div>
        <span className="text-[11px] text-neutral-400">
          {tab === "code" ? "JavaScript / TypeScript" : "Monospace text"}
        </span>
      </div>

      <div className="min-h-[220px]">
        {tab === "code" ? (
          <CodeMirror
            value={value}
            height="220px"
            theme={vscodeDark}
            extensions={[javascript({ jsx: true, typescript: true })]}
            onChange={onChange}
            className="text-sm font-mono"
          />
        ) : (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Explain your approach, architecture, and trade-offs..."
            className="w-full min-h-[220px] bg-transparent border-0 text-neutral-100 font-mono text-sm resize-none focus-visible:ring-0"
          />
        )}
      </div>
    </div>
  );
}
```

---

### File 7: `app/page.js` (Main Lifecycle Orchestration)

Runs the complete state machine: Setup Form → Live Turn → Evaluation Card → Final Scorecard.

```jsx
"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import AnswerEditor from "@/components/AnswerEditor";
import { CheckCircle2, AlertTriangle, Lightbulb, Trophy, RotateCcw } from "lucide-react";

export default function Home() {
  const [screen, setScreen] = useState("setup"); // setup | interview | final
  const [loading, setLoading] = useState(false);

  // Setup inputs
  const [friendName, setFriendName] = useState("");
  const [targetRole, setTargetRole] = useState("Full-Stack Web Developer");
  const [experienceLevel, setExperienceLevel] = useState("Junior");

  // Interview state
  const [sessionId, setSessionId] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [question, setQuestion] = useState("");
  const [isCodeQuestion, setIsCodeQuestion] = useState(false);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [finalReport, setFinalReport] = useState(null);

  async function handleStart() {
    if (!friendName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendName, targetRole, experienceLevel }),
      });
      const data = await res.json();
      if (data.success) {
        setSessionId(data.sessionId);
        setQuestion(data.question);
        setIsCodeQuestion(data.isCodeQuestion);
        setCurrentTurn(1);
        setScreen("interview");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitTurn() {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/interview/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          turn: currentTurn,
          question,
          answer,
          targetRole,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEvaluation(data.evaluation);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleNextRound() {
    if (currentTurn >= 3) {
      setLoading(true);
      try {
        const res = await fetch("/api/interview/finish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (data.success) {
          setFinalReport(data);
          setScreen("final");
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
      } finally {
        setLoading(false);
      }
    } else {
      setQuestion(evaluation.next_question);
      setIsCodeQuestion(evaluation.isCodeQuestion || false);
      setCurrentTurn((prev) => prev + 1);
      setAnswer("");
      setEvaluation(null);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-neutral-800 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
              PrepPulse
            </h1>
            <p className="text-xs text-neutral-400">
              Adaptive Technical Interview Partner powered by Gemma
            </p>
          </div>
          {screen === "interview" && (
            <Badge className="border-neutral-700 text-neutral-300" variant="outline">
              Round {currentTurn} of 3
            </Badge>
          )}
        </header>

        {/* 1. Setup Screen */}
        {screen === "setup" && (
          <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
            <CardHeader>
              <CardTitle className="text-lg">Build for a Friend: Setup Interview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Friend's Name</label>
                <Input
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  placeholder="e.g. Ankit"
                  className="bg-neutral-950 border-neutral-800 text-neutral-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Target Role</label>
                <Input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full-Stack Web Developer"
                  className="bg-neutral-950 border-neutral-800 text-neutral-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 focus:outline-none"
                >
                  <option value="Junior">Junior / Entry Level</option>
                  <option value="Mid-Level">Mid-Level Engineer</option>
                  <option value="Senior">Senior Engineer</option>
                </select>
              </div>

              <Button
                onClick={handleStart}
                disabled={loading || !friendName.trim()}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white"
              >
                {loading ? "Initializing Gemma Session..." : "Start 3-Round Mock Interview"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 2. Interview Screen */}
        {screen === "interview" && (
          <div className="space-y-6">
            <Progress value={(currentTurn / 3) * 100} className="h-1.5 bg-neutral-800" />

            <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
              <CardHeader className="pb-3">
                <div className="text-xs text-blue-400 uppercase tracking-wider font-semibold">
                  Round {currentTurn}: {currentTurn === 1 ? "Fundamentals" : currentTurn === 2 ? "Application" : "Architecture & Edge Cases"}
                </div>
                <CardTitle className="text-base leading-relaxed text-neutral-100">
                  {question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnswerEditor isCodeQuestion={isCodeQuestion} value={answer} onChange={setAnswer} />

                {!evaluation && (
                  <Button
                    onClick={handleSubmitTurn}
                    disabled={loading || !answer.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    {loading ? "Evaluating Answer with Gemma..." : "Submit Answer"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Turn Scorecard */}
            {evaluation && (
              <Card className="bg-neutral-900 border-neutral-800 text-neutral-100 animate-in fade-in-50">
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="text-sm font-semibold text-neutral-200">
                    Round {currentTurn} Evaluation
                  </span>
                  <Badge className="bg-blue-900/60 text-blue-300 border-blue-700">
                    Score: {evaluation.score}/10
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3 pt-4 text-xs">
                  <div className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-neutral-300">Strengths: </span>
                      <span className="text-neutral-400">{evaluation.strengths}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-neutral-300">Blind Spots: </span>
                      <span className="text-neutral-400">{evaluation.blindspots}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Lightbulb className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-neutral-300">Staff Benchmark Phrasing: </span>
                      <span className="text-neutral-400">{evaluation.better_phrasing}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleNextRound}
                    disabled={loading}
                    className="w-full mt-4 bg-neutral-800 hover:bg-neutral-700 text-white"
                  >
                    {loading
                      ? "Finalizing..."
                      : currentTurn >= 3
                      ? "Finish Interview & Generate Debrief"
                      : "Proceed to Next Round →"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* 3. Final Summary Screen */}
        {screen === "final" && finalReport && (
          <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
            <CardHeader className="text-center space-y-2 pb-4">
              <Trophy className="h-10 w-10 text-amber-400 mx-auto" />
              <CardTitle className="text-xl">Interview Completed!</CardTitle>
              <div className="text-xs text-neutral-400">
                Prepared for <span className="text-white font-medium">{friendName}</span> ({targetRole})
              </div>
              <div className="text-3xl font-extrabold text-blue-400">
                {finalReport.overallScore} / 10
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-md text-xs text-neutral-300 leading-relaxed">
                {finalReport.summary}
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Rounds Recap
                </span>
                {finalReport.turns.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-2.5 bg-neutral-950/60 border border-neutral-800 rounded text-xs"
                  >
                    <span className="text-neutral-300 truncate max-w-[420px]">
                      Round {t.turnNumber}: {t.question}
                    </span>
                    <Badge className="bg-neutral-800 text-neutral-300" variant="secondary">
                      {t.score}/10
                    </Badge>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => {
                  setScreen("setup");
                  setSessionId(null);
                  setEvaluation(null);
                  setFinalReport(null);
                  setAnswer("");
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Start Another Session
              </Button>
            </CardContent>
          </Card>
        )}

      </div>
    </main>
  );
}
```

---

## 7. Phased Execution Prompts for Antigravity

Instruct Antigravity's agent sequentially using these exact instructions:

### Prompt for Phase 1: Database & AI Gateway

> *"Read `BUILD_PLAN.md`. Implement the database and AI core files:*
> *1. Create `lib/mongodb.js`.*
> *2. Create `lib/ai-engine.js` with Backboard primary inference, OpenRouter fallback, and the `parseEvaluationJSON` helper.*
> *3. Create a verification route `app/api/health/route.js` that checks connection to MongoDB Atlas and returns JSON `{ mongo: 'connected' }`.*
> *Apply the changes and test."*

### Prompt for Phase 2: API Endpoints

> *"Read `BUILD_PLAN.md`. Implement the three interview API endpoints:*
> *1. `app/api/interview/start/route.js`*
> *2. `app/api/interview/turn/route.js` (enforcing the <= 3 turn limit and MongoDB `$push` update).*
> *3. `app/api/interview/finish/route.js` (calculating average score and setting `isCompleted: true`).*
> *Apply the changes."*

### Prompt for Phase 3: Frontend UI & Editor

> *"Read `BUILD_PLAN.md`. Build the interactive user interface:*
> *1. Create `components/AnswerEditor.jsx` using `@uiw/react-codemirror` and shadcn textarea.*
> *2. Update `app/page.js` with the full 3-step state machine (Setup, Live Interview with Scorecards, and Final Confetti Debrief).*
> *Apply the changes and run `npm run dev` to verify the complete flow."*
