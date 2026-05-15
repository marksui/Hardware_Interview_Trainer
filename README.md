# Hardware Interview Trainer

**Current app version:** `v1.2.12`

Hardware Interview Trainer is a GitHub Pages-ready web app for ECE and computer engineering students preparing for hardware, SoC, physical design, and EDA software interviews.

The app combines a 178-question interview bank, a dedicated code-question view, targeted practice, timed mock rounds, wrong-question review, local progress analytics, JSON progress import/export, dark mode, and a compact cheatsheet. It intentionally uses no backend so it can be inspected, forked, deployed, and extended as a clean portfolio project.

Related project: [Logic & CMOS Studio](https://marksui.github.io/logic-cmos-studio/) is a companion educational EDA mini-tool for Boolean logic, Karnaugh maps, Verilog export, and static CMOS network visualization.

## Motivation

Hardware interview preparation is unusually broad. A candidate may be asked about synthesizable RTL, UVM scoreboards, CDC synchronizers, setup and hold timing, SDC exceptions, placement congestion, routing parasitics, or graph algorithms used in EDA tools.

Most study workflows are scattered across notes, PDFs, spreadsheets, and random quiz sets. This project turns that preparation into a focused browser app with:

- Structured questions by topic, difficulty, and answer type
- Immediate explanations and interview-style oral answers
- A wrong-question queue for spaced review
- Local accuracy analytics to expose weak areas
- Static hosting that works on GitHub Pages

## Features

- **Dashboard**
  - Total question count
  - Wrong-question count
  - Total attempted questions
  - Category coverage
  - Category accuracy
  - Difficulty accuracy
  - Most missed category
  - Progress export/import

- **Question Bank**
  - Searchable and filterable table
  - Filters for category, difficulty, and question type
  - Full question details with answer, explanation, oral answer, and tags

- **Code Questions**
  - Standalone page for every RTL coding prompt
  - Search and filters for coding category and difficulty
  - LeetCode-style split view with prompt, checklist, interview notes, and reference implementation
  - Syntax-colored Verilog and SystemVerilog reference code blocks

- **RTL Design Practice Problems**
  - Footer-linked standalone page
  - 26 RTL design drills including the NVIDIA SRAM memory-controller phone-screen prompt
  - Answer-style design notes plus syntax-colored reference RTL/code blocks

- **Practice Mode**
  - Category and difficulty selection
  - One question at a time
  - Single-choice, multi-select, short-answer, and coding support
  - Immediate feedback after submission
  - Self-review suggested answers for open-ended and coding prompts
  - Wrong answers or manually saved review items stored in LocalStorage

- **Mock Interview Mode**
  - Random 10-question round
  - Custom selected-question rounds
  - NVIDIA ASIC Hardware Design Engineer preset for JR20011787
  - NVIDIA-oriented RTL coding pack for performance monitors, CDC, FIFOs, arbiters, and datapaths
  - Flashcard quick-review switch for answer-first study
  - Timer
  - Score summary
  - Weak-category report
  - Wrong answers saved for review

- **Wrong Questions**
  - Loads missed question IDs from LocalStorage
  - Retry flow
  - Remove questions after review

- **Cheatsheet**
  - RTL basics
  - DV basics
  - CDC basics
  - STA basics
  - Synthesis basics
  - Placement basics
  - Routing basics
  - Physical design basics
  - EDA algorithms

- **About Page**
  - Explains the hardware interview prep problem
  - Describes how the app helps across RTL, DV, STA, PD, and EDA topics
  - Documents the LocalStorage and JSON design choice

- **Local-Only Analytics**
  - Total attempted questions
  - Category accuracy
  - Difficulty accuracy
  - Most missed category
  - No backend, accounts, cookies, analytics SDKs, or user tracking

- **Progress Portability**
  - Export progress as JSON
  - Import progress JSON in another browser

- **UI**
  - Responsive modern SaaS-inspired layout
  - Light and dark mode
  - GitHub Pages-compatible hash navigation

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- LocalStorage
- JSON question bank
- GitHub Actions for Pages deployment

## Architecture

```text
Browser-only React app
        |
        |-- src/data/questions.json
        |     Static question bank loaded at build time
        |
        |-- src/utils/questions.ts
        |     Filtering, category metadata, answer evaluation, shuffling
        |
        |-- src/utils/storage.ts
        |     Wrong-question IDs, analytics aggregates, theme, import/export
        |
        |-- src/pages/*
        |     Dashboard, bank, practice, mock, wrong questions, cheatsheet, about
        |
        |-- LocalStorage
              User progress stays private in the browser
```

The app is deliberately static. Questions are bundled as JSON, routing is hash-based, and all progress state lives in LocalStorage. This keeps the project easy to deploy, easy to review in an interview, and simple to extend without infrastructure.

## Data Model

Questions live in [`src/data/questions.json`](src/data/questions.json). Each question follows this schema:

```json
{
  "id": "rtl-001",
  "category": "RTL Design",
  "difficulty": "easy",
  "type": "single_choice",
  "question": "Which Verilog assignment style is preferred for edge-triggered sequential logic?",
  "choices": [
    "Blocking assignment with =",
    "Nonblocking assignment with <=",
    "Continuous assignment with assign",
    "Force and release"
  ],
  "answer": ["Nonblocking assignment with <="],
  "explanation": "Nonblocking assignments model clocked storage because all right-hand sides are sampled before left-hand sides update at the end of the time step.",
  "interview_answer": "For flops I use nonblocking assignments in an always_ff or posedge block. It avoids artificial ordering dependencies between registers and better matches hardware behavior.",
  "tags": ["verilog", "sequential", "nonblocking", "flip-flop"]
}
```

Supported question types:

- `single_choice`
- `multi_select`
- `short_answer`
- `coding`

Local progress export format:

```json
{
  "app": "Hardware Interview Trainer",
  "version": 1,
  "appVersion": "1.2.7",
  "exportedAt": "2026-05-13T00:00:00.000Z",
  "wrongQuestions": ["rtl-001", "sta-004"],
  "analytics": {
    "totalAttempted": 12,
    "totalCorrect": 8,
    "totalMissed": 4,
    "byCategory": {},
    "byDifficulty": {}
  },
  "theme": "dark"
}
```

## Project Structure

```text
.
├── .github/workflows/deploy.yml
├── assets
│   ├── index.css
│   └── index.js
├── dev.html
├── public/.nojekyll
├── scripts
│   ├── prepare-pages.mjs
│   └── sync-root-pages.mjs
├── src
│   ├── components
│   │   ├── Badge.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ProgressBar.tsx
│   │   └── QuestionAttempt.tsx
│   ├── data
│   │   └── questions.json
│   ├── pages
│   │   ├── About.tsx
│   │   ├── Cheatsheet.tsx
│   │   ├── Dashboard.tsx
│   │   ├── MockInterviewMode.tsx
│   │   ├── PracticeMode.tsx
│   │   ├── QuestionBank.tsx
│   │   └── WrongQuestions.tsx
│   ├── utils
│   │   ├── questions.ts
│   │   ├── storage.ts
│   │   └── version.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   └── types.ts
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Screenshots

Add generated screenshots here when publishing the project:

| Page | Placeholder |
|---|---|
| Dashboard | `docs/screenshots/dashboard.png` |
| Question Bank | `docs/screenshots/question-bank.png` |
| Code Questions | `docs/screenshots/code-questions.png` |
| Practice Mode | `docs/screenshots/practice-mode.png` |
| Mock Interview Mode | `docs/screenshots/mock-interview-mode.png` |
| Wrong Questions | `docs/screenshots/wrong-questions.png` |
| Cheatsheet | `docs/screenshots/cheatsheet.png` |
| About | `docs/screenshots/about.png` |
| Dark Mode | `docs/screenshots/dark-mode.png` |

Suggested capture flow:

```bash
npm run dev
```

Then open the app locally and capture each route.

## Setup

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Build and sync root-level static assets for branch-based GitHub Pages:

```bash
npm run build:pages-root
```

Preview the production build:

```bash
npm run preview
```

## Deployment

The app is ready for GitHub Pages. It supports both GitHub Actions deployment and the simpler branch-source setup.

This repository includes [`deploy.yml`](.github/workflows/deploy.yml), which builds and deploys the app when changes are pushed to `main`.

To enable GitHub Pages:

1. Push the repository to GitHub.
2. Open **Settings** for the repository.
3. Go to **Pages**.
4. Set **Source** to **GitHub Actions**.
5. Push to `main` or run the workflow manually.

If the repository is configured as **Deploy from a branch** with `main` and `/root`, run this before committing:

```bash
npm run build:pages-root
```

That command keeps the root [`index.html`](index.html) and root [`assets`](assets) folder aligned with the Vite build, so GitHub Pages does not try to serve the development-only TypeScript entry.

The Vite config uses:

```ts
base: "./"
```

The app also uses hash navigation, so it works under a project Pages URL:

```text
https://<username>.github.io/Hardware_Interview_Trainer/
```

Manual deployment with `gh-pages` is also available:

```bash
npm run deploy
```

## Privacy

Hardware Interview Trainer does not track users.

- No backend
- No database
- No login
- No analytics SDK
- No network calls for progress data
- Progress is stored only in browser LocalStorage
- Export/import uses a user-controlled JSON file

## Version History

The app also renders this changelog on a dedicated Version History page so reviewers can see project progress directly inside the UI without crowding the footer.

### v1.2.12 - 2026-05-14

- Added full reference RTL/code blocks to the RTL Design Practice Problems page.
- Expanded the page with a NVIDIA phone-screen SRAM memory-controller design prompt and implementation skeleton.
- Updated the page from checklist-only practice to problem, design notes, and syntax-colored reference implementation cards.

### v1.2.11 - 2026-05-14

- Added a dedicated RTL Design Practice Problems page with 25 RTL design drills.
- Added answer-style design checklists for arbiters, FIFOs, CDC circuits, FSMs, CPU datapaths, cache replacement, UART TX, and SVA practice.
- Added a footer link under the current version badge so the practice page is easy to find without crowding the main navigation.

### v1.2.10 - 2026-05-14

- Added lightweight syntax coloring for Verilog and SystemVerilog reference code blocks.
- Styled code tokens for keywords, types, numbers, comments, strings, operators, and system tasks.
- Added separate light and dark code palettes so code examples no longer read as plain black-and-white text.

### v1.2.9 - 2026-05-14

- Added 18 NVIDIA-oriented Verilog coding prompts covering edge detection, enabled flops, synchronizers, counters, valid-ready monitors, latency tracking, FIFOs, FSMs, adder trees, MACs, shift registers, priority encoders, round-robin arbitration, and async FIFO structure.
- Included full reference implementations and interview-style explanations, with bilingual notes where useful.
- Updated the NVIDIA ASIC Hardware Design Engineer mock preset to use the new targeted coding pack.
- Updated the question bank total to 178 questions.

### v1.2.8 - 2026-05-14

- Added a NVIDIA ASIC Hardware Design Engineer mock preset for JR20011787 based on the provided interview tips.
- Curated the preset around Verilog writing, scripting mindset, problem solving, SoC methodology, CDC, clocks, reset, and latency.
- Added a flashcard quick-review switch in Mock Interview Mode that shows answers immediately and advances card by card without scoring.
- Added a practice-only reminder for company-specific interview preparation.

### v1.2.7 - 2026-05-13

- Added a standalone Code Questions page for all coding prompts.
- Added a LeetCode-style split view with prompt, checklist, interview notes, and reference implementation visible together.
- Added Code Questions entry points in the main navigation, dashboard, and footer.

### v1.2.6 - 2026-05-13

- Added a dedicated `coding` question type for RTL implementation prompts.
- Split coding practice into separate Verilog Coding and SystemVerilog Coding categories.
- Added 10 Verilog-2001 coding prompts while keeping the existing SystemVerilog coding pack.
- Changed short-answer and coding questions to self-review mode with suggested/reference answers instead of automatic grading.
- Added manual save-to-wrong-questions controls for self-reviewed answers.
- Added custom question selection to Mock Interview Mode.
- Updated the question bank total to 160 questions.

### v1.2.5 - 2026-05-13

- Fixed the blank GitHub Pages site when repository settings publish the main branch root.
- Split the local Vite development entry into `dev.html` while keeping `index.html` as a static Pages-ready entry.
- Added stable production asset names so the root Pages entry can load the built React app reliably.
- Added a build helper that syncs generated assets to the repository root for branch-based Pages publishing.

### v1.2.4 - 2026-05-13

- Added a new RTL Coding category with 20 hands-on coding prompts.
- Covered basics such as async reset flops, sync reset flops, muxes, edge detectors, counters, shift registers, and decoders.
- Added advanced prompts for skid buffers, valid-ready half-buffers, reset synchronizers, CDC pulse toggles, Gray-code FIFO helpers, arbiters, register files, and pipeline bubbles.
- Added rich text rendering so explanations and reference answers can show formatted RTL code blocks.
- Improved question-bank search so multiple keywords can be combined.
- Updated the question bank total to 150 questions.

### v1.2.3 - 2026-05-13

- Added Logic & CMOS Studio as a related portfolio project on the About page.
- Added a footer link to the companion Boolean logic and CMOS educational mini-tool.
- Positioned Hardware Interview Trainer as part of a broader hardware / EDA portfolio.

### v1.2.2 - 2026-05-13

- Improved the mobile header so the app title and version line no longer overflow.
- Shortened the header topic label from Physical Design to PD on compact screens.
- Added bold emphasis to important Cheatsheet terms and concepts.

### v1.2.1 - 2026-05-13

- Moved Cheatsheet, About, and Versions out of the main top navigation.
- Added a right-side hamburger menu for secondary reference pages.
- Kept mobile navigation available through the same compressed menu.

### v1.2.0 - 2026-05-13

- Added 50 original physical-design interview questions adapted from a downloaded study PDF's topic coverage.
- Expanded coverage across STA, placement, routing, CDC, synthesis, EM/IR, DVFS, advanced-node DRC, clock mesh, and 3DIC topics.
- Reduced bright pastel badge colors in dark mode for a calmer technical UI.
- Updated the question bank total to 130 questions.

### v1.1.1 - 2026-05-13

- Moved release notes out of the footer into a standalone Version History page.
- Added a navigation route and footer link for version history.
- Kept the footer compact with only the current version and a release-notes entry point.

### v1.1.0 - 2026-05-13

- Added About page for project motivation and architecture rationale.
- Added local-only analytics for category accuracy, difficulty accuracy, total attempts, and missed areas.
- Added JSON progress export/import.
- Added dark mode and fixed dark-mode badge contrast.
- Expanded README into a portfolio-focused project document.
- Added visible app version and footer changelog.

### v1.0.0 - 2026-05-12

- Built the Vite React TypeScript app with Tailwind CSS.
- Seeded 80 hardware interview questions across RTL, DV, CDC, STA, synthesis, placement, routing, and EDA algorithms.
- Added dashboard, question bank, practice mode, mock interview mode, wrong-question review, and cheatsheet.
- Added LocalStorage-backed wrong-question persistence and GitHub Pages deployment workflow.

## Future Work

- Add more questions for computer architecture, DFT, low-power design, and FPGA interviews
- Add spaced repetition scheduling
- Add per-tag analytics
- Add markdown support for code-heavy explanations
- Add optional screenshot generation for README assets
- Add a printable interview prep report
- Add question authoring validation scripts
- Add a dedicated progress page with trend history
- Add keyboard shortcuts for practice mode

## License

This project is intended as a portfolio and learning project. Add a license file before distributing or accepting external contributions.
