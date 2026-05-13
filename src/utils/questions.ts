import questionData from "../data/questions.json";
import type { Difficulty, Question, QuestionType } from "../types";

export const questions = questionData as Question[];

export const difficulties: Difficulty[] = ["easy", "medium", "hard"];

export const questionTypes: QuestionType[] = [
  "single_choice",
  "multi_select",
  "short_answer",
  "coding",
];

export const categories = Array.from(
  new Set(questions.map((question) => question.category)),
).sort();

export const categoryCounts = categories.map((category) => ({
  category,
  count: questions.filter((question) => question.category === category).length,
}));

export function getQuestionById(id: string) {
  return questions.find((question) => question.id === id);
}

export function shuffleQuestions<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function formatQuestionType(type: QuestionType) {
  const labels: Record<QuestionType, string> = {
    single_choice: "Single Choice",
    multi_select: "Multi Select",
    short_answer: "Suggested Answer",
    coding: "Coding",
  };

  return labels[type];
}

export function formatDifficulty(difficulty: Difficulty) {
  return difficulty[0].toUpperCase() + difficulty.slice(1);
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizedSet(values: string[]) {
  return values.map(normalize).sort();
}

export function isSelfReviewedQuestion(question: Question) {
  return question.type === "short_answer" || question.type === "coding";
}

export function evaluateAnswer(question: Question, givenAnswer: string[]) {
  if (isSelfReviewedQuestion(question)) {
    return givenAnswer.some((answer) => answer.trim().length > 0) ? null : false;
  }

  const expected = normalizedSet(question.answer);
  const actual = normalizedSet(givenAnswer);

  return (
    expected.length === actual.length &&
    expected.every((value, index) => value === actual[index])
  );
}

export function filterQuestions(options: {
  category?: string;
  difficulty?: string;
  type?: string;
  search?: string;
}) {
  const search = normalize(options.search ?? "");
  const searchTokens = search.split(" ").filter(Boolean);

  return questions.filter((question) => {
    const matchesCategory =
      !options.category || question.category === options.category;
    const matchesDifficulty =
      !options.difficulty || question.difficulty === options.difficulty;
    const matchesType = !options.type || question.type === options.type;
    const searchable = normalize(
      [
        question.question,
        question.category,
        question.difficulty,
        question.type,
        question.explanation,
        question.interview_answer,
        ...question.tags,
      ].join(" "),
    );

    return (
      matchesCategory &&
      matchesDifficulty &&
      matchesType &&
      (!searchTokens.length ||
        searchTokens.every((token) => searchable.includes(token)))
    );
  });
}
