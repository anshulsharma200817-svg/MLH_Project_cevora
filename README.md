# 🚀 Karana Platform

**One Map. One Brain. Zero Wasted Crores.**

Central AI-powered infrastructure coordination platform for Indian government departments to prevent overlapping road/utility work.

## 📋 Overview

Karana is a hackathon MVP platform designed for Gwalior, Madhya Pradesh, India. It enables departments like PWD, Water Board, BESCOM, Municipal Corporation, and Telecom to coordinate infrastructure projects and detect clashes in real-time.

**City Scope**: Gwalior, MP (26.2298°N, 78.1734°E)

## ✨ Key Features

- **🗺️ Live Conflict Map**: Real-time visualization of all infrastructure projects with clash detection
- **🤖 AI Risk Scoring**: Gemma 4-powered analysis of financial waste and clash severity
- **🧠 AI Monitoring Suite**: Gemma 4-powered monitoring, coordination, triggering, and map intelligence
- **📄 Auto-Generated NITs**: AI-created Notice Inviting Tenders for merged projects
- **📱 AR Field Warnings**: AR camera overlay with real-time geolocation alerts
- **🎤 Voice Queries**: Hindi language support for field engineers
- **📊 Commissioner Dashboard**: High-level analytics and clash reports
- **🏆 Contractor Scorecard**: Performance metrics and rating system

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4 + glassmorphic theme
- **Maps**: Leaflet.js + React-Leaflet + OpenStreetMap
- **AI**: Gemma 4 via Google AI Studio (`@google/generative-ai`)
- **PDF Export**: jsPDF
- **Voice**: Web Speech API
- **Deploy**: Vercel

## 📦 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

Create `.env.local` (copy from `.env.example`):

```env
# ── Gemma 4 AI (Google AI Studio) ───────────────────────────────────────────
GEMMA_API_KEY=your_gemma_api_key_here
# Optional: override the Gemma model name (default: gemma-4)
# GEMMA_MODEL=gemma-4

# ── Optional services ─────────────────────────────────────────────────────────
NTFY_SERVER=https://ntfy.sh
NTFY_TOPIC=karana-demo-alerts
EMAIL_PROVIDER=resend
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=alerts@your-domain.example
EMAIL_TO=your_recipient_email
NEXT_PUBLIC_SUPABASE_URL=optional
NEXT_PUBLIC_SUPABASE_ANON_KEY=optional
LIBRETRANSLATE_URL=http://localhost:5000
```

