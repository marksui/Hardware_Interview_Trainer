import {
  AlarmClock,
  ArrowRight,
  CheckCircle,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Trophy,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CategoryBadge, DifficultyBadge, TypeBadge } from "../components/Badge";
import { ProgressBar } from "../components/ProgressBar";
import { QuestionAttempt } from "../components/QuestionAttempt";
import { RichText } from "../components/RichText";
import type { AnswerResult, Question } from "../types";
import {
  categories,
  difficulties,
  filterQuestions,
  formatQuestionType,
  isSelfReviewedQuestion,
  questionTypes,
  questions,
  shuffleQuestions,
} from "../utils/questions";
import { addWrongQuestion, recordAttempt, recordSelfReviewMiss } from "../utils/storage";

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
    const answer = answers[question.id];

    if (!answer || answer.isCorrect === false) {
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
  const [setupSearch, setSetupSearch] = useState("");
  const [setupCategory, setSetupCategory] = useState("");
  const [setupDifficulty, setSetupDifficulty] = useState("");
  const [setupType, setSetupType] = useState("");
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [savedReviewIds, setSavedReviewIds] = useState<string[]>([]);

  const activeQuestion = mockQuestions[currentIndex];
  const currentAnswer = activeQuestion ? answers[activeQuestion.id] : undefined;
  const correctCount = Object.values(answers).filter(
    (answer) => answer.isCorrect === true,
  ).length;
  const scorableQuestions = mockQuestions.filter(
    (question) => !isSelfReviewedQuestion(question),
  );
  const selfReviewedCount = Object.values(answers).filter(
    (answer) => answer.isCorrect === null,
  ).length;
  const weakCategories = useMemo(
    () => summarizeWeakCategories(mockQuestions, answers),
    [answers, mockQuestions],
  );
  const setupQuestions = useMemo(
    () =>
      filterQuestions({
        category: setupCategory,
        difficulty: setupDifficulty,
        type: setupType,
        search: setupSearch,
      }),
    [setupCategory, setupDifficulty, setupSearch, setupType],
  );
  const selectedQuestions = useMemo(
    () =>
      selectedQuestionIds
        .map((id) => questions.find((question) => question.id === id))
        .filter((question): question is Question => Boolean(question)),
    [selectedQuestionIds],
  );

  const finishMock = (answerState = answers) => {
    mockQuestions.forEach((question) => {
      const answer = answerState[question.id];

      if (!answer || answer.isCorrect === false) {
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

  const startMock = (questionSet?: Question[]) => {
    const nextQuestions =
      questionSet && questionSet.length
        ? questionSet
        : shuffleQuestions(questions).slice(0, MOCK_QUESTION_COUNT);

    setMockQuestions(nextQuestions);
    setAnswers({});
    setCurrentIndex(0);
    setTimeRemaining(MOCK_DURATION_SECONDS);
    setIsActive(true);
    setIsFinished(false);
    setSavedReviewIds([]);
    setSessionId((id) => id + 1);
  };

  const handleAnswered = (result: AnswerResult) => {
    const nextAnswers = { ...answers, [result.question.id]: result };

    setAnswers(nextAnswers);
    recordAttempt(result);

    if (result.isCorrect === false) {
      addWrongQuestion(result.question.id);
    }

    onWrongChanged();
  };

  const toggleQuestionSelection = (id: string) => {
    setSelectedQuestionIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id],
    );
  };

  const handleSaveSelfReview = (result: AnswerResult) => {
    if (result.isCorrect !== null || savedReviewIds.includes(result.question.id)) {
      return;
    }

    addWrongQuestion(result.question.id);
    recordSelfReviewMiss(result);
    setSavedReviewIds((ids) => [...ids, result.question.id]);
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
                Score: {correctCount} / {scorableQuestions.length} scored questions
                correct. {selfReviewedCount} self-reviewed.
              </p>
            </div>
            <div className="w-full max-w-sm">
              <ProgressBar
                label={
                  scorableQuestions.length
                    ? `${Math.round((correctCount / scorableQuestions.length) * 100)}% scored`
                    : "Self-reviewed round"
                }
                value={correctCount}
                max={scorableQuestions.length || mockQuestions.length}
              />
              <button
                className="button-primary mt-5 w-full"
                onClick={() => startMock()}
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
                  <div className="product-panel p-3" key={item.category}>
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
              const isSelfReview = result?.isCorrect === null;
              const isCorrect = result?.isCorrect === true;

              return (
                <div className="product-panel p-4" key={question.id}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <CategoryBadge category={question.category} />
                        <DifficultyBadge difficulty={question.difficulty} />
                        <TypeBadge type={question.type} />
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-semibold ${
                            isSelfReview
                              ? "bg-surface-card text-primary"
                              : isCorrect
                                ? "bg-emerald-100 text-ink-950"
                                : "bg-rose-100 text-ink-950"
                          }`}
                        >
                          {isSelfReview ? "Self review" : isCorrect ? "Correct" : "Missed"}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-semibold leading-6 text-primary">
                        {index + 1}. {question.question}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 lg:grid-cols-2">
                    <div className="text-sm leading-6 text-body">
                      <span className="font-semibold text-primary">
                        {isSelfReviewedQuestion(question) ? "Suggested:" : "Answer:"}
                      </span>
                      <RichText text={question.answer.join("; ")} />
                    </div>
                    <div className="text-sm leading-6 text-body">
                      <span className="font-semibold text-primary">Oral:</span>
                      <RichText text={question.interview_answer} />
                    </div>
                  </div>
                  {isSelfReview ? (
                    <button
                      className="button-secondary mt-3 border-rose-100 bg-rose-50 px-3 py-2 text-ink-950"
                      disabled={savedReviewIds.includes(question.id)}
                      onClick={() => handleSaveSelfReview(result)}
                      type="button"
                    >
                      <TriangleAlert size={16} aria-hidden="true" />
                      {savedReviewIds.includes(question.id)
                        ? "Saved to Wrong Questions"
                        : "Save to Wrong Questions"}
                    </button>
                  ) : null}
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
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="panel h-fit p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-canvas text-primary">
            <AlarmClock size={22} aria-hidden="true" />
          </div>
          <h2 className="display-heading mt-4 text-[28px] leading-tight">
            Mock setup
          </h2>
          <p className="mt-2 text-sm leading-6 text-body">
            Start a random 10-question round, or build a custom mock by selecting
            specific prompts from the bank.
          </p>

          <div className="mt-5 grid gap-3">
            <button className="button-primary" onClick={() => startMock()} type="button">
              <CheckCircle size={17} aria-hidden="true" />
              Random 10 Questions
            </button>
            <button
              className="button-secondary"
              disabled={selectedQuestions.length === 0}
              onClick={() => startMock(selectedQuestions)}
              type="button"
            >
              <SlidersHorizontal size={17} aria-hidden="true" />
              Start Selected ({selectedQuestions.length})
            </button>
          </div>
        </aside>

        <section className="panel p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_160px_160px_160px]">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-normal text-muted">
                Search
              </span>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  size={18}
                  aria-hidden="true"
                />
                <input
                  className="field pl-10"
                  value={setupSearch}
                  onChange={(event) => setSetupSearch(event.target.value)}
                  placeholder="CDC, Verilog, STA, fifo..."
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-normal text-muted">
                Category
              </span>
              <select
                className="field"
                value={setupCategory}
                onChange={(event) => setSetupCategory(event.target.value)}
              >
                <option value="">All</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
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
                value={setupDifficulty}
                onChange={(event) => setSetupDifficulty(event.target.value)}
              >
                <option value="">All</option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-normal text-muted">
                Type
              </span>
              <select
                className="field"
                value={setupType}
                onChange={(event) => setSetupType(event.target.value)}
              >
                <option value="">All</option>
                {questionTypes.map((type) => (
                  <option key={type} value={type}>
                    {formatQuestionType(type)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 max-h-[520px] divide-y divide-hairline overflow-y-auto rounded-lg border border-hairline">
            {setupQuestions.map((question) => {
              const isSelected = selectedQuestionIds.includes(question.id);

              return (
                <button
                  className={`block w-full px-4 py-4 text-left transition ${
                    isSelected ? "bg-surface-soft" : "bg-canvas"
                  }`}
                  key={question.id}
                  onClick={() => toggleQuestionSelection(question.id)}
                  type="button"
                >
                  <div className="flex flex-wrap gap-2">
                    <CategoryBadge category={question.category} />
                    <DifficultyBadge difficulty={question.difficulty} />
                    <TypeBadge type={question.type} />
                    {isSelected ? (
                      <span className="badge-pill bg-action text-on-action">
                        Selected
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-6 text-primary">
                    {question.question}
                  </p>
                  <p className="mt-1 font-code text-xs font-semibold text-muted">
                    {question.id}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      </div>
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
          <button className="button-primary" onClick={advance} type="button">
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
