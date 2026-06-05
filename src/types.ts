export interface Question {
  id: string;
  title: string;
  content: string; // LaTeX-supported math question text
  difficulty: "준킬러" | "킬러" | "기본";
  options: string[]; // 5-choice items
  correctAnswer: number; // 0-4 index
  explanation: string;
  isAiGenerated: boolean;
  originalQuestionId?: string | null;
}

export interface Player {
  uuid: string;
  nickname: string;
  score: number;
  lastScoreAdded: number;
  streak: number;
  isSubmitted: boolean;
  lastAnswerIndex: number;
  rankChange: number; // e.g. +1, -1, 0
  isDisconnected: boolean;
}

export type GameStatus = "LOBBY" | "INTRO" | "PLAY" | "REVEAL" | "LEADERBOARD" | "PODIUM";

export interface GameSession {
  pin: string;
  status: GameStatus;
  currentQuestionIndex: number;
  questions: Question[];
  players: Player[];
  timerSeconds: number;
  totalDuration: number;
}

export interface BannerCheer {
  nickname: string;
  score: number;
  cheer: string;
}
