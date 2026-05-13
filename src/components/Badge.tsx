import type { Difficulty, QuestionType } from "../types";
import { formatDifficulty, formatQuestionType } from "../utils/questions";

const difficultyStyles: Record<Difficulty, string> = {
  easy: "bg-emerald-100 text-ink-950",
  medium: "bg-orange-100 text-ink-950",
  hard: "bg-rose-100 text-ink-950",
};

const typeStyles: Record<QuestionType, string> = {
  single_choice: "bg-surface-card text-primary",
  multi_select: "bg-violet-100 text-ink-950",
  short_answer: "bg-amber-100 text-ink-950",
  coding: "bg-sky-100 text-ink-950",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`badge-pill ${difficultyStyles[difficulty]}`}
    >
      {formatDifficulty(difficulty)}
    </span>
  );
}

export function TypeBadge({ type }: { type: QuestionType }) {
  return (
    <span
      className={`badge-pill ${typeStyles[type]}`}
    >
      {formatQuestionType(type)}
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="badge-pill bg-surface-card text-primary">
      {category}
    </span>
  );
}
