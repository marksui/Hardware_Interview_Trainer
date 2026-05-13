import { Search, SlidersHorizontal, X } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { CategoryBadge, DifficultyBadge, TypeBadge } from "../components/Badge";
import { RichText } from "../components/RichText";
import type { Question } from "../types";
import {
  categories,
  difficulties,
  filterQuestions,
  formatQuestionType,
  questionTypes,
} from "../utils/questions";

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-normal text-muted">
        {label}
      </span>
      <select
        className="field"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
    </label>
  );
}

function QuestionDetails({
  question,
  onClose,
}: {
  question: Question;
  onClose: () => void;
}) {
  return (
    <aside className="product-panel sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="flex items-start justify-between gap-4 border-b border-hairline px-5 py-4">
        <div>
          <p className="font-code text-sm font-semibold text-muted">{question.id}</p>
          <h2 className="display-heading mt-1 text-[22px] leading-7">
            Question details
          </h2>
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          title="Close details"
          type="button"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <div className="space-y-5 px-5 py-5">
        <div className="flex flex-wrap gap-2">
          <CategoryBadge category={question.category} />
          <DifficultyBadge difficulty={question.difficulty} />
          <TypeBadge type={question.type} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-muted">Prompt</h3>
          <div className="mt-2">
            <RichText
              text={question.question}
              textClassName="text-sm leading-6 text-primary"
            />
          </div>
        </div>
        {question.choices?.length ? (
          <div>
            <h3 className="text-sm font-semibold text-muted">Choices</h3>
            <ul className="mt-2 space-y-2">
              {question.choices.map((choice) => (
                <li
                  className="rounded-md border border-hairline bg-surface-soft px-3 py-2 text-sm text-body"
                  key={choice}
                >
                  {choice}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div>
          <h3 className="text-sm font-semibold text-muted">Correct answer</h3>
          <div className="mt-2">
            <RichText
              text={question.answer.join("; ")}
              textClassName="text-sm leading-6 text-primary"
            />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-muted">Explanation</h3>
          <div className="mt-2">
            <RichText text={question.explanation} />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-muted">Oral answer</h3>
          <div className="mt-2">
            <RichText text={question.interview_answer} />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-muted">Tags</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <span
                className="badge-pill bg-surface-card text-primary"
                key={tag}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export function QuestionBank() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const filteredQuestions = useMemo(
    () => filterQuestions({ category, difficulty, type, search }),
    [category, difficulty, type, search],
  );

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setDifficulty("");
    setType("");
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
      <div className="space-y-5">
        <section className="panel p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <label className="block flex-1">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-normal text-muted">
                Search questions, explanations, and tags
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
                  placeholder="Try CDC, pipeline, SDC, congestion..."
                />
              </div>
            </label>
            <div className="grid gap-3 sm:grid-cols-3 lg:w-[560px]">
              <SelectField label="Category" value={category} onChange={setCategory}>
                <option value="">All categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </SelectField>
              <SelectField
                label="Difficulty"
                value={difficulty}
                onChange={setDifficulty}
              >
                <option value="">All levels</option>
                {difficulties.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </SelectField>
              <SelectField label="Type" value={type} onChange={setType}>
                <option value="">All types</option>
                {questionTypes.map((item) => (
                  <option key={item} value={item}>
                    {formatQuestionType(item)}
                  </option>
                ))}
              </SelectField>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-body">
              <SlidersHorizontal size={16} aria-hidden="true" />
              {filteredQuestions.length} matching questions
            </div>
            <button
              className="button-secondary px-3 py-2"
              onClick={resetFilters}
              type="button"
            >
              Reset filters
            </button>
          </div>
        </section>

        <section className="product-panel overflow-hidden">
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-surface-soft text-xs uppercase tracking-normal text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Question</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Difficulty</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {filteredQuestions.map((question) => (
                  <tr
                    className="cursor-pointer bg-canvas transition hover:bg-surface-soft"
                    key={question.id}
                    onClick={() => setSelectedQuestion(question)}
                  >
                    <td className="whitespace-nowrap px-4 py-4 font-code text-xs font-semibold text-muted">
                      {question.id}
                    </td>
                    <td className="max-w-xl px-4 py-4 font-semibold leading-6 text-primary">
                      {question.question}
                    </td>
                    <td className="px-4 py-4">
                      <CategoryBadge category={question.category} />
                    </td>
                    <td className="px-4 py-4">
                      <DifficultyBadge difficulty={question.difficulty} />
                    </td>
                    <td className="px-4 py-4">
                      <TypeBadge type={question.type} />
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold text-muted">
                      {question.tags.slice(0, 3).map((tag) => `#${tag}`).join(" ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-hairline lg:hidden">
            {filteredQuestions.map((question) => (
              <button
                className="block w-full bg-canvas px-4 py-4 text-left transition hover:bg-surface-soft"
                key={question.id}
                onClick={() => setSelectedQuestion(question)}
                type="button"
              >
                <div className="flex flex-wrap gap-2">
                  <CategoryBadge category={question.category} />
                  <DifficultyBadge difficulty={question.difficulty} />
                  <TypeBadge type={question.type} />
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-primary">
                  {question.question}
                </p>
                <p className="mt-2 font-code text-xs font-semibold text-muted">
                  {question.id}
                </p>
              </button>
            ))}
          </div>
        </section>
      </div>

      {selectedQuestion ? (
        <QuestionDetails
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
        />
      ) : (
        <div className="panel hidden h-fit p-6 text-sm leading-6 text-body xl:block">
          Select any question to inspect the full prompt, answer, explanation,
          oral response, and tags.
        </div>
      )}
    </div>
  );
}
