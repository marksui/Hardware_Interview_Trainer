import { AlarmClock, ArrowRight, CheckCircle, RotateCcw, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CategoryBadge } from "../components/Badge";
import { EmptyState } from "../components/EmptyState";
import { ProgressBar } from "../components/ProgressBar";
import { QuestionAttempt } from "../components/QuestionAttempt";
import type { AnswerResult, Question } from "../types";
import { questions, shuffleQuestions } from "../utils/questions";
import { addWrongQuestion, recordAttempt } from "../utils/storage";

const MOCK_QUESTION_COUNT = 10;
const MOCK_DURATION_SECONDS = 15 * 60;

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function summarizeWeakCategories(
  mockQuestions: Question[],
  answers: Record<string, AnswerResult>,
) {
  const weakCounts = mockQuestions.reduce<Record<string, number>>((counts, question) => {
    if (!answers[question.id]?.isCorrect) {
      counts[question.category] = (counts[question.category] ?? 0) + 1;
    }

    return counts;
  }, {});

  return Object.entries(weakCounts)
    .sort(([, leftCount], [, rightCount]) => rightCount - leftCount)
    .map(([category, count]) => ({ category, count }));
}

export function MockInterviewMode({
  onWrongChanged,
}: {
  onWrongChanged: () => void;
}) {
  const [sessionId, setSessionId] = useState(0);
  const [mockQuestions, setMockQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerResult>>({});
  const [timeRemaining, setTimeRemaining] = useState(MOCK_DURATION_SECONDS);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const activeQuestion = mockQuestions[currentIndex];
  const currentAnswer = activeQuestion ? answers[activeQuestion.id] : undefined;
  const correctCount = Object.values(answers).filter((answer) => answer.isCorrect).length;
  const weakCategories = useMemo(
    () => summarizeWeakCategories(mockQuestions, answers),
    [answers, mockQuestions],
  );

  const finishMock = (answerState = answers) => {
    mockQuestions.forEach((question) => {
      if (!answerState[question.id]?.isCorrect) {
        addWrongQuestion(question.id);
      }
    });
    onWrongChanged();
    setIsActive(false);
    setIsFinished(true);
  };

  useEffect(() => {
    if (!isActive || isFinished) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeRemaining((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isActive, isFinished]);

  useEffect(() => {
    if (isActive && !isFinished && timeRemaining === 0) {
      finishMock();
    }
  }, [isActive, isFinished, timeRemaining, answers, mockQuestions]);

  const startMock = () => {
    setMockQuestions(shuffleQuestions(questions).slice(0, MOCK_QUESTION_COUNT));
    setAnswers({});
    setCurrentIndex(0);
    setTimeRemaining(MOCK_DURATION_SECONDS);
    setIsActive(true);
    setIsFinished(false);
    setSessionId((id) => id + 1);
  };

  const handleAnswered = (result: AnswerResult) => {
    const nextAnswers = { ...answers, [result.question.id]: result };

    setAnswers(nextAnswers);
    recordAttempt(result);

    if (!result.isCorrect) {
      addWrongQuestion(result.question.id);
    }

    onWrongChanged();
  };

  const advance = () => {
    if (currentIndex === mockQuestions.length - 1) {
      finishMock();
      return;
    }

    setCurrentIndex((index) => index + 1);
  };

  if (isFinished) {
    return (
      <div className="space-y-5">
        <section className="panel p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-canvas text-primary">
                <Trophy size={24} aria-hidden="true" />
              </div>
              <h2 className="display-heading mt-4 text-4xl leading-tight">
                Mock interview complete
              </h2>
              <p className="mt-2 text-sm leading-6 text-body">
                Score: {correctCount} / {mockQuestions.length} correct.
              </p>
            </div>
            <div className="w-full max-w-sm">
              <ProgressBar
                label={`${Math.round((correctCount / mockQuestions.length) * 100)}% score`}
                value={correctCount}
                max={mockQuestions.length}
              />
              <button
                className="button-primary mt-5 w-full"
                onClick={startMock}
                type="button"
              >
                <RotateCcw size={17} aria-hidden="true" />
                Start New Mock
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <div className="panel h-fit p-6">
            <h3 className="display-heading text-[28px] leading-tight">
              Weak categories
            </h3>
            <div className="mt-4 space-y-3">
              {weakCategories.length ? (
                weakCategories.map((item) => (
                  <div
                    className="product-panel p-3"
                    key={item.category}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-primary">
                        {item.category}
                      </span>
                      <span className="text-sm font-semibold text-error">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-body">
                  No weak categories this round.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {mockQuestions.map((question, index) => {
              const result = answers[question.id];

              return (
                <div className="product-panel p-4" key={question.id}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <CategoryBadge category={question.category} />
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-semibold ${
                            result?.isCorrect
                              ? "bg-emerald-100 text-ink-950"
                              : "bg-rose-100 text-ink-950"
                          }`}
                        >
                          {result?.isCorrect ? "Correct" : "Missed"}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-semibold leading-6 text-primary">
                        {index + 1}. {question.question}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 lg:grid-cols-2">
                    <p className="text-sm leading-6 text-body">
                      <span className="font-semibold text-primary">Answer:</span>{" "}
                      {question.answer.join("; ")}
                    </p>
                    <p className="text-sm leading-6 text-body">
                      <span className="font-semibold text-primary">Oral:</span>{" "}
                      {question.interview_answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  if (!isActive) {
    return (
      <EmptyState
        icon={AlarmClock}
        title="Timed mock interview"
        description="Start a 10-question round with a 15-minute timer. You will see your score and weak categories at the end."
        action={
          <button
            className="button-primary"
            onClick={startMock}
            type="button"
          >
            <CheckCircle size={17} aria-hidden="true" />
            Start Mock Interview
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <section className="product-panel p-4">
        <div className="grid gap-4 md:grid-cols-[1fr_180px] md:items-center">
          <ProgressBar
            label={`Question ${currentIndex + 1} of ${mockQuestions.length}`}
            value={currentIndex + 1}
            max={mockQuestions.length}
          />
          <div className="rounded-md border border-hairline bg-surface-soft px-3 py-2 text-center">
            <span className="text-xs font-semibold uppercase tracking-normal text-muted">
              Timer
            </span>
            <p className="display-heading text-xl">
              {formatTimer(timeRemaining)}
            </p>
          </div>
        </div>
      </section>

      {activeQuestion ? (
        <QuestionAttempt
          key={`${sessionId}-${activeQuestion.id}`}
          question={activeQuestion}
          onAnswered={handleAnswered}
          showFeedback={false}
          submitLabel="Lock Response"
        />
      ) : null}

      <div className="flex flex-wrap gap-3">
        {currentAnswer ? (
          <button
            className="button-primary"
            onClick={advance}
            type="button"
          >
            {currentIndex === mockQuestions.length - 1 ? "Finish Mock" : "Next"}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        ) : null}
        <button
          className="button-secondary"
          onClick={() => finishMock()}
          type="button"
        >
          End Interview
        </button>
      </div>
    </div>
  );
}