Get your **GEMMA_API_KEY** from [Google AI Studio](https://aistudio.google.com/)

> 🔑 Your API key is already configured in `.env.local` for local development.
> Do not commit `.env.local` — it is gitignored. On Vercel, add `GEMMA_API_KEY`
> in Project Settings → Environment Variables.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## 🚀 Deploy to Vercel (Recommended)

Vercel is the recommended deployment platform for this Next.js 15 app. It offers
automatic HTTPS, global edge network, and a Mumbai region (`bom1`) for low
latency in India.

### Option A: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts, then add `GEMMA_API_KEY` in your Vercel project settings
(Project Settings → Environment Variables).

### Option B: Deploy via GitHub (Vercel Integration)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Vercel auto-detects Next.js 15 — no build settings needed.
4. Add `GEMMA_API_KEY` in Project Settings → Environment Variables.
5. Click Deploy.

### Environment variables required on Vercel

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMMA_API_KEY` | ✅ Yes | Your Google AI Studio API key |
| `GEMMA_MODEL` | ❌ No | Model name (default: `gemma-4`) |
| `NTFY_SERVER` | ❌ No | Push notification server (default: `https://ntfy.sh`) |
| `NTFY_TOPIC` | ❌ No | ntfy topic name |
| `RESEND_API_KEY` | ❌ No | Email API key (Resend) |
| `EMAIL_FROM` | ❌ No | Sender email address |
| `EMAIL_TO` | ❌ No | Recipient email address |

### Alternative deployment platforms

- **Netlify**: Supports Next.js via [Next.js runtime](https://docs.netlify.com/integrations/frameworks/next-js/). Add env vars in Site Settings → Environment variables.
- **Railway**: Connect GitHub repo, add env vars, deploy. Good for India-proximate regions.
- **Render**: Supports Next.js web services. Add env vars in the dashboard.
- **Self-hosted**: Run `npm run build && npm start` on any Node.js 20+ server.

## 🗂️ Project Structure

```
app/                           # Next.js App Router
├── page.tsx                   # Landing page (/)
├── dashboard/page.tsx         # Stats & clash table
├── map/page.tsx               # Main live map
├── tender/page.tsx            # Tender submission
├── ar/page.tsx                # AR camera view
├── contractor/page.tsx        # Scorecard
└── api/                       # API Routes
    ├── clashes/route.ts       # Clash detection
    ├── score-risk/route.ts    # Gemma 4 risk scoring
    ├── generate-nit/route.ts  # Gemma 4 NIT generation
    ├── ai-monitoring/route.ts # Gemma 4 monitoring insights
    ├── ai-coordination/route.ts # Gemma 4 coordination plan
    ├── ai-triggering/route.ts   # Gemma 4 triggering response
    ├── map-monitoring/route.ts  # Gemma 4 map monitoring
    ├── map-layouting/route.ts   # Gemma 4 map layouting
    ├── ai-decision/route.ts     # Gemma 4 decisioning
    ├── translate/route.ts       # Translation proxy
    ├── notify/route.ts          # Push notifications
    └── email/route.ts           # Email via Resend

components/                    # React components
├── MapView.tsx               # Leaflet wrapper
├── MapComponent.tsx          # Main map logic
├── Navbar.tsx               # Top navigation
├── Sidebar.tsx              # Side navigation
└── VoiceQuery.tsx           # Hindi voice input

data/
└── mockProjects.json        # 6 Gwalior projects

lib/
├── clashEngine.ts           # Clash detection logic
├── gemma.ts                 # Gemma 4 AI client (all AI functions)
└── groq.ts                  # Legacy Groq client (retained, unused)
```

## 🎮 Demo Features

### 1. Landing Page
Hero section with navigation to Dashboard and Map.

### 2. Live Map (/map)
- Gwalior city map (centered at 26.2298, 78.1734)
- 6 color-coded projects by department:
  - 🔴 PWD (Red)
  - 🔵 WATER (Blue)
  - 🟠 BESCOM (Amber)
  - 🟣 MUNICIPAL (Purple)
  - 🟢 TELECOM (Green)
- Click projects for details
- Right panel shows clash summary
- Export report as PDF

### 3. Dashboard (/dashboard)
- Total projects, active clashes, investment, waste risk
- Table of clashing projects
- "Merge Tender" action buttons

### 4. Tender Submission (/tender)
1. Enter project details
2. AI detects clashes (via `/api/clashes`)
3. Gemma 4 scores risk (via `/api/score-risk`)
4. Generate merged NIT (via `/api/generate-nit`)
5. Download NIT as PDF

### 5. AR View (/ar)
- Camera feed with warning overlay
- "⚠️ HIGH RISK ZONE" indicator
- Hindi voice alerts

### 6. Contractor Scorecard (/contractor)
- 5 mock contractors ranked by performance
- Medals for top 3

## 🔌 API Endpoints

### POST /api/clashes
Detects overlapping projects

### POST /api/score-risk
Gemma 4 AI risk analysis — financial waste, risk score 1-10, recommendation

### POST /api/generate-nit
Gemma 4 AI NIT document generator — formal Indian government tender format

### POST /api/ai-monitoring
Gemma 4 AI monitoring insights — anomaly detection and risk summary

### POST /api/ai-coordination
Gemma 4 AI coordination plan — dependency chains and scheduling recommendations

### POST /api/ai-triggering
Gemma 4 AI triggering response — context-aware alert triggers and priorities

### POST /api/map-monitoring
Gemma 4 AI map monitoring — GIS layer integrity and asset drift detection

### POST /api/map-layouting
Gemma 4 AI map layouting — smart layout suggestions for zoning and heatmaps

### POST /api/ai-decision
Gemma 4 AI decisioning — clash action decisions with owner, priority, and reasoning

### POST /api/translate
Translation proxy (optional, LibreTranslate)

### POST /api/notify
Push notification via ntfy.sh

### POST /api/email
Email updates via Resend

## 🎨 Design

- **Theme**: Dark glassmorphic (Apple Vision Pro inspired)
- **Primary**: #1E3A8A (deep blue)
- **Accents**: Red, Orange, Green for status
- **Font**: Inter from Google Fonts
- **Animations**: Framer Motion compatible

## 🗺️ Mock Data

6 projects in `data/mockProjects.json`:
- Projects 1 & 2 (PWD + WATER) deliberately overlap on MLN Road for demo

## 📱 Responsive

- Desktop: Full layout with sidebar
- Mobile: Stacked layout (coming soon)

## ⚡ Performance

- Leaflet dynamically imported (no SSR)
- Mock data (no external API calls)
- Client-side PDF generation
- Optimized bundle size

## 🔐 Hackathon Safe

- ✅ No real APIs (mock data only)
- ✅ No auth complexity (role dropdown instead)
- ✅ Works offline after build
- ✅ Gemma 4 API fallback responses (if AI key missing)
- ✅ Everything builds in < 1 minute

## 🐛 Troubleshooting

**Map not showing?**
- Check browser console for errors
- Ensure dynamic import worked: MapView.tsx uses `ssr: false`

**Gemma calls failing?**
- Verify `.env.local` has `GEMMA_API_KEY`
- Ensure billing/project access is enabled in Google AI Studio
- If `gemma-4` is not yet available in your region, the client auto-falls back to `gemini-1.5-flash`

**Translations failing?**
- Static locales live in `data/locales/*.json`
- For LibreTranslate (optional), set `LIBRETRANSLATE_URL`

**Push notifications not sent?**
- Set `NTFY_TOPIC` (topic name) and `NTFY_SERVER` (default https://ntfy.sh)

**Email updates not sent?**
- Verify `RESEND_API_KEY`, `EMAIL_FROM`, and `EMAIL_TO`
- Ensure `EMAIL_PROVIDER=resend`

**Build errors?**
- Clear `.next` folder: `rm -rf .next`
- Reinstall deps: `rm -rf node_modules && npm install`

## 📈 Production Checklist

- [ ] Set `GEMMA_API_KEY` in Vercel (Project Settings → Environment Variables)
- [ ] Enable HTTPS on Vercel (automatic)
- [ ] Test all pages load
- [ ] Test clash detection works (`/tender`)
- [ ] Test PDF download (NIT generation)
- [ ] Test camera access (AR page requires HTTPS)
- [ ] Monitor build time (< 2 min)
- [ ] Verify Gemma AI responses on `/dashboard` → "Run AI Brief"

## 🧠 How Gemma 4 Powers Karana

Gemma 4 (via Google AI Studio) is the brain behind every AI capability in Karana. It replaces the previous Groq + Gemini stack with a single, unified model that handles all infrastructure coordination intelligence.

### What Gemma 4 does in Karana

| Function | API Route | What Gemma 4 Generates |
|----------|-----------|------------------------|
| **Risk Scoring** | `POST /api/score-risk` | Financial waste estimate (₹), clash risk score 1–10, and recommended action (`merge` / `sequence` / `optimize`) for overlapping projects |
| **NIT Generation** | `POST /api/generate-nit` | Formal Notice Inviting Tender document in Indian government format — scope of work, combined cost, timeline, eligibility, and submission deadline |
| **AI Monitoring** | `POST /api/ai-monitoring` | City-wide infrastructure monitoring summary, risk level, detected anomalies, and recommended actions |
| **Coordination Plan** | `POST /api/ai-coordination` | Inter-department coordination playbook, dependency chains, and next steps to resolve clashes |
| **Triggering Engine** | `POST /api/ai-triggering` | Context-aware alert triggers, priority levels, escalation reasons, and recommended actions for high-risk zones |
| **Map Monitoring** | `POST /api/map-monitoring` | GIS anomaly detection, areas needing review, and confidence scores for map layer integrity |
| **Map Layouting** | `POST /api/map-layouting` | Smart layout suggestions — label spacing, layer ordering, and conflict heatmap rationale |
| **AI Decisioning** | `POST /api/ai-decision` | Final clash-action decision (`sequence` / `merge` / `optimize`), priority, assigned owner, reasoning, and next steps |

### Why Gemma 4 fits this project

- **Single model for all tasks**: One Gemma 4 instance handles risk analysis, document generation, monitoring, coordination, triggering, map intelligence, and decisioning — no need to manage multiple AI providers.
- **Indian infrastructure context**: Gemma 4 understands government tender formats, ₹ currency formatting, and department coordination workflows relevant to Gwalior, Madhya Pradesh.
- **Fallback safety**: If `gemma-4` is unavailable in your region, the client automatically falls back to `gemini-1.5-flash` so the platform never loses AI functionality.
- **Hackathon-ready**: Works with mock data offline; AI functions gracefully degrade to fallback responses if the API key is missing.

### Where to get your API key

Get your **GEMMA_API_KEY** from [Google AI Studio](https://aistudio.google.com/) and add it to `.env.local` (local) or your deployment platform's environment variables (production).

---

## 🎯 Future Enhancements

1. Real Supabase PostGIS queries
2. WebSocket real-time updates
3. User authentication & roles
4. Historical clash analytics
5. Multi-city support
6. GatiShakti integration
7. Mobile native app

---

**Built for AI Innovation Sprint 2026**
**Karana Platform** | One Map. One Brain. Zero Wasted Crores.
