import {
  AlertTriangle,
  BookOpenCheck,
  ExternalLink,
  Filter,
  ListChecks,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  hdlbitsReviewSource,
  type HdlbitsReviewSection,
} from "../data/hdlbitsReview";

const sections = hdlbitsReviewSource.sections;
const totalProblems = sections.reduce(
  (sum, section) => sum + section.problems.length,
  0,
);
const areas = Array.from(new Set(sections.map((section) => section.area)));
const retrievedDate = new Date(`${hdlbitsReviewSource.retrievedAt}T00:00:00`).toLocaleDateString(
  "en-US",
  {
    day: "numeric",
    month: "short",
    year: "numeric",
  },
);

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function matchesSearch(section: HdlbitsReviewSection, query: string) {
  const terms = normalize(query).split(" ").filter(Boolean);

  if (!terms.length) {
    return true;
  }

  const searchable = normalize(
    [
      section.area,
      section.group,
      section.title,
      section.summary,
      ...section.focus,
      ...section.pitfalls,
      ...section.problems.map((problem) => problem.title),
    ].join(" "),
  );

  return terms.every((term) => searchable.includes(term));
}

export function HdlbitsReview() {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("all");
  const [selectedId, setSelectedId] = useState(sections[0]?.id ?? "");

  const filteredSections = useMemo(
    () =>
      sections.filter((section) => {
        const matchesArea = area === "all" || section.area === area;

        return matchesArea && matchesSearch(section, query);
      }),
    [area, query],
  );

  useEffect(() => {
    if (!filteredSections.some((section) => section.id === selectedId)) {
      setSelectedId(filteredSections[0]?.id ?? "");
    }
  }, [filteredSections, selectedId]);

  const selectedSection =
    filteredSections.find((section) => section.id === selectedId) ??
    filteredSections[0];
  const filteredProblemCount = filteredSections.reduce(
    (sum, section) => sum + section.problems.length,
    0,
  );
  const selectedIndex = selectedSection
    ? filteredSections.findIndex((section) => section.id === selectedSection.id)
    : -1;
  const selectedPosition = selectedIndex >= 0 ? selectedIndex + 1 : 0;
  const hasFilters = area !== "all" || query.trim().length > 0;
  const activeAreaLabel = area === "all" ? "All areas" : area;

  const resetFilters = () => {
    setArea("all");
    setQuery("");
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="panel p-5 sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge-pill bg-sky-100 text-ink-950">
                  Review map
                </span>
                <span className="badge-pill bg-surface-card text-primary">
                  Retrieved {retrievedDate}
                </span>
              </div>
              <h3 className="display-heading mt-4 text-[28px] leading-tight">
                HDLBits review map
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-body">
                HDLBits topics are grouped into review notes, likely mistakes,
                and original exercise links so the page stays focused on
                studying instead of grading.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold sm:w-[360px]">
              <div className="rounded-md border border-hairline bg-canvas px-2 py-3">
                Sections
                <span className="mt-1 block text-xl text-primary">
                  {sections.length}
                </span>
              </div>
              <div className="rounded-md border border-hairline bg-canvas px-2 py-3">
                Links
                <span className="mt-1 block text-xl text-primary">
                  {totalProblems}
                </span>
              </div>
              <div className="rounded-md border border-hairline bg-canvas px-2 py-3">
                Areas
                <span className="mt-1 block text-xl text-primary">
                  {areas.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="panel p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-canvas text-primary">
            <BookOpenCheck size={20} aria-hidden="true" />
          </div>
          <p className="mt-4 text-sm font-semibold text-primary">Source</p>
          <p className="mt-3 text-sm leading-6 text-body">
            Indexed from HDLBits. Full exercise statements stay on HDLBits; this
            app stores titles, links, and original study notes.
          </p>
          <div className="mt-4 grid gap-2">
            <a
              className="button-secondary min-h-9 px-3 py-2"
              href={hdlbitsReviewSource.sourceUrl}
              rel="noreferrer"
              target="_blank"
            >
              Main Page
              <ExternalLink size={15} aria-hidden="true" />
            </a>
            <a
              className="button-secondary min-h-9 px-3 py-2"
              href={hdlbitsReviewSource.problemSetUrl}
              rel="noreferrer"
              target="_blank"
            >
              Problem Sets
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="product-panel overflow-hidden">
        <div className="border-b border-hairline bg-surface-soft px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <Filter size={16} aria-hidden="true" />
              Filter review map
            </div>
            <p className="text-sm font-medium text-body">
              Showing {filteredSections.length} of {sections.length} sections,
              {" "}
              {filteredProblemCount} of {totalProblems} links
            </p>
            <button
              className="button-secondary min-h-9 px-3 py-2"
              disabled={!hasFilters}
              onClick={resetFilters}
              type="button"
            >
              <RotateCcw size={15} aria-hidden="true" />
              Reset
            </button>
          </div>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_260px]">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-normal text-muted">
              Search topics, exercises, focus points, and pitfalls
            </span>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                size={18}
                aria-hidden="true"
              />
              <input
                className="field pl-10"
                aria-label="Search HDLBits review topics"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try fsm, vectors, counters, testbench..."
              />
            </div>
          </label>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-normal text-muted">
              Area: {activeAreaLabel}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                className={`min-h-10 rounded-md px-3 py-2 text-sm font-semibold transition ${
                  area === "all"
                    ? "bg-action text-on-action"
                    : "bg-canvas text-primary"
                }`}
                aria-pressed={area === "all"}
                onClick={() => setArea("all")}
                type="button"
              >
                All
              </button>
              {areas.map((item) => (
                <button
                  className={`min-h-10 rounded-md px-3 py-2 text-sm font-semibold transition ${
                    area === item
                      ? "bg-action text-on-action"
                    : "bg-canvas text-primary"
                  }`}
                  aria-pressed={area === item}
                  key={item}
                  onClick={() => setArea(item)}
                  type="button"
                >
                  {item}
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
              {filteredSections.length} sections
            </div>
            <span className="font-code text-xs font-semibold text-muted">
              {filteredProblemCount} links
            </span>
          </div>

          <div className="max-h-[520px] divide-y divide-hairline overflow-y-auto lg:max-h-[calc(100vh-10rem)]">
            {filteredSections.map((section) => {
              const isSelected = section.id === selectedSection?.id;

              return (
                <button
                  className={`block w-full border-l-4 px-4 py-4 text-left transition ${
                    isSelected
                      ? "border-primary bg-surface-soft"
                      : "border-transparent bg-canvas hover:bg-surface-soft"
                  }`}
                  key={section.id}
                  aria-current={isSelected ? "true" : undefined}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedId(section.id)}
                  type="button"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="badge-pill bg-sky-100 text-ink-950">
                      {section.area}
                    </span>
                    {section.group ? (
                      <span className="badge-pill bg-surface-card text-primary">
                        {section.group}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-6 text-primary">
                    {section.title}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-muted">
                    {section.problems.length} exercise links
                  </p>
                </button>
              );
            })}

            {filteredSections.length === 0 ? (
              <div className="px-4 py-8 text-sm leading-6 text-body">
                <p className="font-semibold text-primary">
                  No HDLBits review sections match these filters.
                </p>
                <p className="mt-2">
                  Try a broader term like fsm, vector, counter, module, or
                  testbench.
                </p>
                <button
                  className="button-secondary mt-4 min-h-9 px-3 py-2"
                  onClick={resetFilters}
                  type="button"
                >
                  <RotateCcw size={15} aria-hidden="true" />
                  Reset filters
                </button>
              </div>
            ) : null}
          </div>
        </aside>

        {selectedSection ? (
          <article className="product-panel overflow-hidden">
            <div className="border-b border-hairline bg-canvas px-5 py-4">
              <div className="flex flex-wrap gap-2">
                <span className="badge-pill bg-sky-100 text-ink-950">
                  {selectedSection.area}
                </span>
                {selectedSection.group ? (
                  <span className="badge-pill bg-surface-card text-primary">
                    {selectedSection.group}
                  </span>
                ) : null}
                <span className="badge-pill bg-surface-card text-primary">
                  {selectedSection.problems.length} links
                </span>
                <span className="badge-pill bg-surface-card text-primary">
                  {selectedPosition}/{filteredSections.length}
                </span>
              </div>
              <p className="mt-4 font-code text-xs font-semibold text-muted">
                HDLBits section
              </p>
              <h3 className="display-heading mt-2 text-[28px] leading-tight">
                {selectedSection.title}
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-body">
                {selectedSection.summary}
              </p>
            </div>

            <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <section className="border-b border-hairline p-5 lg:border-b-0 lg:border-r">
                <h4 className="inline-flex items-center gap-2 text-sm font-semibold text-muted">
                  <ListChecks size={16} aria-hidden="true" />
                  What to review
                </h4>
                <ul className="mt-3 space-y-2">
                  {selectedSection.focus.map((item) => (
                    <li
                      className="rounded-md border border-hairline bg-surface-soft px-3 py-2 text-sm leading-6 text-primary"
                      key={item}
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <h4 className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-muted">
                  <AlertTriangle size={16} aria-hidden="true" />
                  Common pitfalls
                </h4>
                <div className="mt-3 grid gap-2">
                  {selectedSection.pitfalls.map((item) => (
                    <div
                      className="rounded-md border border-hairline bg-canvas px-3 py-2 text-sm leading-6 text-body"
                      key={item}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section className="p-5">
                <h4 className="text-sm font-semibold text-muted">
                  Original HDLBits exercise links
                </h4>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {selectedSection.problems.map((problem) => (
                    <a
                      className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-hairline bg-canvas px-3 py-2 text-sm font-semibold leading-5 text-primary transition hover:bg-surface-soft"
                      href={problem.url}
                      key={`${problem.title}-${problem.url}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span>{problem.title}</span>
                      <ExternalLink
                        className="shrink-0 text-muted"
                        size={14}
                        aria-hidden="true"
                      />
                    </a>
                  ))}
                </div>

                <div className="mt-5 rounded-md border border-hairline bg-surface-soft px-4 py-3 text-sm leading-6 text-body">
                  {hdlbitsReviewSource.usageNote}
                </div>
              </section>
            </div>
          </article>
        ) : (
          <div className="panel p-8 text-sm leading-6 text-body">
            Pick a HDLBits section to review focus points, pitfalls, and
            original practice links.
          </div>
        )}
      </div>
    </div>
  );
}
