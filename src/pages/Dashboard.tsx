import {
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  ClipboardList,
  Code2,
  Download,
  FileCode2,
  FileJson,
  Layers3,
  LibraryBig,
  Play,
  Target,
  Upload,
} from "lucide-react";
import { useRef } from "react";
import { CategoryBadge } from "../components/Badge";
import { ProgressBar } from "../components/ProgressBar";
import type { AnalyticsBucket, AnalyticsState } from "../types";
import { categories, categoryCounts, questions } from "../utils/questions";

type DashboardPage =
  | "bank"
  | "code"
  | "programming-review"
  | "practice"
  | "mock"
  | "cheatsheet"
  | "hdlbits-review"
  | "rtl-practice"
  | "verilog-review";

function accuracy(bucket?: AnalyticsBucket) {
  if (!bucket || bucket.attempted === 0) {
    return 0;
  }

  return Math.round((bucket.correct / bucket.attempted) * 100);
}

function highestFocusArea(analytics: AnalyticsState) {
  return (
    Object.entries(analytics.byCategory).sort(
      ([, leftBucket], [, rightBucket]) => rightBucket.missed - leftBucket.missed,
    )[0]?.[0] ?? "No focus area yet"
  );
}

function Metric({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: typeof BookOpenCheck;
}) {
  return (
    <div className="rounded-md border border-hairline bg-canvas px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-normal text-muted">
          {label}
        </p>
        <Icon size={17} aria-hidden="true" />
      </div>
      <p className="display-heading mt-3 text-3xl leading-tight">{value}</p>
      <p className="mt-2 text-xs leading-5 text-body">{detail}</p>
    </div>
  );
}

