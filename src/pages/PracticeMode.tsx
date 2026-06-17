import { ArrowRight, BookOpen, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { QuestionAttempt } from "../components/QuestionAttempt";
import { ProgressBar } from "../components/ProgressBar";
import type { AnswerResult, Difficulty, Question } from "../types";
import {
  categories,
  difficulties,
  filterQuestions,
  formatDifficulty,
  isSelfReviewedQuestion,
  shuffleQuestions,
} from "../utils/questions";
import { addReviewItem, recordAttempt, recordSelfReviewMiss } from "../utils/storage";

export function PracticeMode({
  onReviewItemsChanged,
}: {
  onReviewItemsChanged: () => void;
}) {
  const [category, setCategory] = useState(categories[0] ?? "");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [practiceRunId, setPracticeRunId] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastResult, setLastResult] = useState<AnswerResult | null>(null);

  const availableQuestions = useMemo(
    () => filterQuestions({ category, difficulty }),
    [category, difficulty],
  );

  const activeQuestion = sessionQuestions[currentIndex];
  const isComplete =
    sessionQuestions.length > 0 && currentIndex >= sessionQuestions.length;

  const startSession = () => {
    setSessionQuestions(shuffleQuestions(availableQuestions));
    setCurrentIndex(0);
    setLastResult(null);
    setPracticeRunId((id) => id + 1);
  };

  const handleAnswered = (result: AnswerResult) => {
    setLastResult(result);
    recordAttempt(result);

    if (result.isCorrect === false) {
      addReviewItem(result.question.id);
    }

    onReviewItemsChanged();
  };

  const handleSaveForReview = (result: AnswerResult) => {
    if (!isSelfReviewedQuestion(result.question)) {
      return;
    }

    addReviewItem(result.question.id);
    recordSelfReviewMiss(result);
    onReviewItemsChanged();
  };

  const nextQuestion = () => {
    setCurrentIndex((index) => index + 1);
    setLastResult(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="panel h-fit p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-canvas text-primary">
          <BookOpen size={22} aria-hidden="true" />
        </div>
        <h2 className="display-heading mt-4 text-[28px] leading-tight">
          Practice setup
        </h2>
        <p className="mt-2 text-sm leading-6 text-body">
          Select an interview area and difficulty, then work through the
          shuffled set one question at a time.
        </p>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-normal text-muted">
              Category
            </span>
            <select
              className="field"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-normal text-muted">
              Difficulty
            </span>
            <select
              className="field"
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as Difficulty)}
            >
              {difficulties.map((item) => (
                <option key={item} value={item}>
                  {formatDifficulty(item)}
                </option>
              ))}
            </select>
          </label>

          <div className="product-panel px-3 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-body">
              <SlidersHorizontal size={16} aria-hidden="true" />
              {availableQuestions.length} questions available
            </div>
          </div>

          <button
            className="button-primary w-full"
            disabled={availableQuestions.length === 0}
            onClick={startSession}
            type="button"
          >
            <RotateCcw size={17} aria-hidden="true" />
            Start Practice Set
          </button>
        </div>
      </aside>

      <main className="space-y-4">
        {sessionQuestions.length === 0 ? (
          <div className="panel p-8">
            <h2 className="display-heading text-[28px] leading-tight">
              Ready when you are
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-body">
              Practice mode shows feedback immediately, including the correct
              answer, explanation, and a concise interview-style oral answer.
              Responses that need another pass are kept as local review items.
            </p>
          </div>
        ) : null}

        {isComplete ? (
          <div className="panel p-8">
            <h2 className="display-heading text-[28px] leading-tight">
              Practice set complete
            </h2>
            <p className="mt-2 text-sm leading-6 text-body">
              You finished {sessionQuestions.length} questions in {category} at{" "}
              {formatDifficulty(difficulty)} difficulty.
            </p>
            <button
              className="button-primary mt-5"
              onClick={startSession}
              type="button"
            >
              <RotateCcw size={17} aria-hidden="true" />
              Restart Set
            </button>
          </div>
        ) : null}

        {activeQuestion ? (
          <>
            <div className="product-panel p-4">
              <ProgressBar
                label={`Question ${currentIndex + 1} of ${sessionQuestions.length}`}
                value={currentIndex + 1}
                max={sessionQuestions.length}
              />
            </div>
            <QuestionAttempt
              key={`${practiceRunId}-${activeQuestion.id}`}
              question={activeQuestion}
              onAnswered={handleAnswered}
              onSaveForReview={handleSaveForReview}
            />
            {lastResult ? (
              <button
                className="button-primary"
                onClick={nextQuestion}
                type="button"
              >
                Next Question
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            ) : null}
          </>
        ) : null}
      </main>
    </div>
  );
}
