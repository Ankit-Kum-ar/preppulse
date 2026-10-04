"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import { PastSessionItem } from "@/types/interview";

interface PastSessionsViewProps {
  pastSessions: PastSessionItem[];
}

export default function PastSessionsView({
  pastSessions,
}: PastSessionsViewProps) {
  return (
    <Card className="bg-[#141619] border-[#2A2E35] text-[#F3F4F6] shadow-xl animate-in fade-in-50">
      <CardHeader className="pb-3 border-b border-[#2A2E35]">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <History className="h-4 w-4 text-[#FF6B2C]" />
            Recent Mock Interview Sessions
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {pastSessions.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#9CA3AF]">
            No past sessions recorded yet. Start your first mock interview!
          </div>
        ) : (
          pastSessions.map((s, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-[#0E1013] border border-[#2A2E35] rounded-lg text-xs flex justify-between items-center hover:border-[#FF6B2C]/40 transition-colors"
            >
              <div className="space-y-1 max-w-[500px]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">
                    {s.friendName}
                  </span>
                  <span className="text-[#9CA3AF]">•</span>
                  <span className="text-[#FF6B2C] font-medium">
                    {s.targetRole}
                  </span>
                  <span className="text-[10px] text-[#9CA3AF]">
                    ({s.experienceLevel})
                  </span>
                </div>
                <p className="text-[#9CA3AF] truncate text-[11px]">
                  {s.summary || "In progress session"}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Badge className="bg-[#281A12] text-[#FF6B2C] border border-[#FF6B2C]/30 font-bold px-2.5 py-1">
                  {s.overallScore !== null ? `${s.overallScore}/10` : "Active"}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
