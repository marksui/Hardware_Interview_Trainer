import {
  BookOpenCheck,
  Code2,
  FileCode2,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CategoryBadge, DifficultyBadge, TypeBadge } from "../components/Badge";
import { RichText } from "../components/RichText";
import type { Question } from "../types";
import { questions } from "../utils/questions";

const programmingQuestions = questions.filter((question) =>
  question.tags.includes("programming-review"),
);

const languageFilters = [
  { id: "all", label: "All" },
  { id: "cpp", label: "C++" },
  { id: "python", label: "Python" },
] as const;

const topicFilters = [
  { id: "all", label: "All Topics" },
  { id: "dfs", label: "DFS" },
  { id: "bfs", label: "BFS" },
  { id: "stack", label: "Stack" },
  { id: "queue", label: "Queue" },
  { id: "graph", label: "Graph" },
  { id: "grid", label: "Grid" },
] as const;

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function countBy(predicate: (question: Question) => boolean) {
  return programmingQuestions.filter(predicate).length;
}

function matchesSearch(question: Question, query: string) {
  const terms = normalize(query).split(" ").filter(Boolean);

  if (!terms.length) {
    return true;
  }

  const searchable = normalize(
    [
      question.id,
      question.category,
      question.difficulty,
      question.question,
      question.explanation,
      question.interview_answer,
      ...question.answer,
      ...question.tags,
    ].join(" "),
  );

  return terms.every((term) => searchable.includes(term));
}

function getLanguageLabel(question: Question) {
  if (question.tags.includes("cpp")) {
    return "C++";
  }

  if (question.tags.includes("python")) {
    return "Python";
  }

  return "Code";
}

function getTopicTags(question: Question) {
  return topicFilters
    .filter((topic) => topic.id !== "all" && question.tags.includes(topic.id))
    .map((topic) => topic.label);
}

