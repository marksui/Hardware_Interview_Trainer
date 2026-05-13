import type {
  AnalyticsBucket,
  AnalyticsState,
  AnswerResult,
  Difficulty,
  ProgressExport,
  ThemePreference,
} from "../types";
import { APP_VERSION } from "./version";

const WRONG_QUESTIONS_KEY = "hardwareInterviewTrainer.wrongQuestions";
const ANALYTICS_KEY = "hardwareInterviewTrainer.analytics";
const THEME_KEY = "hardwareInterviewTrainer.theme";

const difficulties: Difficulty[] = ["easy", "medium", "hard"];

function emptyBucket(): AnalyticsBucket {
  return {
    attempted: 0,
    correct: 0,
    missed: 0,
  };
}

export function createEmptyAnalytics(): AnalyticsState {
  return {
    totalAttempted: 0,
    totalCorrect: 0,
    totalMissed: 0,
    byCategory: {},
    byDifficulty: {
      easy: emptyBucket(),
      medium: emptyBucket(),
      hard: emptyBucket(),
    },
  };
}

function readStringArray(key: string) {
  try {
    const rawValue = window.localStorage.getItem(key);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsedValue)
      ? parsedValue.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function writeStringArray(key: string, values: string[]) {
  window.localStorage.setItem(key, JSON.stringify(Array.from(new Set(values))));
}

function sanitizeBucket(value: unknown): AnalyticsBucket {
  if (!value || typeof value !== "object") {
    return emptyBucket();
  }

  const bucket = value as Partial<AnalyticsBucket>;

  return {
    attempted: Number.isFinite(bucket.attempted) ? Number(bucket.attempted) : 0,
    correct: Number.isFinite(bucket.correct) ? Number(bucket.correct) : 0,
    missed: Number.isFinite(bucket.missed) ? Number(bucket.missed) : 0,
  };
}

function sanitizeAnalytics(value: unknown): AnalyticsState {
  const analytics = createEmptyAnalytics();

  if (!value || typeof value !== "object") {
    return analytics;
  }

  const rawAnalytics = value as Partial<AnalyticsState>;

  analytics.totalAttempted = Number.isFinite(rawAnalytics.totalAttempted)
    ? Number(rawAnalytics.totalAttempted)
    : 0;
  analytics.totalCorrect = Number.isFinite(rawAnalytics.totalCorrect)
    ? Number(rawAnalytics.totalCorrect)
    : 0;
  analytics.totalMissed = Number.isFinite(rawAnalytics.totalMissed)
    ? Number(rawAnalytics.totalMissed)
    : 0;

  if (rawAnalytics.byCategory && typeof rawAnalytics.byCategory === "object") {
    Object.entries(rawAnalytics.byCategory).forEach(([category, bucket]) => {
      analytics.byCategory[category] = sanitizeBucket(bucket);
    });
  }

  if (rawAnalytics.byDifficulty && typeof rawAnalytics.byDifficulty === "object") {
    difficulties.forEach((difficulty) => {
      analytics.byDifficulty[difficulty] = sanitizeBucket(
        rawAnalytics.byDifficulty?.[difficulty],
      );
    });
  }

  return analytics;
}

function writeAnalytics(analytics: AnalyticsState) {
  window.localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
}

export function getWrongQuestionIds() {
  return readStringArray(WRONG_QUESTIONS_KEY);
}

export function addWrongQuestion(id: string) {
  const wrongQuestionIds = getWrongQuestionIds();
  writeStringArray(WRONG_QUESTIONS_KEY, [...wrongQuestionIds, id]);
}

export function removeWrongQuestion(id: string) {
  writeStringArray(
    WRONG_QUESTIONS_KEY,
    getWrongQuestionIds().filter((questionId) => questionId !== id),
  );
}

export function clearWrongQuestions() {
  writeStringArray(WRONG_QUESTIONS_KEY, []);
}

export function getAnalytics() {
  try {
    const rawValue = window.localStorage.getItem(ANALYTICS_KEY);
    return sanitizeAnalytics(rawValue ? JSON.parse(rawValue) : undefined);
  } catch {
    return createEmptyAnalytics();
  }
}

export function recordAttempt(result: AnswerResult) {
  const analytics = getAnalytics();
  const categoryBucket =
    analytics.byCategory[result.question.category] ?? emptyBucket();
  const difficultyBucket =
    analytics.byDifficulty[result.question.difficulty] ?? emptyBucket();

  analytics.totalAttempted += 1;
  categoryBucket.attempted += 1;
  difficultyBucket.attempted += 1;

  if (result.isCorrect) {
    analytics.totalCorrect += 1;
    categoryBucket.correct += 1;
    difficultyBucket.correct += 1;
  } else if (result.isCorrect === false) {
    analytics.totalMissed += 1;
    categoryBucket.missed += 1;
    difficultyBucket.missed += 1;
  }

  analytics.byCategory[result.question.category] = categoryBucket;
  analytics.byDifficulty[result.question.difficulty] = difficultyBucket;
  writeAnalytics(analytics);
}

export function recordSelfReviewMiss(result: AnswerResult) {
  const analytics = getAnalytics();
  const categoryBucket =
    analytics.byCategory[result.question.category] ?? emptyBucket();
  const difficultyBucket =
    analytics.byDifficulty[result.question.difficulty] ?? emptyBucket();

  analytics.totalMissed += 1;
  categoryBucket.missed += 1;
  difficultyBucket.missed += 1;

  analytics.byCategory[result.question.category] = categoryBucket;
  analytics.byDifficulty[result.question.difficulty] = difficultyBucket;
  writeAnalytics(analytics);
}

export function getThemePreference(): ThemePreference {
  const value = window.localStorage.getItem(THEME_KEY);

  return value === "dark" ? "dark" : "light";
}

export function setThemePreference(theme: ThemePreference) {
  window.localStorage.setItem(THEME_KEY, theme);
}

export function getProgressExport(): ProgressExport {
  return {
    app: "Hardware Interview Trainer",
    version: 1,
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    wrongQuestions: getWrongQuestionIds(),
    analytics: getAnalytics(),
    theme: getThemePreference(),
  };
}

export function importProgress(value: unknown) {
  if (!value || typeof value !== "object") {
    throw new Error("Progress file must be a JSON object.");
  }

  const progress = value as Partial<ProgressExport>;
  const wrongQuestions = Array.isArray(progress.wrongQuestions)
    ? progress.wrongQuestions.filter(
        (questionId): questionId is string => typeof questionId === "string",
      )
    : [];

  writeStringArray(WRONG_QUESTIONS_KEY, wrongQuestions);
  writeAnalytics(sanitizeAnalytics(progress.analytics));

  if (progress.theme === "dark" || progress.theme === "light") {
    setThemePreference(progress.theme);
  }
}
