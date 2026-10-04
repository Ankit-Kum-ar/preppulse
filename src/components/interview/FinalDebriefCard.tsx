"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Download, Share2, RotateCcw, Check } from "lucide-react";
import { FinalReport } from "@/types/interview";

interface FinalDebriefCardProps {
  friendName: string;
  selectedRoleString: string;
  experienceLevel: string;
  finalReport: FinalReport;
  onReset: () => void;
}

export default function FinalDebriefCard({
  friendName,
  selectedRoleString,
  experienceLevel,
  finalReport,
  onReset,
}: FinalDebriefCardProps) {
  const [copiedShare, setCopiedShare] = useState(false);

  const exportScorecardMarkdown = () => {
    const md = `# PrepPulse Mock Interview Scorecard
**Candidate:** ${friendName}
**Target Role:** ${selectedRoleString} (${experienceLevel})
**Overall Score:** ${finalReport.overallScore} / 10
**Summary:** ${finalReport.summary}

## Round Breakdown
${finalReport.turns
  ?.map(
    (t) => `### Round ${t.turnNumber} (Score: ${t.score}/10)
- **Question:** ${t.question}
- **Candidate Answer:** ${t.userAnswer}
- **Strengths:** ${t.strengths}
- **Blindspots:** ${t.blindspots}
- **Staff Benchmark Phrasing:** ${t.betterPhrasing}
`
  )
  .join("\n")}
`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PrepPulse_${friendName.replace(/\s+/g, "_")}_Scorecard.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyShareText = () => {
    const text = `🎯 I just completed a 3-round technical mock interview on PrepPulse for ${selectedRoleString} and scored ${finalReport.overallScore}/10! 🚀`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <Card className="bg-[#141619] border-[#2A2E35] text-[#F3F4F6] shadow-2xl animate-in zoom-in-95 duration-300">
      <CardHeader className="text-center space-y-2 pb-5 border-b border-[#2A2E35]">
        <div className="inline-flex p-3 rounded-full bg-[#281A12] border border-[#FF6B2C]/30 mx-auto">
          <Trophy className="h-8 w-8 text-[#FF6B2C]" />
        </div>
        <CardTitle className="text-2xl font-bold text-white tracking-tight">
          Interview Completed!
        </CardTitle>
        <div className="text-xs text-[#9CA3AF]">
          Debrief for <strong className="text-white">{friendName}</strong> — {selectedRoleString} ({experienceLevel})
        </div>
        <div className="text-4xl font-extrabold text-[#FF6B2C] pt-2">
          {finalReport.overallScore}{" "}
          <span className="text-lg text-[#9CA3AF] font-normal">/ 10</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-5">
        {/* Executive Summary */}
        <div className="p-4 bg-[#0E1013] border border-[#2A2E35] rounded-lg text-xs text-[#F3F4F6] leading-relaxed">
          <span className="font-semibold text-[#FF6B2C] block mb-1">Executive Summary:</span>
          {finalReport.summary}
        </div>

        {/* Rounds Detailed Breakdown */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
            Rounds Detailed Recap
          </span>
          {finalReport.turns?.map((t, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-[#0E1013] border border-[#2A2E35] rounded-lg text-xs space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#FF6B2C]">
                  Round {t.turnNumber}: Score {t.score}/10
                </span>
                <Badge variant="outline" className="text-[10px] text-[#9CA3AF] border-[#2A2E35]">
                  {t.providerUsed}
                </Badge>
              </div>
              <div className="text-[#F3F4F6] font-medium">{t.question}</div>
              <div className="text-[#9CA3AF] text-[11px] pt-1">
                <strong className="text-emerald-400">Strengths:</strong> {t.strengths}
              </div>
              <div className="text-[#9CA3AF] text-[11px]">
                <strong className="text-amber-400">Blindspots:</strong> {t.blindspots}
              </div>
              <div className="text-[#9CA3AF] text-[11px]">
                <strong className="text-[#FF6B2C]">Staff Benchmark:</strong> {t.betterPhrasing}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Button
            onClick={exportScorecardMarkdown}
            variant="outline"
            className="flex-1 bg-[#1E2126] hover:bg-[#2A2E35] text-white border-[#2A2E35] text-xs h-10 gap-1.5"
          >
            <Download className="h-3.5 w-3.5 text-[#FF6B2C]" />
            Download Scorecard (.md)
          </Button>

          <Button
            onClick={copyShareText}
            variant="outline"
            className="flex-1 bg-[#1E2126] hover:bg-[#2A2E35] text-white border-[#2A2E35] text-xs h-10 gap-1.5"
          >
            {copiedShare ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5 text-[#FF6B2C]" />}
            {copiedShare ? "Copied!" : "Share Results"}
          </Button>

          <Button
            onClick={onReset}
            className="flex-1 bg-[#FF6B2C] hover:bg-[#FF5414] text-white text-xs h-10 font-semibold shadow-md shadow-orange-950/40 gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            New Interview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
