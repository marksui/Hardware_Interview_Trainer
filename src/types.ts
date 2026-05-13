export type Difficulty = "easy" | "medium" | "hard";

export type QuestionType = "single_choice" | "multi_select" | "short_answer" | "coding";

export interface Question {
  id: string;
  category: string;
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  choices?: string[];
  answer: string[];
  explanation: string;
  interview_answer: string;
  tags: string[];
}

export interface AnswerResult {
  question: Question;
  isCorrect: boolean | null;
  givenAnswer: string[];
  savedForReview?: boolean;
}

export interface AnalyticsBucket {
  attempted: number;
  correct: number;
  missed: number;
}

export interface AnalyticsState {
  totalAttempted: number;
  totalCorrect: number;
  totalMissed: number;
  byCategory: Record<string, AnalyticsBucket>;
  byDifficulty: Record<Difficulty, AnalyticsBucket>;
}

export type ThemePreference = "light" | "dark";

export interface ProgressExport {
  app: "Hardware Interview Trainer";
  version: 1;
  appVersion: string;
  exportedAt: string;
  wrongQuestions: string[];
  analytics: AnalyticsState;
  theme?: ThemePreference;
}
