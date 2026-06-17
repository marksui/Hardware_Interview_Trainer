import {
  BookOpenCheck,
  BrainCircuit,
  ClipboardList,
  Code2,
  FileCode2,
  FileText,
  Gauge,
  History,
  Info,
  LibraryBig,
  Menu,
  Moon,
  Sun,
  Timer,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { About } from "./pages/About";
import { Cheatsheet } from "./pages/Cheatsheet";
import { CodeQuestions } from "./pages/CodeQuestions";
import { Dashboard } from "./pages/Dashboard";
import { HdlbitsReview } from "./pages/HdlbitsReview";
import { MockInterviewMode } from "./pages/MockInterviewMode";
import { PracticeMode } from "./pages/PracticeMode";
import { ProgrammingReview } from "./pages/ProgrammingReview";
import { QuestionBank } from "./pages/QuestionBank";
import { RtlDesignPracticeProblems } from "./pages/RtlDesignPracticeProblems";
import { VerilogInterviewReview } from "./pages/VerilogInterviewReview";
import { VersionHistory } from "./pages/VersionHistory";
import type { ThemePreference } from "./types";
import {
  getAnalytics,
  getProgressExport,
  getThemePreference,
  importProgress,
  setThemePreference,
} from "./utils/storage";
import { APP_VERSION } from "./utils/version";

type PageId =
  | "dashboard"
  | "bank"
  | "code"
  | "programming-review"
  | "practice"
  | "mock"
  | "cheatsheet"
  | "hdlbits-review"
  | "about"
  | "rtl-practice"
  | "verilog-review"
  | "versions";

const pageMeta: Record<PageId, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Home",
    subtitle: "Choose a review, practice, or mock flow without digging through the app.",
  },
  bank: {
    title: "Question Bank",
    subtitle: "Search and filter hardware, SoC, timing, physical design, and EDA prompts.",
  },
  code: {
    title: "Code Questions",
    subtitle: "View every RTL coding prompt with a LeetCode-style problem and reference implementation layout.",
  },
  "programming-review": {
    title: "Programming Review",
    subtitle: "Review likely C++, Python, DFS, BFS, stack, queue, graph, and complexity concepts.",
  },
  practice: {
    title: "Practice Mode",
    subtitle: "Choose a topic and difficulty, answer one prompt at a time, and review feedback immediately.",
  },
  mock: {
    title: "Mock Interview Mode",
    subtitle: "Run random, custom, NVIDIA-targeted, or flashcard-style interview rounds.",
  },
  cheatsheet: {
    title: "Cheatsheet",
    subtitle: "Fast refreshers for RTL, DV, CDC, STA, physical design, and EDA algorithms.",
  },
  "hdlbits-review": {
    title: "HDLBits Review",
    subtitle: "Review HDLBits topic coverage with learning points, pitfalls, and links back to the original exercises.",
  },
  about: {
    title: "About",
    subtitle: "Why this local-first trainer exists and how it supports hardware interview preparation.",
  },
  "rtl-practice": {
    title: "RTL Design Practice Problems",
    subtitle: "A focused set of RTL design drills with answer checklists for interview preparation.",
  },
  "verilog-review": {
    title: "Verilog Interview Review",
    subtitle: "Searchable review cards imported from the local Verilog interview PDF.",
  },
  versions: {
    title: "Version History",
    subtitle: "Release notes for visible product, documentation, and deployment updates.",
  },
};

type NavItem = { id: PageId; label: string; icon: typeof Gauge };

const primaryNavItems = [
  { id: "dashboard", label: "Home", icon: Gauge },
  { id: "practice", label: "Practice", icon: BrainCircuit },
  { id: "code", label: "Code", icon: Code2 },
  { id: "programming-review", label: "Review", icon: FileCode2 },
  { id: "mock", label: "Mock", icon: Timer },
] satisfies NavItem[];

const secondaryNavItems = [
  { id: "bank", label: "Bank", icon: LibraryBig },
  { id: "cheatsheet", label: "Cheatsheet", icon: ClipboardList },
  { id: "hdlbits-review", label: "HDLBits", icon: BookOpenCheck },
  { id: "rtl-practice", label: "RTL Practice", icon: Code2 },
  { id: "verilog-review", label: "Verilog", icon: FileText },
  { id: "about", label: "About", icon: Info },
  { id: "versions", label: "Versions", icon: History },
] satisfies NavItem[];

const navItems = [...primaryNavItems, ...secondaryNavItems];

function getPageFromHash(): PageId {
  const hash = window.location.hash.replace("#", "");
  const route = navItems.find((item) => item.id === hash);

  return route?.id ?? "dashboard";
}

