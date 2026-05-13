export const APP_VERSION = "1.1.0";

export const RELEASE_DATE = "2026-05-13";

export const CHANGELOG = [
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
