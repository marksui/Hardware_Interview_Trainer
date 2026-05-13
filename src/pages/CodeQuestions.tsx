import {
  CheckCircle2,
  Code2,
  Eye,
  FileCode2,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CategoryBadge, DifficultyBadge, TypeBadge } from "../components/Badge";
import { RichText } from "../components/RichText";
import type { Question } from "../types";
import {
  difficulties,
  filterQuestions,
  formatDifficulty,
  questions,
} from "../utils/questions";

const codingQuestions = questions.filter((question) => question.type === "coding");

const codingCategories = Array.from(
  new Set(codingQuestions.map((question) => question.category)),
).sort();

const codingDifficulties = difficulties.filter((difficulty) =>
  codingQuestions.some((question) => question.difficulty === difficulty),
);

function countBy(predicate: (question: Question) => boolean) {
  return codingQuestions.filter(predicate).length;
}

export function CodeQuestions() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [selectedId, setSelectedId] = useState(codingQuestions[0]?.id ?? "");

  const filteredQuestions = useMemo(
    () =>
      filterQuestions({
        category,
        difficulty,
        search,
        type: "coding",
      }),
    [category, difficulty, search],
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
    setSearch("");
    setCategory("");
    setDifficulty("");
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <div className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-muted">Code problems</p>
            <Code2 size={20} aria-hidden="true" />
          </div>
          <p className="display-heading mt-2 text-3xl">{codingQuestions.length}</p>
        </div>
        <div className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-muted">Verilog</p>
            <FileCode2 size={20} aria-hidden="true" />
          </div>
          <p className="display-heading mt-2 text-3xl">
            {countBy((question) => question.category === "Verilog Coding")}
          </p>
        </div>
        <div className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-muted">SystemVerilog</p>
            <FileCode2 size={20} aria-hidden="true" />
          </div>
          <p className="display-heading mt-2 text-3xl">
            {countBy((question) => question.category === "SystemVerilog Coding")}
          </p>
        </div>
        <div className="panel p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-muted">Hard</p>
            <CheckCircle2 size={20} aria-hidden="true" />
          </div>
          <p className="display-heading mt-2 text-3xl">
            {countBy((question) => question.difficulty === "hard")}
          </p>
        </div>
      </section>

      <section className="panel p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_190px_160px_auto] lg:items-end">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-normal text-muted">
              Search code prompts
            </span>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                size={18}
                aria-hidden="true"
              />
              <input
                className="field pl-10"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Try fifo, counter, valid-ready, FSM..."
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-normal text-muted">
              Category
            </span>
            <select
              className="field"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">All code</option>
              {codingCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
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
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
            >
              <option value="">All levels</option>
              {codingDifficulties.map((item) => (
                <option key={item} value={item}>
                  {formatDifficulty(item)}
                </option>
              ))}
            </select>
          </label>

          <button
            className="button-secondary px-3 py-2"
            onClick={resetFilters}
            type="button"
          >
            Reset
          </button>
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
              View
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
                    <DifficultyBadge difficulty={question.difficulty} />
                    <CategoryBadge category={question.category} />
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-6 text-primary">
                    {question.question}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="font-code text-xs font-semibold text-muted">
                      {question.id}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      <Eye size={14} aria-hidden="true" />
                      View
                    </span>
                  </div>
                </button>
              );
            })}
            {filteredQuestions.length === 0 ? (
              <div className="px-4 py-8 text-sm leading-6 text-body">
                No coding questions match these filters.
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

            <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <section className="border-b border-hairline p-5 lg:border-b-0 lg:border-r">
                <h3 className="text-sm font-semibold text-muted">
                  Reference checklist
                </h3>
                <div className="mt-3">
                  <RichText
                    text={selectedQuestion.answer.join("; ")}
                    textClassName="text-sm leading-6 text-primary"
                  />
                </div>
                <h3 className="mt-6 text-sm font-semibold text-muted">
                  Interview notes
                </h3>
                <div className="mt-3">
                  <RichText text={selectedQuestion.interview_answer} />
                </div>
              </section>

              <section className="p-5">
                <h3 className="text-sm font-semibold text-muted">
                  Reference implementation
                </h3>
                <div className="mt-3">
                  <RichText text={selectedQuestion.explanation} />
                </div>
              </section>
            </div>

            <div className="border-t border-hairline px-5 py-4">
              <h3 className="text-sm font-semibold text-muted">Tags</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedQuestion.tags.map((tag) => (
                  <span className="badge-pill bg-surface-card text-primary" key={tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ) : (
          <div className="panel p-8 text-sm leading-6 text-body">
            Pick a coding question to view the prompt, checklist, interview
            notes, and reference implementation.
          </div>
        )}
      </div>
    </div>
  );
}
