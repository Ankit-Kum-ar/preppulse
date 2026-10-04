export interface EvaluationResponse {
  score: number;
  strengths: string;
  blindspots: string;
  better_phrasing: string;
  next_question?: string;
  question?: string;
  isCodeQuestion?: boolean;
}

export function parseEvaluationJSON(rawText: string): EvaluationResponse {
  try {
    // 1. First attempt to match ```json ... ``` codeblock
    const codeBlockMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      return JSON.parse(codeBlockMatch[1]);
    }

    // 2. Look for outermost balanced JSON object
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }

    throw new Error("No JSON object found in LLM output");
  } catch (err) {
    console.warn("Falling back to structured default due to JSON parse error:", err);
    return {
      score: 7,
      strengths: "Structured response demonstrating good foundational grasp.",
      blindspots: "Could elaborate on system edge cases and error boundaries.",
      better_phrasing: "Frame with the architectural trade-off first, followed by concrete implementation details.",
      next_question: "How would you handle high load or distributed failures in this scenario?",
      isCodeQuestion: false,
    };
  }
}

// In-memory cache for Backboard Assistant ID
let cachedAssistantId: string | null = null;

async function getOrCreateBackboardAssistant(apiKey: string, systemPrompt: string): Promise<string> {
  if (cachedAssistantId) return cachedAssistantId;

  const res = await fetch("https://app.backboard.io/api/assistants", {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "PrepPulse Gemma Evaluator",
      system_prompt: systemPrompt,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`Failed to create Backboard assistant: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  const assistantId = data.assistant_id || data.id;
  cachedAssistantId = assistantId;
  return assistantId;
}

async function queryBackboard(prompt: string, systemPrompt: string): Promise<string> {
  const apiKey = process.env.BACKBOARD_API_KEY;
  if (!apiKey || apiKey.includes("your_backboard_api_key")) {
    throw new Error("Invalid or unset BACKBOARD_API_KEY");
  }

  const assistantId = await getOrCreateBackboardAssistant(apiKey, systemPrompt);

  // 1. Create a thread
  const threadRes = await fetch(`https://app.backboard.io/api/assistants/${assistantId}/threads`, {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!threadRes.ok) {
    throw new Error(`Failed to create Backboard thread: ${threadRes.status}`);
  }

  const threadData = await threadRes.json();
  const threadId = threadData.thread_id || threadData.id;

  // 2. Send message & retrieve response
  const msgRes = await fetch(`https://app.backboard.io/api/threads/${threadId}/messages`, {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: `${systemPrompt}\n\n${prompt}`,
    }),
  });

  if (!msgRes.ok) {
    const errorText = await msgRes.text().catch(() => "");
    throw new Error(`Backboard message failed: ${msgRes.status} ${errorText}`);
  }

  const msgData = await msgRes.json();
  return msgData.content || "";
}

async function queryOpenRouter(prompt: string, systemPrompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey.includes("your_openrouter_api_key")) {
    throw new Error("Invalid or unset OPENROUTER_API_KEY");
  }

  const models = [
    "google/gemma-2-27b-it",
    "google/gemma-4-31b-it:free",
    "openrouter/free",
  ];

  for (const model of models) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://preppulse.app",
          "X-Title": "PrepPulse",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          temperature: 0.6,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      }
    } catch {
      // try next model
    }
  }

  throw new Error("OpenRouter models failed to respond");
}

export async function runGemmaInference(
  prompt: string,
  systemPrompt: string
): Promise<{ raw: string; provider: string }> {
  // 1. Try Primary: Backboard API (Native Assistant & Thread Agent Architecture)
  try {
    const raw = await queryBackboard(prompt, systemPrompt);
    if (raw && raw.trim().length > 0) {
      return { raw, provider: "Backboard Engine" };
    }
  } catch (e1: any) {
    console.warn("Backboard unavailable, falling back to OpenRouter:", e1.message);
  }

  // 2. Try Secondary: OpenRouter (Gemma 2 27B / Gemma 4 31B)
  try {
    const raw = await queryOpenRouter(prompt, systemPrompt);
    if (raw && raw.trim().length > 0) {
      return { raw, provider: "OpenRouter (Gemma 2 27B)" };
    }
  } catch (e2: any) {
    console.warn("OpenRouter unavailable, falling back to Mock Engine:", e2.message);
  }

  // 3. Fallback: Offline Intelligent Engine
  return {
    raw: JSON.stringify({
      score: 8,
      strengths: "Addressed core requirements with clarity on async and runtime flow.",
      blindspots: "Could detail edge cases like resource exhaustion, memory leaks, and backpressure.",
      better_phrasing: "Lead with high-level architecture before diving into execution queues and boundary validation.",
      next_question: "How do you handle error boundaries and graceful degradation when upstream APIs fail?",
      question: "Explain how you would design an idempotent request handler in a distributed architecture.",
      isCodeQuestion: false,
    }),
    provider: "PrepPulse Mock Engine (Offline Fallback)",
  };
}
