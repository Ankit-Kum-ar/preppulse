"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  ArrowRight,
  Code2,
  Server,
  Layers,
  Cpu,
  User,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

const PRIMARY_ROLES = [
  {
    id: "fullstack",
    name: "Full-Stack Developer",
    icon: Layers,
    desc: "React, Node.js, Next.js, DBs",
  },
  {
    id: "frontend",
    name: "Frontend Engineer",
    icon: Code2,
    desc: "React, TypeScript, CSS, Web APIs",
  },
  {
    id: "backend",
    name: "Backend & Systems",
    icon: Server,
    desc: "Node.js, Go/Java, Microservices, DBs",
  },
  {
    id: "ai_ml",
    name: "AI & Machine Learning",
    icon: Cpu,
    desc: "Python, LLMs, RAG, PyTorch",
  },
];

const SECONDARY_ROLES = [
  "DevOps & Cloud Infrastructure (Kubernetes, AWS)",
  "Data Engineer (Spark, Kafka, Pipelines)",
  "Mobile Engineer (React Native, Flutter, iOS)",
  "Cybersecurity & AppSec (Auth, OWASP)",
  "System Design & Distributed Architect",
];

const EXPERIENCE_LEVELS = [
  { id: "Junior", label: "Junior", subtitle: "0-2 YOE" },
  { id: "Mid-Level", label: "Mid-Level", subtitle: "2-5 YOE" },
  { id: "Senior", label: "Senior", subtitle: "5+ YOE" },
];

interface SetupCardProps {
  friendName: string;
  setFriendName: (val: string) => void;
  targetRole: string;
  setTargetRole: (val: string) => void;
  isCustomRole: boolean;
  setIsCustomRole: (val: boolean) => void;
  customRoleInput: string;
  setCustomRoleInput: (val: string) => void;
  experienceLevel: string;
  setExperienceLevel: (val: string) => void;
  loading: boolean;
  onStart: () => void;
}

export default function SetupCard({
  friendName,
  setFriendName,
  targetRole,
  setTargetRole,
  isCustomRole,
  setIsCustomRole,
  customRoleInput,
  setCustomRoleInput,
  experienceLevel,
  setExperienceLevel,
  loading,
  onStart,
}: SetupCardProps) {
  const [showSecondaryDropdown, setShowSecondaryDropdown] = useState(false);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#FF6B2C]/10 blur-3xl pointer-events-none rounded-full" />

      {/* Main Glass Panel */}
      <div className="relative border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60 space-y-6">
        {/* Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B2C] tracking-wide">
            <span>✦</span>
            <span>Adaptive Technical Interview Partner</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Customize Your 3-Round Mock Interview
          </h2>
          <p className="text-sm text-neutral-400">
            Tailor the session to your friend's target stack and experience level.
          </p>
        </div>

        {/* Candidate Name Input */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-300">
            Candidate / Friend Name <span className="text-[#FF6B2C]">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
            <Input
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              placeholder="e.g. Ankit, Sarah, or Alex"
              className="h-11 rounded-xl bg-neutral-950/80 border-neutral-800 pl-10 pr-3.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-[#FF6B2C] focus:ring-1 focus:ring-[#FF6B2C]/50 transition-all"
            />
          </div>
        </div>

        {/* Target Engineering Track */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-neutral-300">
              Target Engineering Track
            </label>
            <button
              type="button"
              onClick={() => {
                setIsCustomRole(!isCustomRole);
                setShowSecondaryDropdown(false);
              }}
              className="text-xs text-[#FF6B2C] hover:text-[#FF844B] transition-colors font-medium"
            >
              {isCustomRole ? "← Choose Primary Tracks" : "+ Custom Specialization"}
            </button>
          </div>

          {!isCustomRole ? (
            <div className="space-y-2.5">
              {/* 2x2 Primary Role Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRIMARY_ROLES.map((role) => {
                  const IconComp = role.icon;
                  const isSelected = targetRole === role.name && !isCustomRole;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        setTargetRole(role.name);
                        setShowSecondaryDropdown(false);
                      }}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "bg-orange-950/20 border-[#FF6B2C]/80 ring-1 ring-[#FF6B2C]/40 text-white shadow-sm"
                          : "bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/60 text-neutral-300"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          isSelected
                            ? "bg-[#281A12] text-[#FF6B2C]"
                            : "bg-neutral-900 text-neutral-400"
                        }`}
                      >
                        <IconComp className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-xs font-medium text-white truncate">
                          {role.name}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate">
                          {role.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Secondary Roles Accordion / Dropdown */}
              <div className="pt-1">
                {!showSecondaryDropdown ? (
                  <button
                    type="button"
                    onClick={() => setShowSecondaryDropdown(true)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-neutral-800/70 bg-neutral-950/40 hover:bg-neutral-950/70 text-xs text-neutral-400 hover:text-neutral-200 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="h-3.5 w-3.5 text-neutral-500" />
                      <span>Or choose other tracks (DevOps, Data, Security, Mobile...)</span>
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
                  </button>
                ) : (
                  <div className="space-y-1.5 p-3 rounded-xl border border-neutral-800 bg-neutral-950/80 animate-in fade-in-50 duration-200">
                    <div className="text-[11px] font-medium text-neutral-400 mb-1.5">
                      Select Specialized Track:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {SECONDARY_ROLES.map((secRole) => {
                        const isSelected = targetRole === secRole;
                        return (
                          <button
                            key={secRole}
                            type="button"
                            onClick={() => {
                              setTargetRole(secRole);
                              setShowSecondaryDropdown(false);
                            }}
                            className={`p-2 rounded-lg text-left text-xs transition-all truncate ${
                              isSelected
                                ? "bg-orange-950/30 text-[#FF6B2C] border border-[#FF6B2C]/40 font-medium"
                                : "text-neutral-300 hover:bg-neutral-900"
                            }`}
                          >
                            {secRole}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Input
                value={customRoleInput}
                onChange={(e) => setCustomRoleInput(e.target.value)}
                placeholder="e.g. Embedded Firmware Engineer (C/C++), Blockchain Solidity Dev, SRE..."
                className="h-11 rounded-xl bg-neutral-950/80 border-neutral-800 px-3.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-[#FF6B2C] focus:ring-1 focus:ring-[#FF6B2C]/50"
              />
              <p className="text-[11px] text-neutral-400">
                Gemma will dynamically construct realistic interview questions based on this exact specialization.
              </p>
            </div>
          )}
        </div>

        {/* Experience Level Segmented Control */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-300">
            Experience Level
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-neutral-950/80 border border-neutral-800">
            {EXPERIENCE_LEVELS.map((lvl) => {
              const isSelected = experienceLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setExperienceLevel(lvl.id)}
                  className={`py-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center justify-center ${
                    isSelected
                      ? "bg-[#1E2126] text-white shadow-sm border border-neutral-700/80"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <span className={isSelected ? "text-[#FF6B2C] font-semibold" : ""}>
                    {lvl.label}
                  </span>
                  <span className="text-[10px] text-neutral-500 mt-0.5">
                    {lvl.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={onStart}
          disabled={
            loading ||
            !friendName.trim() ||
            (isCustomRole && !customRoleInput.trim())
          }
          className="w-full mt-2 h-11 rounded-xl bg-[#FF6B2C] hover:bg-[#FF5414] text-white font-medium text-sm transition-all shadow-lg shadow-orange-950/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin" />
              Initializing Gemma Session...
            </>
          ) : (
            <>
              Start 3-Round Mock Interview
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