function ActionRow({
  title,
  description,
  label,
  icon: Icon,
  primary = false,
  onClick,
}: {
  title: string;
  description: string;
  label: string;
  icon: typeof BookOpenCheck;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition hover:bg-surface-soft ${
        primary ? "bg-surface-soft" : "bg-canvas"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className="flex min-w-0 gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${
            primary ? "bg-action text-on-action" : "bg-surface-card text-primary"
          }`}
        >
          <Icon size={19} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-primary">{title}</span>
          <span className="mt-1 block text-xs leading-5 text-body">
            {description}
          </span>
        </span>
      </span>
      <span
        className={`shrink-0 rounded-md px-3 py-2 text-xs font-semibold ${
          primary ? "bg-action text-on-action" : "bg-surface-soft text-primary"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function ResourceTile({
  title,
  description,
  meta,
  icon: Icon,
  onClick,
}: {
  title: string;
  description: string;
  meta: string;
  icon: typeof BookOpenCheck;
  onClick: () => void;
}) {
  return (
    <button
      className="product-panel flex h-full min-h-40 flex-col justify-between p-5 text-left transition hover:bg-surface-soft"
      onClick={onClick}
      type="button"
    >
      <span>
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-card text-primary">
          <Icon size={19} aria-hidden="true" />
        </span>
        <span className="mt-4 block text-base font-semibold text-primary">
          {title}
        </span>
        <span className="mt-2 block text-sm leading-6 text-body">
          {description}
        </span>
      </span>
      <span className="mt-4 font-code text-xs font-semibold text-muted">
        {meta}
      </span>
    </button>
  );
}

export function Dashboard({
  analytics,
  importStatus,
  navigate,
  onExportProgress,
  onImportProgress,
}: {
  analytics: AnalyticsState;
  importStatus?: string;
  navigate: (page: DashboardPage | string) => void;
  onExportProgress: () => void;
  onImportProgress: (file: File) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const maxCategoryCount = Math.max(...categoryCounts.map((item) => item.count));
  const overallAccuracy = accuracy({
    attempted: analytics.totalAttempted,
    correct: analytics.totalCorrect,
    missed: analytics.totalMissed,
  });
  const focusArea = highestFocusArea(analytics);

  return (
    <div className="space-y-6">
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="panel p-6 sm:p-8">
          <span className="badge-pill bg-surface-soft text-primary">
            Local interview prep
          </span>
          <h2 className="display-heading mt-5 text-4xl leading-tight">
            Start with the right mode.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-body">
            Use one simple prep loop: review the idea, practice the question,
            then run a mock when the topic feels warm.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Metric
              detail={`${categories.length} hardware interview categories`}
              icon={BookOpenCheck}
              label="Bank"
              value={questions.length}
            />
            <Metric
              detail="Answered in practice and mock flows"
              icon={BarChart3}
              label="Attempts"
              value={analytics.totalAttempted}
            />
            <Metric
              detail={`${analytics.totalMissed} responses marked for review`}
              icon={Target}
              label="Accuracy"
              value={`${overallAccuracy}%`}
            />
          </div>
        </div>

        <div className="product-panel overflow-hidden">
          <div className="border-b border-hairline bg-canvas px-5 py-4">
            <p className="text-sm font-semibold text-primary">Start here</p>
            <p className="mt-1 text-xs leading-5 text-body">
              Recommended order for a normal prep session.
            </p>
          </div>
          <div className="divide-y divide-hairline">
            <ActionRow
              description="Refresh concepts, HDLBits topics, or likely coding-interview asks."
              icon={FileCode2}
              label="1"
              onClick={() => navigate("programming-review")}
              title="Review first"
            />
            <ActionRow
              description="Pick one topic and get immediate feedback after each answer."
              icon={Play}
              label="2"
              onClick={() => navigate("practice")}
              primary
              title="Practice next"
            />
            <ActionRow
              description="Run a timed round, flashcards, or the NVIDIA preset."
              icon={Layers3}
              label="3"
              onClick={() => navigate("mock")}
              title="Mock last"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="display-heading text-[28px] leading-tight">
              Review library
            </h2>
            <p className="mt-1 text-sm leading-6 text-body">
              Reference material is grouped by how you actually study: concepts,
              code prompts, HDLBits, RTL design, Verilog review, and quick sheets.
            </p>
          </div>
          <button
            className="button-secondary w-fit px-3 py-2"
            onClick={() => navigate("bank")}
            type="button"
          >
            <LibraryBig size={16} aria-hidden="true" />
            Open Bank
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ResourceTile
            description="C++, Python, DFS/BFS, stack, queue, graph, and complexity notes."
            icon={FileCode2}
            meta="programming"
            onClick={() => navigate("programming-review")}
            title="Programming"
          />
          <ResourceTile
            description="LeetCode-style split view for RTL coding prompts and solutions."
            icon={Code2}
            meta="code view"
            onClick={() => navigate("code")}
            title="Code Questions"
          />
          <ResourceTile
            description="20 topic sections and 182 original HDLBits exercise links."
            icon={BookOpenCheck}
            meta="HDLBits"
            onClick={() => navigate("hdlbits-review")}
            title="HDLBits"
          />
          <ResourceTile
            description="RTL design drills with answer notes and reference code."
            icon={BrainCircuit}
            meta="RTL drills"
            onClick={() => navigate("rtl-practice")}
            title="RTL Practice"
          />
          <ResourceTile
            description="Searchable Verilog interview cards imported from the local PDF."
            icon={ClipboardList}
            meta="375 cards"
            onClick={() => navigate("verilog-review")}
            title="Verilog"
          />
          <ResourceTile
            description="Fast refreshers for RTL, DV, CDC, STA, PD, and EDA algorithms."
            icon={FileCode2}
            meta="cheatsheet"
            onClick={() => navigate("cheatsheet")}
            title="Cheatsheet"
          />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_370px]">
        <div className="product-panel p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="display-heading text-[28px] leading-tight">
                Category coverage
              </h2>
              <p className="mt-2 text-sm text-body">
                Coverage stays scan-friendly so weak hardware areas are easy to
                spot before a mock round.
              </p>
            </div>
            <CategoryBadge category="GitHub Pages ready" />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {categoryCounts.map((item) => (
              <div
                className="rounded-md border border-hairline bg-canvas p-4"
                key={item.category}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-primary">
                    {item.category}
                  </span>
                  <span className="text-sm font-semibold text-muted">
                    {item.count}
                  </span>
                </div>
                <ProgressBar value={item.count} max={maxCategoryCount} />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5">
          <div className="product-panel p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-card text-primary">
              <Target size={19} aria-hidden="true" />
            </div>
            <h2 className="display-heading mt-4 text-[24px] leading-tight">
              Progress focus
            </h2>
            <p className="mt-2 text-sm leading-6 text-body">
              Accuracy is computed locally from browser storage. No account,
              backend, or tracking script is involved.
            </p>

            <div className="mt-5 grid gap-3">
              <div className="rounded-md border border-hairline bg-canvas p-4">
                <p className="text-xs font-semibold uppercase tracking-normal text-muted">
                  Highest focus area
                </p>
                <p className="mt-2 text-sm font-semibold text-primary">
                  {focusArea}
                </p>
              </div>
              {(["easy", "medium", "hard"] as const).map((difficulty) => (
                <ProgressBar
                  key={difficulty}
                  label={`${difficulty} - ${
                    analytics.byDifficulty[difficulty]?.attempted ?? 0
                  } attempts`}
                  value={accuracy(analytics.byDifficulty[difficulty])}
                  max={100}
                />
              ))}
            </div>
          </div>

          <div className="product-panel p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-card text-primary">
              <FileJson size={19} aria-hidden="true" />
            </div>
            <h2 className="display-heading mt-4 text-[24px] leading-tight">
              Progress file
            </h2>
            <p className="mt-2 text-sm leading-6 text-body">
              Export saved review items and analytics, or import the same JSON
              on another browser.
            </p>

            <input
              accept="application/json,.json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  onImportProgress(file);
                  event.target.value = "";
                }
              }}
              ref={fileInputRef}
              type="file"
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <button
                className="button-primary"
                onClick={onExportProgress}
                type="button"
              >
                <Download size={17} aria-hidden="true" />
                Export JSON
              </button>
              <button
                className="button-secondary"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <Upload size={17} aria-hidden="true" />
                Import JSON
              </button>
            </div>
            {importStatus ? (
              <p className="mt-4 rounded-md bg-surface-soft px-3 py-2 text-sm text-body">
                {importStatus}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
