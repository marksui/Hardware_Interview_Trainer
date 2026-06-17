import {
  AlarmClock,
  ArrowRight,
  BookOpenCheck,
  Briefcase,
  CheckCircle,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CategoryBadge, DifficultyBadge, TypeBadge } from "../components/Badge";
import { ProgressBar } from "../components/ProgressBar";
import { QuestionAttempt } from "../components/QuestionAttempt";
import { RichText } from "../components/RichText";
import { mockPresets, type MockPreset } from "../data/mockPresets";
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
import { addReviewItem, recordAttempt, recordSelfReviewMiss } from "../utils/storage";

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

function summarizeCategoryCoverage(mockQuestions: Question[]) {
  const counts = mockQuestions.reduce<Record<string, number>>((items, question) => {
    items[question.category] = (items[question.category] ?? 0) + 1;
    return items;
  }, {});

  return Object.entries(counts)
    .sort(([, leftCount], [, rightCount]) => rightCount - leftCount)
    .map(([category, count]) => ({ category, count }));
}

function resolvePresetQuestions(preset: MockPreset) {
  return preset.questionIds
    .map((id) => questions.find((question) => question.id === id))
    .filter((question): question is Question => Boolean(question));
}

export function MockInterviewMode({
  onReviewItemsChanged,
}: {
  onReviewItemsChanged: () => void;
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
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [activePresetName, setActivePresetName] = useState("");

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
  const categoryCoverage = useMemo(
    () => summarizeCategoryCoverage(mockQuestions),
    [mockQuestions],
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
    if (!isFlashcardMode) {
      mockQuestions.forEach((question) => {
        const answer = answerState[question.id];

        if (!answer || answer.isCorrect === false) {
          addReviewItem(question.id);
        }
      });
    }
    onReviewItemsChanged();
    setIsActive(false);
    setIsFinished(true);
  };

  useEffect(() => {
    if (!isActive || isFinished || isFlashcardMode) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeRemaining((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isActive, isFinished, isFlashcardMode]);

  useEffect(() => {
    if (isActive && !isFinished && !isFlashcardMode && timeRemaining === 0) {
      finishMock();
    }
  }, [isActive, isFinished, isFlashcardMode, timeRemaining, answers, mockQuestions]);

  const startMock = (
    questionSet?: Question[],
    options?: { flashcard?: boolean; presetName?: string },
  ) => {
    const nextQuestions =
      questionSet && questionSet.length
        ? questionSet
        : shuffleQuestions(questions).slice(0, MOCK_QUESTION_COUNT);
    const flashcard = options?.flashcard ?? isFlashcardMode;

    setMockQuestions(nextQuestions);
    setAnswers({});
    setCurrentIndex(0);
    setTimeRemaining(MOCK_DURATION_SECONDS);
    setIsActive(true);
    setIsFinished(false);
    setIsFlashcardMode(flashcard);
    setActivePresetName(options?.presetName ?? "");
    setSavedReviewIds([]);
    setSessionId((id) => id + 1);
  };

  const handleAnswered = (result: AnswerResult) => {
    const nextAnswers = { ...answers, [result.question.id]: result };

    setAnswers(nextAnswers);
    recordAttempt(result);

    if (result.isCorrect === false) {
      addReviewItem(result.question.id);
    }

    onReviewItemsChanged();
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

    addReviewItem(result.question.id);
    recordSelfReviewMiss(result);
    setSavedReviewIds((ids) => [...ids, result.question.id]);
    onReviewItemsChanged();
  };

  const advance = () => {
    if (currentIndex === mockQuestions.length - 1) {
      finishMock();
      return;
    }

    setCurrentIndex((index) => index + 1);
  };

  const startPreset = (preset: MockPreset) => {
    startMock(resolvePresetQuestions(preset), {
      flashcard: isFlashcardMode,
      presetName: `${preset.company} ${preset.requisition}`,
    });
  };

  if (isFinished) {
    const summaryItems = isFlashcardMode ? categoryCoverage : weakCategories;

    return (
      <div className="space-y-5">
        <section className="panel p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-canvas text-primary">
                <Trophy size={24} aria-hidden="true" />
              </div>
              <h2 className="display-heading mt-4 text-4xl leading-tight">
                {isFlashcardMode ? "Flashcard review complete" : "Mock interview complete"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-body">
                {isFlashcardMode
                  ? `Reviewed ${mockQuestions.length} questions${
                      activePresetName ? ` for ${activePresetName}` : ""
                    }.`
                  : `Score: ${correctCount} / ${scorableQuestions.length} scored questions correct. ${selfReviewedCount} self-reviewed.`}
              </p>
            </div>
            <div className="w-full max-w-sm">
              <ProgressBar
                label={
                  isFlashcardMode
                    ? "Review complete"
                    : scorableQuestions.length
                    ? `${Math.round((correctCount / scorableQuestions.length) * 100)}% scored`
                    : "Self-reviewed round"
                }
                value={isFlashcardMode ? mockQuestions.length : correctCount}
                max={
                  isFlashcardMode
                    ? mockQuestions.length
                    : scorableQuestions.length || mockQuestions.length
                }
              />
              <button
                className="button-primary mt-5 w-full"
                onClick={() => startMock()}
                type="button"
              >
                <RotateCcw size={17} aria-hidden="true" />
                {isFlashcardMode ? "Start New Review" : "Start New Mock"}
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <div className="panel h-fit p-6">
            <h3 className="display-heading text-[28px] leading-tight">
              {isFlashcardMode ? "Review coverage" : "Focus categories"}
            </h3>
            <div className="mt-4 space-y-3">
              {summaryItems.length ? (
                summaryItems.map((item) => (
                  <div className="product-panel p-3" key={item.category}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-primary">
                        {item.category}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          isFlashcardMode ? "text-muted" : "text-error"
                        }`}
                      >
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-body">
                  No focus categories this round.
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
                              : isFlashcardMode
                                ? "bg-surface-card text-primary"
                              : isCorrect
                                ? "bg-emerald-100 text-ink-950"
                                : "bg-rose-100 text-ink-950"
                          }`}
                        >
                          {isFlashcardMode
                            ? "Reviewed"
                            : isSelfReview
                              ? "Self review"
                              : isCorrect
                                ? "Correct"
                                : "Missed"}
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
                  {isSelfReview && !isFlashcardMode ? (
                    <button
                      className="button-secondary mt-3 px-3 py-2"
                      disabled={savedReviewIds.includes(question.id)}
                      onClick={() => handleSaveSelfReview(result)}
                      type="button"
                    >
                      <BookOpenCheck size={16} aria-hidden="true" />
                      {savedReviewIds.includes(question.id)
                        ? "Saved for Review"
                        : "Save for Review"}
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

          <button
            aria-pressed={isFlashcardMode}
            className={`mt-5 flex w-full items-center justify-between rounded-lg border px-3 py-3 text-left transition ${
              isFlashcardMode
                ? "border-primary bg-canvas text-primary"
                : "border-hairline bg-surface-soft text-body"
            }`}
            onClick={() => setIsFlashcardMode((enabled) => !enabled)}
            type="button"
          >
            <span>
              <span className="block text-sm font-semibold">Flashcard quick review</span>
              <span className="mt-1 block text-xs leading-5 text-muted">
                Show answers immediately, then move to the next card. No scoring.
              </span>
            </span>
            <span className="badge-pill bg-surface-card text-primary">
              {isFlashcardMode ? "On" : "Off"}
            </span>
          </button>

          <div className="mt-5 rounded-lg border border-hairline bg-canvas p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-soft text-primary">
                <Briefcase size={18} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-normal text-muted">
                  Company preset
                </p>
                <h3 className="mt-1 text-sm font-semibold text-primary">
                  {mockPresets[0].name}
                </h3>
                <p className="mt-1 font-code text-xs font-semibold text-muted">
                  {mockPresets[0].requisition}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-body">
              {mockPresets[0].description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {mockPresets[0].focus.map((item) => (
                <span className="badge-pill bg-surface-card text-primary" key={item}>
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-muted">
              Practice-only. Do not use this tool during a live interview.
            </p>
            <button
              className="button-primary mt-4 w-full"
              onClick={() => startPreset(mockPresets[0])}
              type="button"
            >
              <BookOpenCheck size={17} aria-hidden="true" />
              Start NVIDIA Mock ({mockPresets[0].questionIds.length})
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            <button className="button-primary" onClick={() => startMock()} type="button">
              <CheckCircle size={17} aria-hidden="true" />
              {isFlashcardMode ? "Random Flashcards" : "Random 10 Questions"}
            </button>
            <button
              className="button-secondary"
              disabled={selectedQuestions.length === 0}
              onClick={() => startMock(selectedQuestions, { flashcard: isFlashcardMode })}
              type="button"
            >
              <SlidersHorizontal size={17} aria-hidden="true" />
              {isFlashcardMode ? "Review Selected" : "Start Selected"} ({selectedQuestions.length})
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
              {isFlashcardMode ? "Mode" : "Timer"}
            </span>
            <p className="display-heading text-xl">
              {isFlashcardMode ? "Flashcard" : formatTimer(timeRemaining)}
            </p>
          </div>
        </div>
      </section>

      {activeQuestion ? (
        isFlashcardMode ? (
          <article className="product-panel overflow-hidden">
            <div className="border-b border-hairline bg-canvas px-6 py-5">
              <div className="flex flex-wrap gap-2">
                <CategoryBadge category={activeQuestion.category} />
                <DifficultyBadge difficulty={activeQuestion.difficulty} />
                <TypeBadge type={activeQuestion.type} />
                <span className="badge-pill bg-surface-card text-primary">
                  Flashcard
                </span>
              </div>
              <div className="mt-4">
                <RichText
                  text={activeQuestion.question}
                  textClassName="display-heading text-[28px] leading-tight"
                />
              </div>
            </div>
            <div className="grid gap-5 px-6 py-6 lg:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-muted">
                  {isSelfReviewedQuestion(activeQuestion) ? "Suggested answer" : "Answer"}
                </h3>
                <div className="mt-2">
                  <RichText
                    text={activeQuestion.answer.join("; ")}
                    textClassName="text-sm leading-6 text-primary"
                  />
                </div>
                <h3 className="mt-5 text-sm font-semibold text-muted">
                  Oral answer
                </h3>
                <div className="mt-2">
                  <RichText text={activeQuestion.interview_answer} />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted">
                  {activeQuestion.type === "coding"
                    ? "Reference implementation"
                    : "Explanation"}
                </h3>
                <div className="mt-2">
                  <RichText text={activeQuestion.explanation} />
                </div>
              </div>
            </div>
          </article>
        ) : (
          <QuestionAttempt
            key={`${sessionId}-${activeQuestion.id}`}
            question={activeQuestion}
            onAnswered={handleAnswered}
            showFeedback={false}
            submitLabel="Lock Response"
          />
        )
      ) : null}

      <div className="flex flex-wrap gap-3">
        {isFlashcardMode || currentAnswer ? (
          <button className="button-primary" onClick={advance} type="button">
            {currentIndex === mockQuestions.length - 1
              ? isFlashcardMode
                ? "Finish Review"
                : "Finish Mock"
              : isFlashcardMode
                ? "Next Card"
                : "Next"}
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
