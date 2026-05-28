export const APP_VERSION = "1.2.14";

export const RELEASE_DATE = "2026-05-28";

export const CHANGELOG = [
  {
    version: "1.2.14",
    date: "2026-05-28",
    title: "C++ and Python programming review",
    changes: [
      "Added 12 C++ and Python programming coding prompts covering DFS, BFS, stack, queue, graph traversal, grid shortest path, and expression evaluation.",
      "Added a standalone Programming Review page with language and topic filters plus example/reference-code review cards.",
      "Added Programming Review entry points in the main navigation, dashboard, and footer.",
      "Updated the question bank total to 190 questions.",
    ],
  },
  {
    version: "1.2.13",
    date: "2026-05-15",
    title: "Verilog PDF review bank",
    changes: [
      "Added a dedicated Verilog Interview Review page for imported PDF study material.",
      "Converted Verilog面试题.pdf into 375 structured review cards across 25 chapters.",
      "Added chapter filtering and keyword search while serving the large review bank as static JSON from public/data.",
    ],
  },
  {
    version: "1.2.12",
    date: "2026-05-14",
    title: "RTL practice reference implementations",
    changes: [
      "Added full reference RTL/code blocks to the RTL Design Practice Problems page.",
      "Expanded the page with a NVIDIA phone-screen SRAM memory-controller design prompt and implementation skeleton.",
      "Updated the page from checklist-only practice to problem, design notes, and syntax-colored reference implementation cards.",
    ],
  },
  {
    version: "1.2.11",
    date: "2026-05-14",
    title: "RTL design practice problem page",
    changes: [
      "Added a dedicated RTL Design Practice Problems page with 25 RTL design drills.",
      "Added answer-style design checklists for arbiters, FIFOs, CDC circuits, FSMs, CPU datapaths, cache replacement, UART TX, and SVA practice.",
      "Added a footer link under the current version badge so the practice page is easy to find without crowding the main navigation.",
    ],
  },
  {
    version: "1.2.10",
    date: "2026-05-14",
    title: "Syntax-colored RTL code blocks",
    changes: [
      "Added lightweight syntax coloring for Verilog and SystemVerilog reference code blocks.",
      "Styled code tokens for keywords, types, numbers, comments, strings, operators, and system tasks.",
      "Added separate light and dark code palettes so code examples no longer read as plain black-and-white text.",
    ],
  },
  {
    version: "1.2.9",
    date: "2026-05-14",
    title: "NVIDIA RTL coding question pack",
    changes: [
      "Added 18 NVIDIA-oriented Verilog coding prompts covering edge detection, enabled flops, synchronizers, counters, valid-ready monitors, latency tracking, FIFOs, FSMs, adder trees, MACs, shift registers, priority encoders, round-robin arbitration, and async FIFO structure.",
      "Included full reference implementations and interview-style explanations, with bilingual notes where useful.",
      "Updated the NVIDIA ASIC Hardware Design Engineer mock preset to use the new targeted coding pack.",
      "Updated the question bank total to 178 questions.",
    ],
  },
  {
    version: "1.2.8",
    date: "2026-05-14",
    title: "NVIDIA mock preset and flashcards",
    changes: [
      "Added a NVIDIA ASIC Hardware Design Engineer mock preset for JR20011787 based on the provided interview tips.",
      "Curated the preset around Verilog writing, scripting mindset, problem solving, SoC methodology, CDC, clocks, reset, and latency.",
      "Added a flashcard quick-review switch in Mock Interview Mode that shows answers immediately and advances card by card without scoring.",
      "Added a practice-only reminder for company-specific interview preparation.",
    ],
  },
  {
    version: "1.2.7",
    date: "2026-05-13",
    title: "Dedicated code question view",
    changes: [
      "Added a standalone Code Questions page for all coding prompts.",
      "Added a LeetCode-style split view with prompt, checklist, interview notes, and reference implementation visible together.",
      "Added Code Questions entry points in the main navigation, dashboard, and footer.",
    ],
  },
  {
    version: "1.2.6",
    date: "2026-05-13",
    title: "Coding type and self-review answers",
    changes: [
      "Added a dedicated Coding question type for RTL implementation prompts.",
      "Split coding practice into separate Verilog Coding and SystemVerilog Coding categories.",
      "Added 10 Verilog-2001 coding prompts while keeping the existing SystemVerilog coding pack.",
      "Changed short-answer and coding questions to self-review mode with suggested/reference answers instead of automatic grading.",
      "Added manual save-to-wrong-questions controls for self-reviewed answers.",
      "Added custom question selection to Mock Interview Mode.",
      "Updated the question bank total to 160 questions.",
    ],
  },
  {
    version: "1.2.5",
    date: "2026-05-13",
    title: "GitHub Pages root deployment fix",
    changes: [
      "Fixed the blank GitHub Pages site when repository settings publish the main branch root.",
      "Split the local Vite development entry into dev.html while keeping index.html as a static Pages-ready entry.",
      "Added stable production asset names so the root Pages entry can load the built React app reliably.",
      "Added a build helper that syncs generated assets to the repository root for branch-based Pages publishing.",
    ],
  },
  {
    version: "1.2.4",
    date: "2026-05-13",
    title: "RTL coding question pack",
    changes: [
      "Added a new RTL Coding category with 20 hands-on coding prompts.",
      "Covered basics such as async reset flops, sync reset flops, muxes, edge detectors, counters, shift registers, and decoders.",
      "Added advanced prompts for skid buffers, valid-ready half-buffers, reset synchronizers, CDC pulse toggles, Gray-code FIFO helpers, arbiters, register files, and pipeline bubbles.",
      "Added rich text rendering so explanations and reference answers can show formatted RTL code blocks.",
      "Improved question-bank search so multiple keywords can be combined.",
      "Updated the question bank total to 150 questions.",
    ],
  },
  {
    version: "1.2.3",
    date: "2026-05-13",
    title: "Portfolio project cross-link",
    changes: [
      "Added Logic & CMOS Studio as a related portfolio project on the About page.",
      "Added a footer link to the companion Boolean logic and CMOS educational mini-tool.",
      "Positioned Hardware Interview Trainer as part of a broader hardware / EDA portfolio.",
    ],
  },
  {
    version: "1.2.2",
    date: "2026-05-13",
    title: "Mobile header and cheatsheet emphasis",
    changes: [
      "Improved the mobile header so the app title and version line no longer overflow.",
      "Shortened the header topic label from Physical Design to PD on compact screens.",
      "Added bold emphasis to important Cheatsheet terms and concepts.",
    ],
  },
  {
    version: "1.2.1",
    date: "2026-05-13",
    title: "Compressed reference navigation",
    changes: [
      "Moved Cheatsheet, About, and Versions out of the main top navigation.",
      "Added a right-side hamburger menu for secondary reference pages.",
      "Kept mobile navigation available through the same compressed menu.",
    ],
  },
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
