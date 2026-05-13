import { CheckCircle, CheckSquare, Circle, Square, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import type { AnswerResult, Question } from "../types";
import { evaluateAnswer } from "../utils/questions";
import { CategoryBadge, DifficultyBadge, TypeBadge } from "./Badge";
import { RichText } from "./RichText";

function normalizeChoiceState(value: string, selectedChoices: string[]) {
  return selectedChoices.includes(value);
}

export function QuestionAttempt({
  question,
  onAnswered,
  showFeedback = true,
  submitLabel = "Submit Answer",
}: {
  question: Question;
  onAnswered?: (result: AnswerResult) => void;
  showFeedback?: boolean;
  submitLabel?: string;
}) {
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [shortAnswer, setShortAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<AnswerResult | null>(null);

  const canSubmit = useMemo(() => {
    if (question.type === "short_answer") {
      return shortAnswer.trim().length > 0;
    }

    return selectedChoices.length > 0;
  }, [question.type, selectedChoices.length, shortAnswer]);

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
      question.type === "short_answer" ? [shortAnswer] : selectedChoices;
    const isCorrect = evaluateAnswer(question, givenAnswer);
    const nextResult = { question, isCorrect, givenAnswer };

    setSubmitted(true);
    setResult(nextResult);
    onAnswered?.(nextResult);
  };

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
        {question.type === "short_answer" ? (
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-primary">
              Your answer
            </span>
            <textarea
              className="field min-h-28 resize-y"
              disabled={submitted}
              value={shortAnswer}
              onChange={(event) => setShortAnswer(event.target.value)}
              placeholder={
                question.tags.includes("rtl-coding")
                  ? "Write the RTL code or describe the key lines you would write."
                  : "Explain it the way you would in an interview."
              }
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
            {submitLabel}
          </button>
        ) : null}

        {submitted && result && !showFeedback ? (
          <div className="rounded-md border border-hairline bg-surface-soft px-4 py-3 text-sm font-semibold text-body">
            Response recorded.
          </div>
        ) : null}

        {submitted && result && showFeedback ? (
          <div
            className={`space-y-4 rounded-lg border px-4 py-4 ${
              result.isCorrect
                ? "border-emerald-100 bg-emerald-50"
                : "border-rose-100 bg-rose-50"
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              {result.isCorrect ? (
                <CheckCircle className="text-emerald-700" size={18} />
              ) : (
                <XCircle className="text-rose-700" size={18} />
              )}
              <span className={result.isCorrect ? "text-ink-950" : "text-rose-700"}>
                {result.isCorrect ? "Correct" : "Review this one"}
              </span>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-ink-950">
                  Correct answer
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
              <h3 className="text-sm font-semibold text-ink-950">Explanation</h3>
              <RichText
                text={question.explanation}
                textClassName="text-sm leading-6 text-ink-700"
              />
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
