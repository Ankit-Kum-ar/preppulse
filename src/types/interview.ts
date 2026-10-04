export interface TurnEvaluation {
  score: number;
  strengths: string;
  blindspots: string;
  better_phrasing: string;
  next_question?: string;
  isCodeQuestion?: boolean;
}

export interface SessionTurn {
  turnNumber: number;
  question: string;
  userAnswer: string;
  score: number;
  strengths: string;
  blindspots: string;
  betterPhrasing: string;
  providerUsed: string;
  createdAt?: string;
}

export interface FinalReport {
  success: boolean;
  sessionId: string;
  friendName: string;
  targetRole: string;
  overallScore: number;
  summary: string;
  turns: SessionTurn[];
}

export interface PastSessionItem {
  sessionId: string;
  friendName: string;
  targetRole: string;
  experienceLevel: string;
  overallScore: number | null;
  isCompleted: boolean;
  summary: string | null;
  turnsCount: number;
  createdAt: string;
}
