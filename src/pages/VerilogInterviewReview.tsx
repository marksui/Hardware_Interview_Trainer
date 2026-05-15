import { FileText, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { RichText } from "../components/RichText";

interface VerilogReviewSectionMap {
  interpretation?: string;
  knowledge?: string;
  answer?: string;
  deepDive?: string;
  notes?: string;
}

interface VerilogReviewItem {
  id: string;
  number: string;
  title: string;
  chapterNumber: string;
  chapterTitle: string;
  sectionNumber: string;
  sectionTitle: string;
  sections: VerilogReviewSectionMap;
}

interface VerilogReviewPayload {
  sourceTitle: string;
  sourceFile: string;
  importedAt: string;
  chapterCount: number;
  questionCount: number;
  chapters: Array<{
    number: string;
    title: string;
    count: number;
  }>;
  items: VerilogReviewItem[];
}

const emptyPayload: VerilogReviewPayload = {
  sourceTitle: "",
  sourceFile: "",
  importedAt: "",
  chapterCount: 0,
  questionCount: 0,
  chapters: [],
  items: [],
};

const reviewSections = [
  { key: "interpretation", label: "解读" },
  { key: "knowledge", label: "知识点" },
  { key: "answer", label: "答案" },
  { key: "deepDive", label: "拓展思考" },
  { key: "notes", label: "Notes" },
] satisfies Array<{ key: keyof VerilogReviewSectionMap; label: string }>;

function getSearchText(item: VerilogReviewItem) {
  return [
    item.number,
    item.title,
    item.chapterTitle,
    item.sectionTitle,
    ...Object.values(item.sections),
  ]
    .join(" ")
    .toLowerCase();
}

export function VerilogInterviewReview() {
  const [payload, setPayload] = useState<VerilogReviewPayload>(emptyPayload);
  const [query, setQuery] = useState("");
  const [chapter, setChapter] = useState("all");
  const [status, setStatus] = useState("Loading Verilog review bank...");

  useEffect(() => {
    let isMounted = true;

    fetch("data/verilogInterviewReview.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load Verilog review JSON.");
        }

        return response.json() as Promise<VerilogReviewPayload>;
      })
      .then((data) => {
        if (isMounted) {
          setPayload(data);
          setStatus("");
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setStatus(error instanceof Error ? error.message : "Could not load review bank.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const indexedItems = useMemo(
    () =>
      payload.items.map((item) => ({
        item,
        searchText: getSearchText(item),
      })),
    [payload.items],
  );

  const queryTerms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const filteredItems = indexedItems
    .filter(({ item, searchText }) => {
      const matchesChapter = chapter === "all" || item.chapterNumber === chapter;
      const matchesQuery = queryTerms.every((term) => searchText.includes(term));

      return matchesChapter && matchesQuery;
    })
    .map(({ item }) => item);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="panel p-6">
          <p className="text-sm font-semibold text-muted">Imported prompts</p>
          <p className="mt-2 display-heading text-3xl">{payload.questionCount || "..."}</p>
          <p className="mt-2 text-sm leading-6 text-body">
            Structured from the local Verilog interview PDF into searchable review cards.
          </p>
        </div>
        <div className="panel p-6">
          <p className="text-sm font-semibold text-muted">Chapters</p>
          <p className="mt-2 display-heading text-3xl">{payload.chapterCount || "..."}</p>
          <p className="mt-2 text-sm leading-6 text-body">
            Covers RTL, FSMs, memory, CDC, STA, low power, DFT, verification, and SoC topics.
          </p>
        </div>
        <div className="product-panel p-6">
          <p className="text-sm font-semibold text-muted">Source</p>
          <p className="mt-2 text-lg font-semibold text-primary">
            {payload.sourceFile || "Verilog interview PDF"}
          </p>
          <p className="mt-2 text-sm leading-6 text-body">
            Static JSON only. No backend, no tracking, and still GitHub Pages-ready.
          </p>
        </div>
      </section>

      <section className="product-panel p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
          <label className="relative block">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={17}
            />
            <input
              className="field pl-10"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Verilog, CDC, FIFO, STA, assertion, synthesis..."
              value={query}
            />
          </label>
          <select
            className="field"
            onChange={(event) => setChapter(event.target.value)}
            value={chapter}
          >
            <option value="all">All chapters</option>
            {payload.chapters.map((item) => (
              <option key={item.number} value={item.number}>
                {item.number}. {item.title} ({item.count})
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
          <span>
            Showing {filteredItems.length} of {payload.questionCount || 0} review cards
          </span>
          {query || chapter !== "all" ? (
            <button
              className="button-secondary min-h-9 px-3 py-2"
              onClick={() => {
                setQuery("");
                setChapter("all");
              }}
              type="button"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </section>

      {status ? (
        <div className="product-panel p-6 text-sm font-semibold text-muted">{status}</div>
      ) : null}

      <section className="space-y-4">
        {filteredItems.map((item) => (
          <details className="product-panel group overflow-hidden" key={item.id}>
            <summary className="grid cursor-pointer list-none gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-pill bg-surface-soft text-primary">
                    {item.number}
                  </span>
                  <span className="badge-pill bg-surface-soft text-muted">
                    {item.chapterNumber}. {item.chapterTitle}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-7 text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {item.sectionNumber} · {item.sectionTitle}
                </p>
              </div>
              <span className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-hairline px-3 text-sm font-semibold text-primary">
                <FileText size={16} aria-hidden="true" />
                Review
              </span>
            </summary>
            <div className="space-y-4 border-t border-hairline p-5">
              {reviewSections.map(({ key, label }) => {
                const text = item.sections[key];

                return text ? (
                  <article className="rounded-lg border border-hairline bg-canvas p-4" key={key}>
                    <h4 className="mb-3 text-sm font-semibold text-primary">{label}</h4>
                    <RichText text={text} textClassName="text-sm leading-7 text-body" />
                  </article>
                ) : null;
              })}
            </div>
          </details>
        ))}
      </section>
    </div>
  );
}
