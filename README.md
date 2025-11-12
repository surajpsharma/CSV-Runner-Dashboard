# CSV Runner Dashboard

A Next.js + shadcn/ui dashboard where users upload a CSV with columns: date, person, miles run. The app validates input, computes metrics (average, min, max), and renders overall and per‑person charts.

## Assumptions
- No backend or database required; parsing and visualizations are client‑side.
- CSV header names are case/spacing tolerant. Supported: `date`, `person`, and `miles run` (also accepts `miles`, `miles_run`, `miles-run`).
- Dates can be ISO (YYYY‑MM‑DD) or common formats (MM/DD/YYYY, DD/MM/YYYY, etc.).

## Prerequisites
- Node.js 18+ and npm
- No secrets are required. See `.env.example`.

## Setup
1) Install dependencies

```bash
npm install
```

2) Environment
- Copy `.env.example` to `.env` if you need overrides (not required by default).

3) Seed data
- Not applicable. Use the included sample file `public/sample.csv`.

## Run & verify
1) Start dev server

```bash
npm run dev
```

2) Open the app
- Visit http://localhost:3000

3) Validate acceptance items
- Sample CSV: Click "Download sample.csv" or open `/sample.csv`.
- Overall and per-person views: Use the tabs (Overall, Per Person). In Per Person, choose a person from the select.
- Metrics: Average/Min/Max are shown in cards for Overall and for the selected person.
- Error handling: Upload a bad CSV (e.g., missing `miles run` or non-numeric miles). Errors appear in a destructive alert listing header and row issues with line numbers.

## Features & limitations
- Features
  - CSV parsing with PapaParse and validation with Zod.
  - Flexible headers and multiple date formats.
  - Overall metrics + line chart of miles over time (aggregated by date).
  - Per-person selection with metrics, chart, and records table.
  - Accessible form controls and focusable components from shadcn/ui.
- Limitations
  - Very large CSVs parse on the client; consider streaming/server processing for huge files.
  - Only a single file upload per session (no merge across multiple files).

## Notes on architecture
- Stack: Next.js (App Router), TypeScript, Tailwind v4, shadcn/ui, Recharts, PapaParse, Zod.
- Key files
  - `src/lib/csv.ts` — parsing and validation.
  - `src/lib/stats.ts` — metrics and aggregations.
  - `src/components/csv-uploader.tsx` — file input + error display.
  - `src/components/run-line-chart.tsx` — reusable line chart.
  - `src/components/metrics-row.tsx` — metrics cards.
  - `src/components/runs-table.tsx` — data table.
  - `src/app/page.tsx` — dashboard page (client component for state).
- State: kept in the page component (client-side); derived data memoized.

## Accessibility & UI
- Labels associated with inputs via `Label` or native `label`.
- Keyboard-focusable inputs and tabs; semantic elements from shadcn/ui.
- Color contrast based on Tailwind v4 theme tokens; charts include grid and tooltip for readability.
- Spacing and typography via Tailwind utility classes; responsive layout up to 5xl.

## Acceptance checklist (for reviewers)
- [x] Sample CSV + instructions
- [x] Overall and per-person charts/views
- [x] Metrics computed correctly (average, min, max)
- [x] Error handling for invalid CSV (header + row-level)
