import questionData from "../data/questions.json";
import type { Difficulty, Question, QuestionType } from "../types";

export const questions = questionData as Question[];

export const difficulties: Difficulty[] = ["easy", "medium", "hard"];

export const questionTypes: QuestionType[] = [
  "single_choice",
  "multi_select",
  "short_answer",
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
  return type
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
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

function tokenSet(value: string) {
  return new Set(normalize(value).split(" ").filter((token) => token.length > 2));
}

function evaluateShortAnswer(question: Question, givenAnswer: string[]) {
  const response = normalize(givenAnswer.join(" "));

  if (!response) {
    return false;
  }

  return question.answer.some((expected) => {
    const normalizedExpected = normalize(expected);

    if (
      response.includes(normalizedExpected) ||
      normalizedExpected.includes(response)
    ) {
      return true;
    }

    const expectedTokens = tokenSet(expected);
    const responseTokens = tokenSet(response);
    const matches = [...expectedTokens].filter((token) => responseTokens.has(token));
    const neededMatches = Math.max(1, Math.ceil(expectedTokens.size * 0.6));

    return matches.length >= neededMatches;
  });
}

export function evaluateAnswer(question: Question, givenAnswer: string[]) {
  if (question.type === "short_answer") {
    return evaluateShortAnswer(question, givenAnswer);
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
      (!search || searchable.includes(search))
    );
  });
}
