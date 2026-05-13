import { CheckCircle, RotateCcw, Trash2, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { CategoryBadge, DifficultyBadge, TypeBadge } from "../components/Badge";
import { EmptyState } from "../components/EmptyState";
import { QuestionAttempt } from "../components/QuestionAttempt";
import type { AnswerResult, Question } from "../types";
import { getQuestionById } from "../utils/questions";
import { recordAttempt, removeWrongQuestion } from "../utils/storage";

export function WrongQuestions({
  wrongIds,
  onWrongChanged,
  navigate,
}: {
  wrongIds: string[];
  onWrongChanged: () => void;
  navigate: (page: string) => void;
}) {
  const [retryId, setRetryId] = useState<string | null>(null);
  const [passedRetryIds, setPassedRetryIds] = useState<string[]>([]);

  const wrongQuestions = useMemo(
    () =>
      wrongIds
        .map((id) => getQuestionById(id))
        .filter((question): question is Question => Boolean(question)),
    [wrongIds],
  );

  const handleRemove = (id: string) => {
    removeWrongQuestion(id);
    onWrongChanged();
    setRetryId((currentId) => (currentId === id ? null : currentId));
  };

  const handleAnswered = (result: AnswerResult) => {
    recordAttempt(result);
    onWrongChanged();

    if (result.isCorrect === true) {
      setPassedRetryIds((ids) => Array.from(new Set([...ids, result.question.id])));
    }
  };

  if (!wrongQuestions.length) {
    return (
      <EmptyState
        icon={CheckCircle}
        title="No wrong questions saved"
        description="Missed practice and mock interview questions will appear here automatically for focused review."
        action={
          <button
            className="button-primary"
            onClick={() => navigate("practice")}
            type="button"
          >
            Start Practice
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="panel p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="display-heading text-[28px] leading-tight">
              Review queue
            </h2>
            <p className="mt-2 text-sm text-body">
              Retry a question, then remove it once you are comfortable with the
              explanation and oral answer.
            </p>
          </div>
          <div className="badge-pill gap-2 bg-rose-100 text-ink-950">
            <TriangleAlert size={16} aria-hidden="true" />
            {wrongQuestions.length} saved
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {wrongQuestions.map((question) => (
          <article className="product-panel overflow-hidden" key={question.id}>
            <div className="px-5 py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <CategoryBadge category={question.category} />
                    <DifficultyBadge difficulty={question.difficulty} />
                    <TypeBadge type={question.type} />
                    {passedRetryIds.includes(question.id) ? (
                      <span className="badge-pill bg-emerald-100 text-ink-950">
                        Correct on retry
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 text-base font-semibold leading-7 text-primary">
                    {question.question}
                  </h3>
                  <p className="mt-2 font-code text-xs font-semibold text-muted">
                    {question.id}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="button-secondary px-3 py-2"
                    onClick={() =>
                      setRetryId((currentId) =>
                        currentId === question.id ? null : question.id,
                      )
                    }
                    type="button"
                  >
                    <RotateCcw size={16} aria-hidden="true" />
                    Retry
                  </button>
                  <button
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-semibold leading-none text-ink-950"
                    onClick={() => handleRemove(question.id)}
                    type="button"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {retryId === question.id ? (
              <div className="border-t border-hairline bg-surface-soft p-4">
                <QuestionAttempt
                  key={`retry-${question.id}`}
                  question={question}
                  onAnswered={handleAnswered}
                  submitLabel="Submit Retry"
                />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
