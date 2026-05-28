import {
  AlertTriangle,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  Code2,
  Download,
  FileCode2,
  FileJson,
  Layers3,
  Play,
  Target,
  Upload,
} from "lucide-react";
import { useRef } from "react";
import { CategoryBadge } from "../components/Badge";
import { ProgressBar } from "../components/ProgressBar";
import type { AnalyticsBucket, AnalyticsState } from "../types";
import { categories, categoryCounts, questions } from "../utils/questions";

function StatCard({
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
    <div className="panel p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="display-heading mt-2 text-4xl">
            {value}
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-canvas text-primary">
          <Icon size={22} aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-body">{detail}</p>
    </div>
  );
}

function accuracy(bucket?: AnalyticsBucket) {
  if (!bucket || bucket.attempted === 0) {
    return 0;
  }

  return Math.round((bucket.correct / bucket.attempted) * 100);
}

function mostMissedCategory(analytics: AnalyticsState) {
  return (
    Object.entries(analytics.byCategory).sort(
      ([, leftBucket], [, rightBucket]) => rightBucket.missed - leftBucket.missed,
    )[0]?.[0] ?? "No misses yet"
  );
}

export function Dashboard({
  wrongCount,
  analytics,
  importStatus,
  navigate,
  onExportProgress,
  onImportProgress,
}: {
  wrongCount: number;
  analytics: AnalyticsState;
  importStatus?: string;
  navigate: (page: string) => void;
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
  const missedCategory = mostMissedCategory(analytics);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-3">
        <StatCard
          detail={`${categories.length} focused categories across RTL, DV, timing, and physical implementation.`}
          icon={BookOpenCheck}
          label="Question bank"
          value={questions.length}
        />
        <StatCard
          detail="Saved automatically when practice or mock answers miss the mark."
          icon={AlertTriangle}
          label="Wrong questions"
          value={wrongCount}
        />
        <StatCard
          detail={`${overallAccuracy}% overall accuracy across all answered practice, mock, and retry prompts.`}
          icon={BarChart3}
          label="Attempted"
          value={analytics.totalAttempted}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="panel p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="display-heading text-[28px] leading-tight">
                Category coverage
              </h2>
              <p className="mt-2 text-sm text-body">
                The seed bank starts broad, and the physical-design pack adds deeper
                timing, routing, and signoff coverage.
              </p>
            </div>
            <CategoryBadge category="GitHub Pages ready" />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {categoryCounts.map((item) => (
              <div key={item.category} className="product-panel p-4">
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

        <div className="panel p-6">
          <div className="flex h-full flex-col">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-canvas text-primary">
                <BrainCircuit size={22} aria-hidden="true" />
              </div>
              <h2 className="display-heading mt-4 text-[28px] leading-tight">
                Start training
              </h2>
              <p className="mt-2 text-sm leading-6 text-body">
                Practice for targeted repetition, inspect RTL coding prompts,
                review programming concepts, then switch to timed mock rounds.
              </p>
            </div>

            <div className="product-panel mt-6 p-4">
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <div>
                  <p className="text-xs font-medium text-muted">Today</p>
                  <p className="text-sm font-semibold text-primary">STA warmup</p>
                </div>
                <span className="badge-pill bg-emerald-100 text-ink-950">10Q</span>
              </div>
              <div className="mt-4 grid grid-cols-5 gap-2">
                {["RTL", "DV", "CDC", "STA", "EDA"].map((item, index) => (
                  <div
                    className={`rounded-md px-2 py-3 text-center text-xs font-semibold ${
                      index === 3 ? "bg-action text-on-action" : "bg-surface-soft text-primary"
                    }`}
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <button
                className="button-primary"
                onClick={() => navigate("practice")}
                type="button"
              >
                <Play size={17} aria-hidden="true" />
                Practice Mode
              </button>
              <button
                className="button-secondary"
                onClick={() => navigate("code")}
                type="button"
              >
                <Code2 size={17} aria-hidden="true" />
                Code Questions
              </button>
              <button
                className="button-secondary"
                onClick={() => navigate("programming-review")}
                type="button"
              >
                <FileCode2 size={17} aria-hidden="true" />
                Programming Review
              </button>
              <button
                className="button-secondary"
                onClick={() => navigate("mock")}
                type="button"
              >
                <Layers3 size={17} aria-hidden="true" />
                Mock Interview Mode
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="panel p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="display-heading text-[28px] leading-tight">
                Local analytics
              </h2>
              <p className="mt-2 text-sm text-body">
                Accuracy is computed only in your browser from LocalStorage.
                Nothing is sent to a server.
              </p>
            </div>
            <span className="badge-pill bg-surface-soft text-primary">
              No tracking
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="product-panel p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-card text-primary">
                  <Target size={18} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Most missed category
                  </p>
                  <p className="text-sm text-muted">{missedCategory}</p>
                </div>
              </div>
            </div>
            <div className="product-panel p-4">
              <p className="text-sm font-semibold text-primary">
                Difficulty accuracy
              </p>
              <div className="mt-4 space-y-3">
                {(["easy", "medium", "hard"] as const).map((difficulty) => (
                  <ProgressBar
                    key={difficulty}
                    label={`${difficulty} · ${
                      analytics.byDifficulty[difficulty]?.attempted ?? 0
                    } attempts`}
                    value={accuracy(analytics.byDifficulty[difficulty])}
                    max={100}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {categories.map((category) => {
              const bucket = analytics.byCategory[category];

              return (
                <div className="product-panel p-4" key={category}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-primary">
                      {category}
                    </span>
                    <span className="text-sm font-semibold text-muted">
                      {accuracy(bucket)}%
                    </span>
                  </div>
                  <ProgressBar value={accuracy(bucket)} max={100} />
                  <p className="mt-2 text-xs text-muted">
                    {bucket?.attempted ?? 0} attempted · {bucket?.missed ?? 0} missed
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex h-full flex-col">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-canvas text-primary">
                <FileJson size={22} aria-hidden="true" />
              </div>
              <h2 className="display-heading mt-4 text-[28px] leading-tight">
                Progress portability
              </h2>
              <p className="mt-2 text-sm leading-6 text-body">
                Export wrong questions and accuracy analytics as a JSON file, or
                import that JSON on another browser.
              </p>
            </div>

            <div className="product-panel mt-6 p-4">
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                <div className="rounded-md bg-surface-soft px-2 py-3">
                  Wrong
                  <span className="mt-1 block text-lg text-primary">{wrongCount}</span>
                </div>
                <div className="rounded-md bg-surface-soft px-2 py-3">
                  Attempts
                  <span className="mt-1 block text-lg text-primary">
                    {analytics.totalAttempted}
                  </span>
                </div>
                <div className="rounded-md bg-surface-soft px-2 py-3">
                  Accuracy
                  <span className="mt-1 block text-lg text-primary">
                    {overallAccuracy}%
                  </span>
                </div>
              </div>
            </div>

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
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
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
