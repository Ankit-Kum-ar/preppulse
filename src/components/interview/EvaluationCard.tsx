"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import { TurnEvaluation } from "@/types/interview";

interface EvaluationCardProps {
  currentTurn: number;
  evaluation: TurnEvaluation;
  loading: boolean;
  onNextRound: () => void;
}

export default function EvaluationCard({
  currentTurn,
  evaluation,
  loading,
  onNextRound,
}: EvaluationCardProps) {
  return (
    <Card className="bg-[#141619] border-[#2A2E35] text-[#F3F4F6] shadow-xl animate-in fade-in-50 duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#2A2E35]">
        <span className="text-sm font-semibold text-white">
          Round {currentTurn} Scorecard & Feedback
        </span>
        <Badge className="bg-[#281A12] text-[#FF6B2C] border border-[#FF6B2C]/40 px-3 py-1 font-bold text-xs">
          Score: {evaluation.score}/10
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3.5 pt-4 text-xs">
        {/* Strengths */}
        <div className="flex gap-2.5 bg-[#0E1013] p-3.5 rounded-lg border border-[#2A2E35]">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-300">Strengths: </span>
            <span className="text-[#9CA3AF] leading-relaxed">
              {evaluation.strengths}
            </span>
          </div>
        </div>

        {/* Blindspots */}
        <div className="flex gap-2.5 bg-[#0E1013] p-3.5 rounded-lg border border-[#2A2E35]">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300">
              Blind Spots & Pitfalls:{" "}
            </span>
            <span className="text-[#9CA3AF] leading-relaxed">
              {evaluation.blindspots}
            </span>
          </div>
        </div>

        {/* Staff Benchmark */}
        <div className="flex gap-2.5 bg-[#0E1013] p-3.5 rounded-lg border border-[#FF6B2C]/25">
          <Lightbulb className="h-4 w-4 text-[#FF6B2C] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#FF6B2C]">
              Staff Engineer Benchmark Phrasing:{" "}
            </span>
            <span className="text-[#F3F4F6] leading-relaxed">
              {evaluation.better_phrasing}
            </span>
          </div>
        </div>

        <Button
          onClick={onNextRound}
          disabled={loading}
          className="w-full mt-4 bg-[#1E2126] hover:bg-[#2A2E35] text-white border border-[#2A2E35] py-2.5 h-11 font-medium transition-all text-xs"
        >
          {loading
            ? "Finalizing Debrief..."
            : currentTurn >= 3
            ? "Finish Interview & View Final Debrief →"
            : "Proceed to Next Round →"}
        </Button>
      </CardContent>
    </Card>
  );
}