export default function App() {
  const [page, setPage] = useState<PageId>(() => getPageFromHash());
  const [analytics, setAnalytics] = useState(() => getAnalytics());
  const [theme, setTheme] = useState<ThemePreference>(() => getThemePreference());
  const [importStatus, setImportStatus] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const meta = pageMeta[page];
  const isSecondaryPage = secondaryNavItems.some((item) => item.id === page);

  const refreshAnalytics = () => {
    setAnalytics(getAnalytics());
  };

  const refreshProgress = () => {
    setAnalytics(getAnalytics());
    setTheme(getThemePreference());
  };

  const navigate = (nextPage: PageId | string) => {
    const resolvedPage = navItems.find((item) => item.id === nextPage)?.id ?? "dashboard";
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.location.hash = resolvedPage;
    setPage(resolvedPage);
    setMenuOpen(false);
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    const handleHashChange = () => {
      setPage(getPageFromHash());
      setMenuOpen(false);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    setThemePreference(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  const handleExportProgress = () => {
    const payload = JSON.stringify(getProgressExport(), null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `hardware-interview-trainer-progress-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setImportStatus("Progress exported as JSON.");
  };

  const handleImportProgress = async (file: File) => {
    try {
      importProgress(JSON.parse(await file.text()));
      refreshProgress();
      setImportStatus("Progress imported successfully.");
    } catch (error) {
      setImportStatus(
        error instanceof Error ? error.message : "Could not import progress JSON.",
      );
    }
  };

  const content = useMemo(() => {
    switch (page) {
      case "bank":
        return <QuestionBank />;
      case "code":
        return <CodeQuestions />;
      case "programming-review":
        return <ProgrammingReview />;
      case "practice":
        return <PracticeMode onReviewItemsChanged={refreshAnalytics} />;
      case "mock":
        return <MockInterviewMode onReviewItemsChanged={refreshAnalytics} />;
      case "cheatsheet":
        return <Cheatsheet />;
      case "hdlbits-review":
        return <HdlbitsReview />;
      case "about":
        return <About />;
      case "rtl-practice":
        return <RtlDesignPracticeProblems />;
      case "verilog-review":
        return <VerilogInterviewReview />;
      case "versions":
        return <VersionHistory />;
      case "dashboard":
      default:
        return (
          <Dashboard
            analytics={analytics}
            importStatus={importStatus}
            navigate={navigate}
            onExportProgress={handleExportProgress}
            onImportProgress={handleImportProgress}
          />
        );
    }
  }, [analytics, importStatus, page]);

  return (
    <div className="min-h-screen bg-canvas text-primary">
      <header className="sticky top-0 z-30 border-b border-hairline-soft bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-[1200px] items-center justify-between gap-3 px-4 py-2 sm:gap-4 sm:px-6 lg:px-8">
          <button
            className="flex min-w-0 flex-1 items-center gap-3 text-left lg:flex-none"
            onClick={() => navigate("dashboard")}
            type="button"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-action text-on-action">
              <BookOpenCheck size={22} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="display-heading truncate text-[15px] leading-tight sm:text-lg">
                Hardware Interview Trainer
              </h1>
              <p className="truncate text-[11px] font-medium uppercase leading-5 tracking-normal text-muted sm:text-xs">
                v{APP_VERSION} · RTL · DV · STA · PD
              </p>
            </div>
          </button>

          <div className="order-3 flex items-center gap-2">
            <button
              className="icon-button"
              onClick={toggleTheme}
              title={theme === "dark" ? "Use light mode" : "Use dark mode"}
              type="button"
            >
              {theme === "dark" ? (
                <Sun size={18} aria-hidden="true" />
              ) : (
                <Moon size={18} aria-hidden="true" />
              )}
            </button>

            <button
              aria-expanded={menuOpen}
              className={`icon-button ${
                isSecondaryPage ? "border-primary bg-surface-soft" : ""
              }`}
              onClick={() => setMenuOpen((isOpen) => !isOpen)}
              title="Open navigation menu"
              type="button"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>

          <nav
            className="order-2 ml-auto hidden items-center gap-1 rounded-full bg-surface-soft p-1 lg:flex"
            aria-label="Main navigation"
          >
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === page;

              return (
                <button
                  className={`inline-flex min-h-9 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-canvas text-primary shadow-panel"
                      : "text-muted"
                  }`}
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  type="button"
                >
                  <Icon size={16} aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {menuOpen ? (
          <nav
            className="border-t border-hairline-soft bg-canvas px-4 py-3 sm:px-6 lg:px-8"
            aria-label="Collapsed navigation"
          >
            <div className="mx-auto grid max-w-[1200px] gap-3 lg:grid-cols-[1fr_auto]">
              <div className="grid gap-2 lg:hidden">
                <p className="px-3 text-xs font-semibold uppercase tracking-normal text-muted">
                  Main
                </p>
                {primaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === page;

                  return (
                    <button
                      className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-semibold transition ${
                        isActive
                          ? "bg-action text-on-action"
                          : "bg-surface-soft text-primary"
                      }`}
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      type="button"
                    >
                      <span className="flex items-center gap-2">
                        <Icon size={16} aria-hidden="true" />
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-2 sm:grid-cols-3 lg:col-start-2 lg:min-w-[700px] lg:grid-cols-4">
                <p className="px-3 text-xs font-semibold uppercase tracking-normal text-muted sm:col-span-3 lg:col-span-4">
                  Reference
                </p>
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === page;

                  return (
                    <button
                      className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-semibold transition ${
                        isActive
                          ? "bg-action text-on-action"
                          : "bg-surface-soft text-primary"
                      }`}
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      type="button"
                    >
                      <span className="flex items-center gap-2">
                        <Icon size={16} aria-hidden="true" />
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
        ) : null}
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-4xl">
          <h2 className="display-heading text-4xl leading-tight sm:text-5xl">
            {meta.title}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-body">
            {meta.subtitle}
          </p>
        </div>
        {content}
      </main>
      <footer className="mt-24 bg-surface-dark text-on-dark-soft">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div>
              <div className="flex items-center gap-3 text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-950">
                  <BookOpenCheck size={21} aria-hidden="true" />
                </div>
                <span className="display-heading text-xl text-white">
                  Hardware Interview Trainer
                </span>
              </div>
              <p className="mt-4 max-w-md text-sm leading-6 text-on-dark-soft">
                A local-first question bank for ECE and computer engineering
                interview preparation.
              </p>
              <button
                className="mt-4 inline-flex rounded-full bg-surface-dark-elevated px-3 py-1 text-xs font-semibold text-white"
                onClick={() => navigate("versions")}
                type="button"
              >
                Current version v{APP_VERSION}
              </button>
              <button
                className="mt-3 block text-left text-sm font-semibold text-white"
                onClick={() => navigate("rtl-practice")}
                type="button"
              >
                RTL Design Practice Problems
              </button>
              <button
                className="mt-2 block text-left text-sm font-semibold text-white"
                onClick={() => navigate("verilog-review")}
                type="button"
              >
                Verilog Interview Review
              </button>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Practice loops</h3>
              <div className="mt-4 grid gap-2 text-sm">
                <button className="text-left text-on-dark-soft" onClick={() => navigate("practice")} type="button">
                  Practice Mode
                </button>
                <button className="text-left text-on-dark-soft" onClick={() => navigate("code")} type="button">
                  Code Questions
                </button>
                <button className="text-left text-on-dark-soft" onClick={() => navigate("programming-review")} type="button">
                  Programming Review
                </button>
                <button className="text-left text-on-dark-soft" onClick={() => navigate("mock")} type="button">
                  Mock Interview
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">Reference</h3>
              <div className="mt-4 grid gap-2 text-sm">
                <button className="text-left text-on-dark-soft" onClick={() => navigate("bank")} type="button">
                  Question Bank
                </button>
                <button className="text-left text-on-dark-soft" onClick={() => navigate("cheatsheet")} type="button">
                  Cheatsheet
                </button>
                <button className="text-left text-on-dark-soft" onClick={() => navigate("hdlbits-review")} type="button">
                  HDLBits Review
                </button>
                <button className="text-left text-on-dark-soft" onClick={() => navigate("about")} type="button">
                  About
                </button>
                <button className="text-left text-on-dark-soft" onClick={() => navigate("versions")} type="button">
                  Version History
                </button>
                <a
                  className="text-left text-on-dark-soft"
                  href="https://marksui.github.io/logic-cmos-studio/"
                  rel="noreferrer"
                  target="_blank"
                >
                  Logic & CMOS Studio
                </a>
                <span className="text-muted-soft">No backend · LocalStorage only</span>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8">
            <div className="flex flex-col gap-3 text-sm text-muted-soft sm:flex-row sm:items-center sm:justify-between">
              <span>Built with React, Vite, TypeScript, Tailwind CSS, and LocalStorage.</span>
              <button
                className="text-left font-semibold text-white"
                onClick={() => navigate("versions")}
                type="button"
              >
                View version history
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
