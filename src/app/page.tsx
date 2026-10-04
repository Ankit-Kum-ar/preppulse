"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import Navbar from "@/components/layout/Navbar";
import SetupCard from "@/components/interview/SetupCard";
import InterviewWorkspace from "@/components/interview/InterviewWorkspace";
import FinalDebriefCard from "@/components/interview/FinalDebriefCard";
import PastSessionsView from "@/components/interview/PastSessionsView";
import { TurnEvaluation, FinalReport, PastSessionItem } from "@/types/interview";

export default function Home() {
  const [screen, setScreen] = useState<"setup" | "interview" | "final">("setup");
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [pastSessions, setPastSessions] = useState<PastSessionItem[]>([]);

  // Setup state
  const [friendName, setFriendName] = useState("");
  const [targetRole, setTargetRole] = useState("Full-Stack Web Developer");
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Mid-Level");

  // Interview state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [question, setQuestion] = useState("");
  const [isCodeQuestion, setIsCodeQuestion] = useState(false);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<TurnEvaluation | null>(null);
  const [finalReport, setFinalReport] = useState<FinalReport | null>(null);

  // Live Stopwatch
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/interview/history");
      const data = await res.json();
      if (data.success) {
        setPastSessions(data.sessions || []);
      }
    } catch (e) {
      console.error("Failed to fetch past sessions:", e);
    }
  };

  const selectedRoleString = isCustomRole ? customRoleInput : targetRole;

  const handleResetToSetup = () => {
    setScreen("setup");
    setShowHistory(false);
    setSessionId(null);
    setEvaluation(null);
    setFinalReport(null);
    setAnswer("");
    setSecondsElapsed(0);
    setTimerActive(false);
  };

  async function handleStart() {
    const activeRole = selectedRoleString.trim();
    if (!friendName.trim() || !activeRole) return;
    setLoading(true);
    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          friendName: friendName.trim(),
          targetRole: activeRole,
          experienceLevel,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSessionId(data.sessionId);
        setQuestion(data.question);
        setIsCodeQuestion(Boolean(data.isCodeQuestion));
        setCurrentTurn(1);
        setShowHistory(false);
        setScreen("interview");
        setSecondsElapsed(0);
        setTimerActive(true);
      }
    } catch (err) {
      console.error("Failed to start session:", err);
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
          targetRole: selectedRoleString,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEvaluation(data.evaluation);
      }
    } catch (err) {
      console.error("Failed to submit answer:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleNextRound() {
    if (currentTurn >= 3) {
      setLoading(true);
      setTimerActive(false);
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
          confetti({
            particleCount: 140,
            spread: 90,
            origin: { y: 0.6 },
            colors: ["#FF6B2C", "#FFA26B", "#FFFFFF", "#141619", "#38BDF8"],
          });
        }
      } catch (err) {
        console.error("Failed to finish session:", err);
      } finally {
        setLoading(false);
      }
    } else {
      if (evaluation?.next_question) {
        setQuestion(evaluation.next_question);
        setIsCodeQuestion(Boolean(evaluation.isCodeQuestion));
      }
      setCurrentTurn((prev) => prev + 1);
      setAnswer("");
      setEvaluation(null);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-200">
      {/* Top Floating Sticky Navbar - Only shown during initial setup */}
      {screen === "setup" && (
        <Navbar
          showHistory={showHistory}
          onOpenHistory={() => {
            setShowHistory(!showHistory);
            if (!showHistory) fetchHistory();
          }}
        />
      )}

      {/* Main Workspace Area */}
      <main
        className={`flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 ${
          screen === "setup" ? "pt-28 sm:pt-36" : "pt-8 sm:pt-12"
        } pb-24 flex flex-col items-center`}
      >
        <div className="w-full space-y-6">
          {/* PAST SESSIONS MODAL/VIEW */}
          {showHistory && screen === "setup" && (
            <PastSessionsView pastSessions={pastSessions} />
          )}

          {/* 1. Setup Screen */}
          {!showHistory && screen === "setup" && (
            <SetupCard
              friendName={friendName}
              setFriendName={setFriendName}
              targetRole={targetRole}
              setTargetRole={setTargetRole}
              isCustomRole={isCustomRole}
              setIsCustomRole={setIsCustomRole}
              customRoleInput={customRoleInput}
              setCustomRoleInput={setCustomRoleInput}
              experienceLevel={experienceLevel}
              setExperienceLevel={setExperienceLevel}
              loading={loading}
              onStart={handleStart}
            />
          )}

          {/* 2. Active Interview Screen */}
          {screen === "interview" && (
            <InterviewWorkspace
              currentTurn={currentTurn}
              question={question}
              isCodeQuestion={isCodeQuestion}
              answer={answer}
              setAnswer={setAnswer}
              selectedRoleString={selectedRoleString}
              experienceLevel={experienceLevel}
              secondsElapsed={secondsElapsed}
              formatTimer={formatTimer}
              loading={loading}
              evaluation={evaluation}
              onSubmitTurn={handleSubmitTurn}
              onNextRound={handleNextRound}
            />
          )}

          {/* 3. Final Debrief Summary Screen */}
          {screen === "final" && finalReport && (
            <FinalDebriefCard
              friendName={friendName}
              selectedRoleString={selectedRoleString}
              experienceLevel={experienceLevel}
              finalReport={finalReport}
              onReset={handleResetToSetup}
            />
          )}
        </div>
      </main>
    </div>
  );
}
