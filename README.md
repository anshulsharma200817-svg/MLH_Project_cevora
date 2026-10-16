# Cevora Platform

**One Map. One Brain. Zero Wasted Crores.**

An AI-assisted infrastructure coordination platform that helps Indian government departments visualize their road and utility works on a single map, detect scheduling and location clashes before the first dig, and coordinate merged tenders.

> **Status:** working demo / MVP. It ships with bundled mock data for Gwalior, Madhya Pradesh and does not persist to a production database. See [Mock data](#mock-data).

---

## Overview

Departments such as PWD, the Water Board, BESCOM, the Municipal Corporation and Telecom often dig up the same stretch of road in the same season because no one sees the others' schedule. Cevora puts every department's planned work on one map, runs deterministic clash detection over them, and layers AI on top to score financial waste, recommend merge/sequence actions, and draft the paperwork.

- **City scope:** Gwalior, MP (26.2298°N, 78.1734°E)
- **Alignment:** GatiShakti-style multi-department coordination
- **Departments modelled:** PWD, WATER, BESCOM, MUNICIPAL, TELECOM

---

## Features

- **Live conflict map** — every project plotted on a Leaflet map, color-coded by department, with a clash summary panel and PDF export.
- **Deterministic clash detection** — bounding-box and date-range overlap between projects. Fast, predictable and testable; it does not depend on an API key.
- **AI risk scoring** — Gemma 4 (Google AI Studio) estimates financial waste, a risk score, and a recommended action (merge / sequence / optimize).
- **AI monitoring & coordination suite** — Gemma 4 generates monitoring insights, coordination plans, trigger responses and map layout recommendations.
- **Auto-generated NITs** — AI-drafted Notice Inviting Tenders for merged work, downloadable as PDF.
- **Commissioner dashboard** — portfolio totals, active clashes, investment and waste-at-risk, plus a clash table with merge actions.
- **AR field view** — camera overlay with high-risk-zone warnings for field engineers.
- **Voice queries** — Hindi voice input via the browser Web Speech API.
- **Multi-language UI** — English, Hindi, Marathi and Bengali through a lightweight, dependency-free i18n layer.
- **Notifications** — push via ntfy.sh and email via Resend.

Every AI route falls back to a deterministic response when its API key is absent, so the demo runs without any external services.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui (new-york) + `tw-animate-css` |
| Maps | Leaflet + React-Leaflet + leaflet-draw / markercluster + OpenStreetMap |
| AI | Gemma 4 via Google AI Studio (`@google/generative-ai`) |
| PDF | jsPDF |
| Voice | Web Speech API (browser) |
| Data (optional) | Supabase |
| Motion / UI | Framer Motion, Radix UI, lucide-react |
| Deploy | Vercel |

---

## Getting started

### Prerequisites

- Node.js 18.18+ (developed against Node 25)
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env.local` (copy from `.env.example`). All values are optional — AI routes use their built-in fallbacks when keys are missing.

```env
# AI (Google AI Studio)
GEMMA_API_KEY=your_gemma_api_key_here
# Optional: override the Gemma model name (default: gemma-4)
# GEMMA_MODEL=gemma-4

# Translation (optional; static locales are used by default)
TRANSLATION_PROVIDER=langbly        # langbly | libre
LANGBLY_API_KEY=your_langbly_api_key_here
LIBRETRANSLATE_URL=http://localhost:5000

# Notifications (optional)
NTFY_SERVER=https://ntfy.sh
NTFY_TOPIC=cevora-demo-alerts
EMAIL_PROVIDER=resend
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=alerts@your-domain.example
EMAIL_TO=your_recipient_email

# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

- `GEMMA_API_KEY` — [Google AI Studio](https://aistudio.google.com/)
- `LANGBLY_API_KEY` — [Langbly](https://langbly.com/)

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Production build

```bash
npm run build
npm start
```

### Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

---

## Project structure

```
cevora/
├── app/
│   ├── layout.tsx                 # Root layout, fonts, providers, metadata
│   ├── page.tsx                   # Landing page (/)
│   ├── globals.css                # Tailwind + theme tokens + map styles
│   ├── not-found.tsx
│   ├── dashboard/page.tsx         # Commissioner dashboard
│   ├── map/page.tsx               # Live conflict map
│   ├── projects/page.tsx          # Project registry
│   ├── tender/page.tsx            # Tender submission + NIT generation
│   ├── contractor/page.tsx        # Contractor scorecard
│   ├── ar/page.tsx                # AR field warnings
│   ├── solutions/
│   │   ├── mapping/page.tsx
│   │   ├── coordination/page.tsx
│   │   ├── field-operations/page.tsx
│   │   └── tenders/page.tsx
│   └── api/                       # Route handlers (see API reference)
│       ├── clashes/route.ts
│       ├── score-risk/route.ts
│       ├── generate-nit/route.ts
│       ├── ai-coordination/route.ts
│       ├── ai-decision/route.ts
│       ├── ai-monitoring/route.ts
│       ├── ai-triggering/route.ts
│       ├── map-monitoring/route.ts
│       ├── map-layouting/route.ts
│       ├── translate/route.ts
│       ├── notify/route.ts
│       └── email/route.ts
├── components/
│   ├── ui/                        # shadcn/ui primitives
│   ├── MapComponent.tsx           # Leaflet map logic
│   ├── MapView.tsx                # Dynamic (ssr:false) map wrapper
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── FolderTree.tsx
│   ├── SaveProjectModal.tsx
│   ├── VoiceQuery.tsx
│   ├── ThemeProvider.tsx
│   ├── ThemeToggle.tsx
│   ├── LanguageProvider.tsx
│   └── LanguageSwitcher.tsx
├── lib/
│   ├── clashEngine.ts             # Deterministic geometry clash detection
│   ├── gemma.ts                   # Gemma 4 client — all AI functions
│   ├── groq.ts                    # Legacy Groq client (retained, unused)
│   ├── gemini.ts                  # Legacy Gemini client (retained, unused)
│   ├── priorityEngine.ts
│   ├── translation.ts             # Translation providers
│   ├── mapIcons.ts
│   ├── workTypes.ts
│   ├── mockKmlData.ts
│   └── utils.ts
├── data/
│   ├── locales/{en,hi,mr,bn}.json # UI dictionaries
│   ├── mockProjects.json          # 6 Gwalior projects
│   ├── alertContacts.json
│   └── projectLifecycle.json
├── types/                         # Shared TypeScript types
├── public/
├── components.json                # shadcn/ui configuration
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── package.json
```

---

## Pages

| Route | Description |
| --- | --- |
| `/` | Landing page with feature sections and partner departments |
| `/dashboard` | Commissioner dashboard: totals, active clashes, waste-at-risk, clash table, merge actions |
| `/map` | Live conflict map with clash summary and PDF export |
| `/projects` | Project registry |
| `/tender` | Submit a project, detect clashes, score risk, generate a merged NIT |
| `/contractor` | Contractor performance scorecard |
| `/ar` | AR camera view with high-risk-zone warnings |
| `/solutions/mapping` | Solution detail: mapping |
| `/solutions/coordination` | Solution detail: coordination |
| `/solutions/field-operations` | Solution detail: field operations |
| `/solutions/tenders` | Solution detail: tenders |

---

## API reference

All routes are under `app/api/` and accept/return JSON.

| Endpoint | Engine | Purpose |
| --- | --- | --- |
| `POST /api/clashes` | Deterministic | Detect overlapping projects (bounding-box + date-range) |
| `POST /api/score-risk` | Gemma 4 | Estimate waste, risk score, recommended action |
| `POST /api/generate-nit` | Gemma 4 | Draft a Notice Inviting Tender for merged work |
| `POST /api/ai-monitoring` | Gemma 4 | Monitoring insights |
| `POST /api/ai-coordination` | Gemma 4 | Coordination plan |
| `POST /api/ai-triggering` | Gemma 4 | Trigger response |
| `POST /api/ai-decision` | Gemma 4 | Recommended decision for a clash |
| `POST /api/map-monitoring` | Gemma 4 | Map monitoring insights |
| `POST /api/map-layouting` | Gemma 4 | Map layout recommendations |
| `POST /api/translate` | Langbly / LibreTranslate | Translation proxy |
| `POST /api/notify` | ntfy.sh | Push notification |
| `POST /api/email` | Resend | Email notification |

**How detection and scoring differ:** `/api/clashes` is pure geometry (`lib/clashEngine.ts`) and always runs. The AI routes add judgement on top and degrade gracefully to deterministic fallbacks when their API keys are absent.

---

## Design system

- **Theme:** light-first enterprise theme with full dark-mode support
- **Primary:** teal (`#00C9A7` / `#00A88E`); secondary accent violet (`#7C3AED`)
- **Type:** `Space Grotesk` (UI) and `Fraunces` (display headings), loaded via `next/font`
- **Styling:** Tailwind CSS 4 with shadcn/ui (new-york style) and CSS-variable tokens in `app/globals.css`
- **Utility classes:** `.text-gradient`, `.section-label`, `.bg-impact`, `.bg-cta-gradient`, `.cevora-tooltip`, plus `tw-animate-css` animations

See `designsystem.md` and `THEME_UI_REFERENCE.md` for the full palette.

---

## Mock data

`data/mockProjects.json` is a GeoJSON `FeatureCollection` of six Gwalior projects across PWD, WATER, BESCOM and Municipal:

- Projects **1 (PWD — MLN Road Resurfacing)** and **2 (WATER — Sewer Line, MLN Road)** deliberately overlap in both time and space so the clash demo is reproducible out of the box.
- Project **3 (BESCOM — HV Cable, City Centre)** overlaps the water work.

No external dataset is required to run any page or route.

---

## Internationalization

- The UI is translated on the client through `components/LanguageProvider.tsx` — `t(text, vars)` looks up the active locale and falls back to the original English string when a key is missing.
- Supported languages: `en`, `hi`, `mr`, `bn` (dictionaries in `data/locales/`).
- `lib/translation.ts` powers the optional server-side translation proxy (`TRANSLATION_PROVIDER=langbly`, falling back to LibreTranslate).

---

## Deployment

1. Push the repository to GitHub.
2. Import it into [Vercel](https://vercel.com/new).
3. Add the environment variables from [Configure environment](#2-configure-environment) in the Vercel project settings.
4. Deploy. (The Vercel CLI also works: `vercel`.)

The camera-based AR view requires HTTPS, which Vercel provides automatically.

---

## Troubleshooting

**Map not showing** — ensure the dynamic import works; `components/MapView.tsx` loads `MapComponent` with `ssr: false`. Check the browser console for Leaflet errors.

**Gemma 4 calls failing** — verify `GEMMA_API_KEY` and that the project has API access enabled in Google AI Studio. If `gemma-4` is not available in your region, the client falls back to `gemini-1.5-flash`. Routes return a deterministic fallback when no key is present.

**Translations failing** — static locales live in `data/locales/*.json`. The server proxy needs `LANGBLY_API_KEY` or a reachable `LIBRETRANSLATE_URL`.

**Notifications not sent** — set `NTFY_TOPIC` (and optionally `NTFY_SERVER`).

**Emails not sent** — check `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO` and `EMAIL_PROVIDER=resend`.

**Build errors** — clear the cache and reinstall: `rm -rf .next node_modules && npm install`.

---

## Roadmap

1. Persist to Supabase (PostGIS) instead of bundled mock data
2. WebSocket-based real-time updates
3. Authentication and department roles
4. Historical clash analytics
5. Multi-city support
6. Deeper GatiShakti integration
7. Native mobile app

---

## Project documentation

Additional guides live at the repository root: `COMMISSIONER_GUIDE.md`, `DEMO_SCRIPT.md`, `FILE_STRUCTURE.md`, `HANDOFF.md`, `PROJECT_LIFECYCLE_HUB.md`, `QUICK_REFERENCE.md` and the theme references.

---

**Built for AI Innovation Sprint 2026.**
Cevora Platform — One Map. One Brain. Zero Wasted Crores.
