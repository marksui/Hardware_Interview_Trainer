export const APP_VERSION = "1.2.0";

export const RELEASE_DATE = "2026-05-13";

export const CHANGELOG = [
  {
    version: "1.2.0",
    date: "2026-05-13",
    title: "Physical design interview pack",
    changes: [
      "Added 50 original physical-design interview questions adapted from a downloaded study PDF's topic coverage.",
      "Expanded coverage across STA, placement, routing, CDC, synthesis, EM/IR, DVFS, advanced-node DRC, clock mesh, and 3DIC topics.",
      "Reduced bright pastel badge colors in dark mode for a calmer technical UI.",
      "Updated the question bank total to 130 questions.",
    ],
  },
  {
    version: "1.1.1",
    date: "2026-05-13",
    title: "Dedicated version history page",
    changes: [
      "Moved release notes out of the footer into a standalone Version History page.",
      "Added a navigation route and footer link for version history.",
      "Kept the footer compact with only the current version and a release-notes entry point.",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-05-13",
    title: "Portfolio-ready release",
    changes: [
      "Added About page for project motivation and architecture rationale.",
      "Added local-only analytics for category accuracy, difficulty accuracy, attempts, and missed areas.",
      "Added JSON progress export/import.",
      "Added dark mode and fixed dark-mode badge contrast.",
      "Expanded README into a portfolio-focused project document.",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-05-12",
    title: "Initial question-bank release",
    changes: [
      "Built the Vite React TypeScript app with Tailwind CSS.",
      "Seeded 80 hardware interview questions across RTL, DV, CDC, STA, synthesis, placement, routing, and EDA algorithms.",
      "Added dashboard, question bank, practice mode, mock interview mode, wrong-question review, and cheatsheet.",
      "Added LocalStorage-backed wrong-question persistence and GitHub Pages deployment workflow.",
    ],
  },
] as const;
