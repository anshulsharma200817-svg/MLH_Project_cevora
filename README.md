# 🚀 Karana Platform

**One Map. One Brain. Zero Wasted Crores.**

Central AI-powered infrastructure coordination platform for Indian government departments to prevent overlapping road/utility work.

## 📋 Overview

Karana is a hackathon MVP platform designed for Gwalior, Madhya Pradesh, India. It enables departments like PWD, Water Board, BESCOM, Municipal Corporation, and Telecom to coordinate infrastructure projects and detect clashes in real-time.

**City Scope**: Gwalior, MP (26.2298°N, 78.1734°E)

## ✨ Key Features

- **🗺️ Live Conflict Map**: Real-time visualization of all infrastructure projects with clash detection
- **🤖 AI Risk Scoring**: Groq-powered analysis of financial waste and clash severity
- **🧠 AI Monitoring Suite**: Gemini-powered monitoring, coordination, triggering, and map intelligence
- **📄 Auto-Generated NITs**: AI-created Notice Inviting Tenders for merged projects
- **📱 AR Field Warnings**: AR camera overlay with real-time geolocation alerts
- **🎤 Voice Queries**: Hindi language support for field engineers
- **📊 Commissioner Dashboard**: High-level analytics and clash reports
- **🏆 Contractor Scorecard**: Performance metrics and rating system

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4 + glassmorphic theme
- **Maps**: Leaflet.js + React-Leaflet + OpenStreetMap
- **AI**: Groq SDK (llama-3.1-8b-instant)
- **PDF Export**: jsPDF
- **Voice**: Web Speech API
- **Deploy**: Vercel

## 📦 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

Create `.env.local`:

```env
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
# i18n uses static JSON locales by default (no API needed)
# Optional: use LibreTranslate by wiring /api/translate in custom flows
LIBRETRANSLATE_URL=http://localhost:5000
NTFY_SERVER=https://ntfy.sh
NTFY_TOPIC=karana-demo-alerts
EMAIL_PROVIDER=resend
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=alerts@your-domain.example
EMAIL_TO=your_recipient_email
NEXT_PUBLIC_SUPABASE_URL=optional
NEXT_PUBLIC_SUPABASE_ANON_KEY=optional
```

Get your GROQ_API_KEY from [console.groq.com](https://console.groq.com)
Get your GEMINI_API_KEY from [Google AI Studio](https://aistudio.google.com/)

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

## 🚀 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel project settings.

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
    ├── score-risk/route.ts    # Groq risk scoring
    └── generate-nit/route.ts  # Groq NIT generation

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
└── groq.ts                  # Groq client
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
3. Groq scores risk (via `/api/score-risk`)
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
Groq AI risk analysis

### POST /api/generate-nit
Groq AI NIT document generator

### POST /api/ai-monitoring
Gemini AI monitoring insights

### POST /api/ai-coordination
Gemini AI coordination plan

### POST /api/ai-triggering
Gemini AI triggering response

### POST /api/map-monitoring
Gemini map monitoring insights

### POST /api/map-layouting
Gemini map layout recommendations

### POST /api/ai-decision
Gemini AI decisioning for clash actions

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
- ✅ Groq API fallback responses
- ✅ Everything builds in < 1 minute

## 🐛 Troubleshooting

**Map not showing?**
- Check browser console for errors
- Ensure dynamic import worked: MapView.tsx uses `ssr: false`

**Groq calls failing?**
- Verify `.env.local` has `GROQ_API_KEY`
- API returns fallback response if key missing

**Gemini calls failing?**
- Verify `.env.local` has `GEMINI_API_KEY`
- Ensure billing/project access is enabled in Google AI Studio

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

- [ ] Set GROQ_API_KEY in Vercel
- [ ] Enable HTTPS on Vercel (auto)
- [ ] Test all pages load
- [ ] Test clash detection works
- [ ] Test PDF download
- [ ] Test camera access (HTTPS required)
- [ ] Monitor build time (< 2 min)

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
