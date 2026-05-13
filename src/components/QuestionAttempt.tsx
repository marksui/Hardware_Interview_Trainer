import {
  BookOpenCheck,
  CheckCircle,
  CheckSquare,
  Circle,
  Square,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { AnswerResult, Question } from "../types";
import { evaluateAnswer, isSelfReviewedQuestion } from "../utils/questions";
import { CategoryBadge, DifficultyBadge, TypeBadge } from "./Badge";
import { RichText } from "./RichText";

function normalizeChoiceState(value: string, selectedChoices: string[]) {
  return selectedChoices.includes(value);
}

export function QuestionAttempt({
  question,
  onAnswered,
  onSaveForReview,
  showFeedback = true,
  submitLabel = "Submit Answer",
}: {
  question: Question;
  onAnswered?: (result: AnswerResult) => void;
  onSaveForReview?: (result: AnswerResult) => void;
  showFeedback?: boolean;
  submitLabel?: string;
}) {
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [shortAnswer, setShortAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [savedForReview, setSavedForReview] = useState(false);
  const selfReviewed = isSelfReviewedQuestion(question);

  const canSubmit = useMemo(() => {
    if (selfReviewed) {
      return shortAnswer.trim().length > 0;
    }

    return selectedChoices.length > 0;
  }, [selfReviewed, selectedChoices.length, shortAnswer]);

  const toggleChoice = (choice: string) => {
    if (submitted) {
      return;
    }

    if (question.type === "single_choice") {
      setSelectedChoices([choice]);
      return;
    }

    setSelectedChoices((currentChoices) =>
      currentChoices.includes(choice)
        ? currentChoices.filter((currentChoice) => currentChoice !== choice)
        : [...currentChoices, choice],
    );
  };

  const handleSubmit = () => {
    const givenAnswer =
      selfReviewed ? [shortAnswer] : selectedChoices;
    const isCorrect = evaluateAnswer(question, givenAnswer);
    const nextResult = { question, isCorrect, givenAnswer };

    setSubmitted(true);
    setResult(nextResult);
    onAnswered?.(nextResult);
  };

  const handleSaveForReview = () => {
    if (!result || savedForReview) {
      return;
    }

    const savedResult = { ...result, savedForReview: true };
    setResult(savedResult);
    setSavedForReview(true);
    onSaveForReview?.(savedResult);
  };

  const answerTitle =
    question.type === "coding"
      ? "Reference checklist"
      : selfReviewed
        ? "Suggested answer"
        : "Correct answer";
  const explanationTitle =
    question.type === "coding" ? "Reference implementation" : "Explanation";
  const effectiveSubmitLabel =
    selfReviewed && submitLabel === "Submit Answer"
      ? "Show Suggested Answer"
      : submitLabel;
  const textareaLabel =
    question.type === "coding" ? "Your RTL / code" : "Your answer";
  const textareaPlaceholder =
    question.type === "coding"
      ? question.category === "Verilog Coding"
        ? "Write Verilog-2001 RTL using reg/wire and always @ blocks."
        : "Write SystemVerilog RTL using logic, always_ff, or always_comb where appropriate."
      : "Explain it the way you would in an interview.";

  return (
    <article className="product-panel overflow-hidden">
      <div className="border-b border-hairline bg-canvas px-6 py-5">
        <div className="flex flex-wrap gap-2">
          <CategoryBadge category={question.category} />
          <DifficultyBadge difficulty={question.difficulty} />
          <TypeBadge type={question.type} />
        </div>
        <div className="mt-4">
          <RichText
            text={question.question}
            textClassName="display-heading text-[28px] leading-tight"
          />
        </div>
      </div>

      <div className="space-y-4 px-6 py-6">
        {selfReviewed ? (
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-primary">
              {textareaLabel}
            </span>
            <textarea
              className="field min-h-28 resize-y"
              disabled={submitted}
              value={shortAnswer}
              onChange={(event) => setShortAnswer(event.target.value)}
              placeholder={textareaPlaceholder}
            />
          </label>
        ) : (
          <div className="space-y-2">
            {question.choices?.map((choice) => {
              const isSelected = normalizeChoiceState(choice, selectedChoices);
              const ChoiceIcon =
                question.type === "single_choice"
                  ? isSelected
                    ? CheckCircle
                    : Circle
                  : isSelected
                    ? CheckSquare
                    : Square;

              return (
                <button
                  className={`flex w-full items-start gap-3 rounded-md border px-3 py-3 text-left text-sm transition ${
                    isSelected
                      ? "border-action bg-action text-on-action"
                      : "border-hairline bg-canvas text-body"
                  }`}
                  disabled={submitted}
                  key={choice}
                  onClick={() => toggleChoice(choice)}
                  type="button"
                >
                  <ChoiceIcon
                    className={isSelected ? "text-on-action" : "text-muted"}
                    size={18}
                    aria-hidden="true"
                  />
                  <span>{choice}</span>
                </button>
              );
            })}
          </div>
        )}

        {!submitted ? (
          <button
            className="button-primary"
            disabled={!canSubmit}
            onClick={handleSubmit}
            type="button"
          >
            {effectiveSubmitLabel}
          </button>
        ) : null}

        {submitted && result && !showFeedback ? (
          <div className="rounded-md border border-hairline bg-surface-soft px-4 py-3 text-sm font-semibold text-body">
            {selfReviewed
              ? "Response recorded. Review the suggested answer at the end."
              : "Response recorded."}
          </div>
        ) : null}

        {submitted && result && showFeedback ? (
          <div
            className={`space-y-4 rounded-lg border px-4 py-4 ${
              result.isCorrect === null
                ? "border-hairline bg-surface-soft"
                : result.isCorrect
                ? "border-emerald-100 bg-emerald-50"
                : "border-rose-100 bg-rose-50"
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              {result.isCorrect === null ? (
                <BookOpenCheck className="text-primary" size={18} />
              ) : result.isCorrect ? (
                <CheckCircle className="text-emerald-700" size={18} />
              ) : (
                <XCircle className="text-rose-700" size={18} />
              )}
              <span
                className={
                  result.isCorrect === null
                    ? "text-primary"
                    : result.isCorrect
                      ? "text-ink-950"
                      : "text-rose-700"
                }
              >
                {result.isCorrect === null
                  ? "Self review"
                  : result.isCorrect
                    ? "Correct"
                    : "Review this one"}
              </span>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-ink-950">
                  {answerTitle}
                </h3>
                <RichText
                  text={question.answer.join("; ")}
                  textClassName="text-sm leading-6 text-ink-700"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink-950">
                  Oral answer
                </h3>
                <RichText
                  text={question.interview_answer}
                  textClassName="text-sm leading-6 text-ink-700"
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink-950">
                {explanationTitle}
              </h3>
              <RichText
                text={question.explanation}
                textClassName="text-sm leading-6 text-ink-700"
              />
            </div>
            {result.isCorrect === null && onSaveForReview ? (
              <button
                className="button-secondary w-fit border-rose-100 bg-rose-50 text-ink-950"
                disabled={savedForReview}
                onClick={handleSaveForReview}
                type="button"
              >
                <TriangleAlert size={16} aria-hidden="true" />
                {savedForReview ? "Saved to Wrong Questions" : "Save to Wrong Questions"}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
