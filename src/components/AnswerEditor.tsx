"use client";

import { useState, useEffect, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { rust } from "@codemirror/lang-rust";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Textarea } from "@/components/ui/textarea";
import {
  Code2,
  FileText,
  Copy,
  Check,
  PlusCircle,
  Lightbulb,
} from "lucide-react";

interface AnswerEditorProps {
  isCodeQuestion: boolean;
  value: string;
  onChange: (val: string) => void;
  targetRole?: string;
}

export default function AnswerEditor({
  isCodeQuestion,
  value,
  onChange,
  targetRole = "Full-Stack Developer",
}: AnswerEditorProps) {
  const [tab, setTab] = useState<"code" | "text">(
    isCodeQuestion ? "code" : "text"
  );
  const [language, setLanguage] = useState<
    "javascript" | "typescript" | "python" | "sql" | "java" | "cpp" | "rust"
  >("typescript");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTab(isCodeQuestion ? "code" : "text");
  }, [isCodeQuestion]);

  // Adjust default language based on target role
  useEffect(() => {
    const roleLower = targetRole.toLowerCase();
    if (
      roleLower.includes("python") ||
      roleLower.includes("machine learning") ||
      roleLower.includes("ai") ||
      roleLower.includes("data")
    ) {
      setLanguage("python");
    } else if (roleLower.includes("sql") || roleLower.includes("database")) {
      setLanguage("sql");
    } else if (roleLower.includes("java") || roleLower.includes("spring")) {
      setLanguage("java");
    } else if (roleLower.includes("c++") || roleLower.includes("embedded")) {
      setLanguage("cpp");
    } else if (roleLower.includes("rust")) {
      setLanguage("rust");
    } else {
      setLanguage("typescript");
    }
  }, [targetRole]);

  const extensions = useMemo(() => {
    switch (language) {
      case "python":
        return [python()];
      case "sql":
        return [sql()];
      case "java":
        return [java()];
      case "cpp":
        return [cpp()];
      case "rust":
        return [rust()];
      case "typescript":
        return [javascript({ typescript: true, jsx: true })];
      case "javascript":
      default:
        return [javascript({ jsx: true })];
    }
  }, [language]);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const insertCodeSnippet = () => {
    const codeTemplates: Record<string, string> = {
      typescript: `\n// Implementation:\nasync function solveProblem(params: any): Promise<any> {\n  try {\n    // Core logic\n    return { success: true };\n  } catch (error) {\n    console.error("Failure:", error);\n    throw error;\n  }\n}\n`,
      python: `\n# Implementation:\ndef solve_problem(params):\n    try:\n        # Core logic\n        return {"success": True}\n    except Exception as e:\n        print(f"Error: {e}")\n        raise\n`,
      sql: `\n-- Optimized Query:\nSELECT \n    id, name, created_at \nFROM \n    records \nWHERE \n    status = 'active' \nORDER BY \n    created_at DESC \nLIMIT 100;\n`,
      javascript: `\n// Implementation:\nfunction solveProblem(params) {\n  // Core logic\n  return { success: true };\n}\n`,
      java: `\n// Implementation:\npublic class Solution {\n    public static void solve() {\n        // Core logic\n    }\n}\n`,
      cpp: `\n// Implementation:\n#include <iostream>\nusing namespace std;\n\nvoid solve() {\n    // Core logic\n}\n`,
      rust: `\n// Implementation:\npub fn solve() -> Result<(), Box<dyn std::error::Error>> {\n    // Core logic\n    Ok(())\n}\n`,
    };

    const snippet = codeTemplates[language] || codeTemplates.typescript;
    const updated = value.trim() ? `${value.trim()}\n\n${snippet}` : snippet;
    onChange(updated);
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className="border border-[#2A2E35] rounded-xl overflow-hidden bg-[#141619] shadow-lg">
      {/* Editor Top Bar */}
      <div className="flex flex-wrap justify-between items-center bg-[#1E2126] px-3.5 py-2 border-b border-[#2A2E35] gap-2">
        {/* Mode Toggles */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTab("text")}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              tab === "text"
                ? "bg-[#281A12] text-[#FF6B2C] border border-[#FF6B2C]/40 shadow-sm"
                : "text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#2A2E35]/50"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Conceptual / Text</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("code")}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              tab === "code"
                ? "bg-[#281A12] text-[#FF6B2C] border border-[#FF6B2C]/40 shadow-sm"
                : "text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#2A2E35]/50"
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Code Sandbox</span>
          </button>
        </div>

        {/* Right Tools: Insert Snippet, Language Selector, Copy */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={insertCodeSnippet}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border border-[#2A2E35] bg-[#0E1013] text-[#FF6B2C] hover:bg-[#281A12] transition-colors"
            title="Insert a formatted code snippet into your answer"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>+ Code Block</span>
          </button>

          {tab === "code" && (
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-[#0E1013] border border-[#2A2E35] text-[#F3F4F6] text-xs rounded-md px-2 py-1 focus:outline-none focus:border-[#FF6B2C]"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="sql">SQL</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="rust">Rust</option>
            </select>
          )}

          <button
            type="button"
            onClick={handleCopy}
            disabled={!value}
            className="p-1.5 text-[#9CA3AF] hover:text-[#F3F4F6] rounded transition-colors disabled:opacity-40"
            title="Copy answer"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="min-h-[240px] bg-[#0B0C0E] relative">
        {tab === "code" ? (
          <CodeMirror
            value={value}
            height="240px"
            theme={vscodeDark}
            extensions={extensions}
            onChange={onChange}
            className="text-sm font-mono"
          />
        ) : (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Structure your answer with: 1) High-level architectural decision, 2) Key components & data flow, 3) Code implementation snippet (click '+ Code Block' above)..."
            className="w-full min-h-[240px] bg-transparent border-0 text-[#F3F4F6] font-mono text-sm leading-relaxed resize-none focus-visible:ring-0 p-4"
          />
        )}
      </div>

      {/* Editor Bottom Meta & Guidance */}
      <div className="flex justify-between items-center bg-[#141619] px-3.5 py-2 border-t border-[#2A2E35] text-[11px] text-[#9CA3AF]">
        <div className="flex items-center gap-1.5 text-neutral-400">
          <Lightbulb className="h-3 w-3 text-[#FF6B2C]" />
          <span>
            You can combine conceptual explanations and live code snippets in either mode.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} chars</span>
        </div>
      </div>
    </div>
  );
}