export function ProgrammingReview() {
  const [language, setLanguage] = useState<(typeof languageFilters)[number]["id"]>("all");
  const [topic, setTopic] = useState<(typeof topicFilters)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(programmingQuestions[0]?.id ?? "");

  const filteredQuestions = useMemo(
    () =>
      programmingQuestions.filter((question) => {
        const matchesLanguage =
          language === "all" || question.tags.includes(language);
        const matchesTopic = topic === "all" || question.tags.includes(topic);

        return matchesLanguage && matchesTopic && matchesSearch(question, query);
      }),
    [language, query, topic],
  );

  useEffect(() => {
    if (!filteredQuestions.some((question) => question.id === selectedId)) {
      setSelectedId(filteredQuestions[0]?.id ?? "");
    }
  }, [filteredQuestions, selectedId]);

  const selectedQuestion =
    filteredQuestions.find((question) => question.id === selectedId) ??
    filteredQuestions[0];

  const resetFilters = () => {
    setLanguage("all");
    setTopic("all");
    setQuery("");
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <div className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-muted">Programming set</p>
            <BookOpenCheck size={20} aria-hidden="true" />
          </div>
          <p className="display-heading mt-2 text-3xl">
            {programmingQuestions.length}
          </p>
        </div>
        <div className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-muted">C++ review</p>
            <FileCode2 size={20} aria-hidden="true" />
          </div>
          <p className="display-heading mt-2 text-3xl">
            {countBy((question) => question.tags.includes("cpp"))}
          </p>
        </div>
        <div className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-muted">Python review</p>
            <Code2 size={20} aria-hidden="true" />
          </div>
          <p className="display-heading mt-2 text-3xl">
            {countBy((question) => question.tags.includes("python"))}
          </p>
        </div>
        <div className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-muted">DFS / BFS</p>
            <SlidersHorizontal size={20} aria-hidden="true" />
          </div>
          <p className="display-heading mt-2 text-3xl">
            {countBy(
              (question) =>
                question.tags.includes("dfs") || question.tags.includes("bfs"),
            )}
          </p>
        </div>
      </section>

      <section className="panel p-5">
        <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-end">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-normal text-muted">
              Search examples, code, and topics
            </span>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                size={18}
                aria-hidden="true"
              />
              <input
                className="field pl-10"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try dfs, bfs, stack, queue, grid..."
              />
            </div>
          </label>

          <button
            className="button-secondary px-3 py-2"
            onClick={resetFilters}
            type="button"
          >
            Reset filters
          </button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-normal text-muted">
              Language
            </p>
            <div className="flex flex-wrap gap-2">
              {languageFilters.map((item) => (
                <button
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    language === item.id
                      ? "bg-action text-on-action"
                      : "bg-canvas text-primary"
                  }`}
                  key={item.id}
                  onClick={() => setLanguage(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-normal text-muted">
              Topic
            </p>
            <div className="flex flex-wrap gap-2">
              {topicFilters.map((item) => (
                <button
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    topic === item.id
                      ? "bg-action text-on-action"
                      : "bg-canvas text-primary"
                  }`}
                  key={item.id}
                  onClick={() => setTopic(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="product-panel h-fit overflow-hidden lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]">
          <div className="flex items-center justify-between gap-3 border-b border-hairline bg-canvas px-4 py-3">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-body">
              <SlidersHorizontal size={16} aria-hidden="true" />
              {filteredQuestions.length} matching
            </div>
            <span className="text-xs font-semibold uppercase tracking-normal text-muted">
              Review
            </span>
          </div>

          <div className="max-h-[520px] divide-y divide-hairline overflow-y-auto lg:max-h-[calc(100vh-10rem)]">
            {filteredQuestions.map((question) => {
              const isSelected = question.id === selectedQuestion?.id;

              return (
                <button
                  className={`block w-full px-4 py-4 text-left transition ${
                    isSelected ? "bg-surface-soft" : "bg-canvas hover:bg-surface-soft"
                  }`}
                  key={question.id}
                  onClick={() => setSelectedId(question.id)}
                  type="button"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="badge-pill bg-sky-100 text-ink-950">
                      {getLanguageLabel(question)}
                    </span>
                    <DifficultyBadge difficulty={question.difficulty} />
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-6 text-primary">
                    {question.question}
                  </p>
                  <p className="mt-2 font-code text-xs font-semibold text-muted">
                    {question.id}
                  </p>
                </button>
              );
            })}

            {filteredQuestions.length === 0 ? (
              <div className="px-4 py-8 text-sm leading-6 text-body">
                No programming review questions match these filters.
              </div>
            ) : null}
          </div>
        </aside>

        {selectedQuestion ? (
          <article className="product-panel overflow-hidden">
            <div className="border-b border-hairline bg-canvas px-5 py-4">
              <div className="flex flex-wrap gap-2">
                <CategoryBadge category={selectedQuestion.category} />
                <DifficultyBadge difficulty={selectedQuestion.difficulty} />
                <TypeBadge type={selectedQuestion.type} />
                {getTopicTags(selectedQuestion).map((tag) => (
                  <span className="badge-pill bg-surface-card text-primary" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-4 font-code text-xs font-semibold text-muted">
                {selectedQuestion.id}
              </p>
              <div className="mt-2">
                <RichText
                  text={selectedQuestion.question}
                  textClassName="display-heading text-[28px] leading-tight"
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
              <section className="border-b border-hairline p-5 lg:border-b-0 lg:border-r">
                <h3 className="text-sm font-semibold text-muted">
                  Review checklist
                </h3>
                <ul className="mt-3 space-y-2">
                  {selectedQuestion.answer.map((item) => (
                    <li
                      className="rounded-md border border-hairline bg-surface-soft px-3 py-2 text-sm leading-6 text-primary"
                      key={item}
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-6 text-sm font-semibold text-muted">
                  Interview explanation
                </h3>
                <div className="mt-3">
                  <RichText text={selectedQuestion.interview_answer} />
                </div>
              </section>

              <section className="p-5">
                <h3 className="text-sm font-semibold text-muted">
                  Example and reference code
                </h3>
                <div className="mt-3">
                  <RichText text={selectedQuestion.explanation} />
                </div>
              </section>
            </div>
          </article>
        ) : (
          <div className="panel p-8 text-sm leading-6 text-body">
            Pick a programming prompt to review the checklist, example, and
            reference implementation.
          </div>
        )}
      </div>
    </div>
  );
}
