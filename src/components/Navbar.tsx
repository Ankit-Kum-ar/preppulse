"use client";

import { useState } from "react";
import {
  Flame,
  History,
  Info,
  Menu,
  X,
  Cpu,
  Database,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onOpenHistory: () => void;
  onNewInterview: () => void;
  activeScreen: "setup" | "interview" | "final";
  showHistory: boolean;
}

export default function Navbar({
  onOpenHistory,
  onNewInterview,
  activeScreen,
  showHistory,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showArchModal, setShowArchModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#2A2E35] bg-[#0B0C0E]/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={onNewInterview}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#FF6B2C] to-[#E04800] p-0.5 shadow-md shadow-orange-950/50 flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="h-full w-full bg-[#141619] rounded-[10px] flex items-center justify-center">
                <Flame className="h-5 w-5 text-[#FF6B2C] fill-[#FF6B2C]/20" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-[#FF6B2C] transition-colors">
                  PrepPulse
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#281A12] text-[#FF6B2C] border border-[#FF6B2C]/30 uppercase tracking-wide">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-[#9CA3AF] hidden sm:block">
                Adaptive Gemma Interview Partner
              </p>
            </div>
          </div>

          {/* Center: Live Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#141619] border border-[#2A2E35] text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[#9CA3AF] text-[11px]">
              Engine:{" "}
              <strong className="text-white font-medium">
                Google Gemma 2 27B
              </strong>{" "}
              (Backboard)
            </span>
          </div>

          {/* Desktop Right Navigation */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowArchModal(true)}
              className="text-[#9CA3AF] hover:text-white hover:bg-[#1E2126] text-xs h-9 gap-1.5"
            >
              <Info className="h-3.5 w-3.5 text-[#FF6B2C]" />
              Architecture
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenHistory}
              className={`text-xs h-9 gap-1.5 transition-all ${
                showHistory
                  ? "bg-[#281A12] text-[#FF6B2C] border border-[#FF6B2C]/30"
                  : "text-[#9CA3AF] hover:text-white hover:bg-[#1E2126]"
              }`}
            >
              <History className="h-3.5 w-3.5 text-[#FF6B2C]" />
              Past Sessions
            </Button>

            <Button
              onClick={onNewInterview}
              size="sm"
              className="bg-[#FF6B2C] hover:bg-[#FF5414] text-white text-xs h-9 font-semibold shadow-md shadow-orange-950/40 gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              New Mock Interview
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#1E2126] transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-[#2A2E35] bg-[#141619] px-4 py-3 space-y-2 animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2 px-2.5 py-2 text-xs text-[#9CA3AF] bg-[#0E1013] rounded-md border border-[#2A2E35]">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Gemma 2 27B + Backboard Active</span>
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                onOpenHistory();
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start text-xs text-[#F3F4F6] hover:bg-[#1E2126] gap-2 h-10"
            >
              <History className="h-4 w-4 text-[#FF6B2C]" />
              Past Sessions
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                setShowArchModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full justify-start text-xs text-[#F3F4F6] hover:bg-[#1E2126] gap-2 h-10"
            >
              <Info className="h-4 w-4 text-[#FF6B2C]" />
              System Architecture & Docs
            </Button>

            <Button
              onClick={() => {
                onNewInterview();
                setMobileMenuOpen(false);
              }}
              className="w-full justify-center text-xs bg-[#FF6B2C] hover:bg-[#FF5414] text-white font-semibold h-10 gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Start New Mock Interview
            </Button>
          </div>
        )}
      </header>

      {/* Architecture Modal */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in-50">
          <div className="bg-[#141619] border border-[#2A2E35] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#2A2E35] pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-[#FF6B2C]" />
                <h3 className="font-bold text-white text-base">
                  PrepPulse Architecture
                </h3>
              </div>
              <button
                onClick={() => setShowArchModal(false)}
                className="text-[#9CA3AF] hover:text-white p-1 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#9CA3AF] leading-relaxed">
              <div className="p-3 bg-[#0E1013] rounded-lg border border-[#2A2E35] space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Sparkles className="h-4 w-4 text-[#FF6B2C]" />
                  Google Gemma Models
                </div>
                <p>
                  Evaluates technical communication, edge-case coverage, and
                  architectural trade-offs using Gemma 2 27B / 9B.
                </p>
              </div>

              <div className="p-3 bg-[#0E1013] rounded-lg border border-[#2A2E35] space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Flame className="h-4 w-4 text-[#FF6B2C]" />
                  Backboard Inference Gateway
                </div>
                <p>
                  Low-latency gateway orchestrating assistant threads and
                  persistent conversational state.
                </p>
              </div>

              <div className="p-3 bg-[#0E1013] rounded-lg border border-[#2A2E35] space-y-1.5">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Database className="h-4 w-4 text-[#FF6B2C]" />
                  MongoDB Atlas
                </div>
                <p>
                  Unified document store persisting interview sessions,
                  multi-turn scorecards, and candidate analytics.
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowArchModal(false)}
              className="w-full bg-[#1E2126] hover:bg-[#2A2E35] text-white border border-[#2A2E35] text-xs h-9"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
