"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import AnswerEditor from "@/components/AnswerEditor";
import EvaluationCard from "@/components/interview/EvaluationCard";
import { TurnEvaluation } from "@/types/interview";

interface InterviewWorkspaceProps {
  currentTurn: number;
  question: string;
  isCodeQuestion: boolean;
  answer: string;
  setAnswer: (val: string) => void;
  selectedRoleString: string;
  experienceLevel: string;
  secondsElapsed: number;
  formatTimer: (seconds: number) => string;
  loading: boolean;
  evaluation: TurnEvaluation | null;
  onSubmitTurn: () => void;
  onNextRound: () => void;
}

export default function InterviewWorkspace({
  currentTurn,
  question,
  isCodeQuestion,
  answer,
  setAnswer,
  selectedRoleString,
  experienceLevel,
  secondsElapsed,
  formatTimer,
  loading,
  evaluation,
  onSubmitTurn,
  onNextRound,
}: InterviewWorkspaceProps) {
  return (
    <div className="space-y-6">
      {/* Progress & Live Stopwatch Banner */}
      <div className="flex justify-between items-center text-xs text-[#9CA3AF] bg-[#141619] p-3 rounded-lg border border-[#2A2E35]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#FF6B2C] animate-pulse" />
          <span>
            Interviewing for <strong className="text-white">{selectedRoleString}</strong> ({experienceLevel})
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-mono text-white">
            <Clock className="h-3.5 w-3.5 text-[#FF6B2C]" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>
          <span className="text-[#FF6B2C] font-semibold">
            Round {currentTurn} / 3 ({Math.round((currentTurn / 3) * 100)}%)
          </span>
        </div>
      </div>

      <Progress
        value={(currentTurn / 3) * 100}
        className="h-1.5 bg-[#1E2126] [&>div]:bg-[#FF6B2C]"
      />

      {/* Question Card */}
      <Card className="bg-[#141619] border-[#2A2E35] text-[#F3F4F6] shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="text-xs text-[#FF6B2C] uppercase tracking-wider font-semibold">
              Round {currentTurn}:{" "}
              {currentTurn === 1
                ? "Fundamentals & Core Mechanics"
                : currentTurn === 2
                ? "Application & Production Architecture"
                : "Edge Cases, Failure Recovery & Scale"}
            </div>
            {isCodeQuestion && (
              <Badge variant="outline" className="text-[10px] bg-[#281A12] text-[#FF6B2C] border-[#FF6B2C]/30">
                Code Question
              </Badge>
            )}
          </div>
          <CardTitle className="text-base font-semibold leading-relaxed text-[#F3F4F6] pt-1">
            {question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnswerEditor
            isCodeQuestion={isCodeQuestion}
            value={answer}
            onChange={setAnswer}
            targetRole={selectedRoleString}
          />

          {!evaluation && (
            <Button
              onClick={onSubmitTurn}
              disabled={loading || !answer.trim()}
              className="w-full bg-[#FF6B2C] hover:bg-[#FF5414] text-white font-semibold py-2.5 h-11 shadow-md shadow-orange-950/40 transition-all text-sm"
            >
              {loading ? "Evaluating Answer with Google Gemma..." : "Submit Answer"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Turn Scorecard */}
      {evaluation && (
        <EvaluationCard
          currentTurn={currentTurn}
          evaluation={evaluation}
          loading={loading}
          onNextRound={onNextRound}
        />
      )}
    </div>
  );
}
