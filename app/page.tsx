'use client';

import { useI18n } from '@/components/LanguageProvider';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { AlertTriangle, ArrowRight, BarChart2, BarChart3, Brain, FileText, Globe, LayoutDashboard, Map, MapPin, Mic, ShieldCheck, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Industries', href: '#industries' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'About Us', href: '#impact' },
  { label: 'News', href: '#news' },
  { label: 'Contact Us', href: '#contact' },
];

const PARTNERS = ['PWD Gwalior', 'Water Board', 'BESCOM MP', 'Municipal Corp', 'MPTRANSCO', 'BSNL Telecom'];

const FEATURE_SECTIONS = [
  {
    id: 'working',
    label: 'Working with Karana',
    heading: 'Clash-Free Infrastructure Coordination',
    description: 'Effortlessly manage assets, project zones, and inter-department scheduling — bringing everyone onto a single real-time platform.',
    mockupIcon: LayoutDashboard,
    mockupLabel: 'Commissioner Dashboard · Gwalior, MP',
    cards: [
      {
        icon: LayoutDashboard,
        iconBg: '#E0FFF8',
        iconColor: '#00A88E',
        title: 'Fully Customisable Dashboards',
        body: 'Build department-specific views with drag-and-drop widgets, KPI cards, and date-range filters to keep the most important data front and centre.',
      },
      {
        icon: ShieldCheck,
        iconBg: '#E8F0FF',
        iconColor: '#3B5BDB',
        title: 'Built-in Clash Detection',
        body: 'Karana automatically analyses spatial and temporal data across departments, flagging road cuts, utility overlaps, and scheduling collisions before they happen.',
      },
      {
        icon: FileText,
        iconBg: '#FFF3E0',
        iconColor: '#E07C24',
        title: 'Comprehensive Tender Tracking',
        body: 'Submit, review, and monitor tenders with full audit trail support — from first draft to NIT publication — all within a single workflow.',
      },
    ],
  },
  {
    id: 'planning',
    label: 'Creating an Infrastructure Plan in Karana',
    heading: 'Map Every Project. Miss Nothing.',
    description: 'Visualise the full infrastructure landscape of Gwalior on a live GIS map, with department-coded layers, clash halos, and on-demand export.',
    mockupIcon: Map,
    mockupLabel: 'Live GIS Map · Multi-layer view',
    cards: [
      {
        icon: Map,
        iconBg: '#E0FFF8',
        iconColor: '#00A88E',
        title: 'GatiShakti-Ready GIS Layer',
        body: 'All projects are plotted with colour-coded department lines, risk halos, and Leaflet-powered tooltips — aligned with PM GatiShakti standards.',
      },
      {
        icon: Globe,
        iconBg: '#E8F0FF',
        iconColor: '#3B5BDB',
        title: 'Code-Free Asset Configuration',
        body: 'Add, edit, or archive infrastructure assets directly on the map without writing a single line of code. Publish changes instantly across all roles.',
      },
      {
        icon: FileText,
        iconBg: '#FFF3E0',
        iconColor: '#E07C24',
        title: 'Integrated File & Document Storage',
        body: 'Attach DPRs, photos, and compliance certificates to every project node. All documentation is version-controlled and searchable.',
      },
    ],
  },
  {
    id: 'reporting',
    label: 'Reporting in Karana',
    heading: 'AI Risk Scoring. One-Click Reports.',
    description: 'Submit a tender and get a Groq-powered LLM risk score in under three seconds. Generate compliant NIT PDFs without manual formatting.',
    mockupIcon: Brain,
    mockupLabel: 'AI Risk Engine · Llama 3.1 via Groq',
    cards: [
      {
        icon: BarChart3,
        iconBg: '#E0FFF8',
        iconColor: '#00A88E',
        title: 'Pre-Built Report Templates',
        body: 'Choose from committee briefings, clash summaries, or contractor scorecards — all pre-formatted to government reporting standards.',
      },
      {
        icon: Brain,
        iconBg: '#E8F0FF',
        iconColor: '#3B5BDB',
        title: 'Custom AI Reporting',
        body: 'Describe the report you need in plain language; the Groq LLM engine assembles the content, tables, and risk commentary automatically.',
      },
      {
        icon: Mic,
        iconBg: '#FFF3E0',
        iconColor: '#E07C24',
        title: 'Workflows for Smarter Decisions',
        body: 'Hindi voice queries let field engineers ask about live risks hands-free. Answers are synthesised and read aloud in the field.',
      },
    ],
  },
];

const IMPACT_STATS = [
  { value: '₹12Cr+', label: 'Loss-Exposure Identified', sub: 'across Gwalior infrastructure projects' },
  { value: '3000%', label: 'Faster Clash Detection', sub: 'vs. manual coordination methods' },
  { value: '10M+', label: 'Citizens served indirectly', sub: 'through reduced disruption & delays' },
];

const WHY_FEATURES = [
  { icon: ShieldCheck, text: 'Real-time clash detection across 6 departments' },
  { icon: Brain, text: 'LLM-powered risk scoring in under 3 seconds' },
  { icon: FileText, text: 'One-click NIT PDF generation with compliance checks' },
  { icon: MapPin, text: 'GatiShakti-aligned GIS with offline tile support' },
  { icon: Mic, text: 'Hindi voice queries for field engineers' },
  { icon: BarChart2, text: 'Contractor performance scorecards & rankings' },
];

const NEWS_ITEMS = [
  {
    title: 'AI Monitoring Live',
    body: 'Continuous city-wide signal monitoring with anomaly detection and risk summaries across departments.',
  },
  {
    title: 'AI Coordination Packs',
    body: 'Auto-generated coordination playbooks, dependency chains, and scheduling recommendations.',
  },
  {
    title: 'AI Triggering Engine',
    body: 'Context-aware alerts for high-risk zones, unsafe overlaps, and compliance deadlines.',
  },
  {
    title: 'Map Monitoring',
    body: 'Layer-by-layer integrity checks, live tile health, and asset drift detection.',
  },
  {
    title: 'Map Layouting',
    body: 'Smart layout suggestions for clearer zoning, labels, and conflict heatmaps.',
  },
];

const FOOTER_COLS = [
  {
    heading: 'Industries',
    links: ['Urban Infrastructure', 'Road & Highways', 'Utilities', 'Municipal Services', 'Telecom'],
  },
  {
    heading: 'Solutions',
    links: ['Clash Detection', 'Mapping & GIS', 'Tender Management', 'AR Field View', 'Scoreboard'],
    hrefs: ['/dashboard', '/map', '/tender', '/ar', '/contractor'],
  },
  {
    heading: 'Learn More',
    links: ['GatiShakti Portal', 'AI Sprint 2026', 'Documentation', 'API Reference'],
    hrefs: ['https://pmgatishakti.gov.in/', '#', '#', '#'],
  },
  {
    heading: 'Support',
    links: ['Contact Us', 'Privacy Policy', 'Terms of Service'],
    hrefs: ['#', '#', '#'],
  },
];

export default function Home() {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00C9A7] focus:text-white">
        {t('Skip to main content')}
      </a>

      {/* NAVBAR */}
      <header className="fixed top-4 left-1/2 z-50 w-[min(1120px,calc(100%-2rem))] -translate-x-1/2">
        <div className="rounded-full border border-border bg-background/80 px-4 shadow-lg backdrop-blur-xl">
          <div className="mx-auto flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
              </div>
              <span className="text-[15px] font-bold text-foreground">
                {t('Karana')}<span className="text-[10px] font-normal text-muted-foreground ml-1">{t('Solutions')}</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3 py-1.5 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent"
                >
                  {t(link.label)}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex">
                <LanguageSwitcher />
              </div>
              <details className="relative md:hidden">
                <summary className="list-none cursor-pointer rounded-full border border-border px-3 py-1.5 text-[12.5px] font-semibold text-foreground hover:bg-accent" aria-label={t('Open navigation menu')}>
                  {t('Menu')}
                </summary>
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-border bg-popover p-2 shadow-lg">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="block rounded-lg px-3 py-2 text-[12.5px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      {t(link.label)}
                    </Link>
                  ))}
                  <div className="mt-2 border-t border-border pt-2">
                    <LanguageSwitcher />
                  </div>
                </div>
              </details>

              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[12.5px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {t('Get Started')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main id="main" className="flex-1 pt-24">
        {/* HERO */}
        <section className="relative overflow-hidden bg-white">
          <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,201,167,0.08) 0%, transparent 70%)' }} aria-hidden="true" />
          <div className="mx-auto max-w-6xl px-4 lg:px-8 pt-12 pb-8 text-center">
            <p className="section-label mb-4">{t('About Karana Platform')}</p>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.12] text-[#1a2433]">
              {t('Workflows')}<br /><span className="text-gradient">{t('Made Effortless')}</span><br />{t('With Karana')}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[15px] text-gray-500 leading-relaxed">
              {t('Effortlessly manage assets, project zones, inter-department clashes, and tender workflows — with built-in AI to surface risk before it becomes cost.')}
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #00C9A7 0%, #7C3AED 100%)' }}>
                {t('Start a Demo')}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link href="/map" className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-[#1a2433] hover:bg-gray-50 transition-colors">
                {t('View Live Map')}
              </Link>
            </div>
          </div>
        </section>

        {/* PARTNERS */}
        <section id="industries" className="scroll-mt-28 border-y border-gray-100 bg-white" aria-label={t('Partner departments')}>
          <div className="mx-auto max-w-6xl px-4 lg:px-8 py-5">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
              {PARTNERS.map((name) => (
                <span key={name} className="text-[12.5px] font-semibold uppercase tracking-widest text-gray-300">{t(name)}</span>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <div id="solutions" className="scroll-mt-28" />
        {FEATURE_SECTIONS.map((section, sIdx) => {
          const MockupIcon = section.mockupIcon;
          return (
            <section key={section.id} className={sIdx % 2 === 1 ? 'bg-[#FAFAFA]' : 'bg-white'} aria-labelledby={`section-heading-${section.id}`}>
              <div className="mx-auto max-w-6xl px-4 lg:px-8 py-16 lg:py-20">
                <div className="mb-8 text-center">
                  <p className="section-label mb-3">{t(section.label)}</p>
                  <h2 id={`section-heading-${section.id}`} className="text-3xl font-extrabold tracking-tight lg:text-4xl text-[#1a2433]">
                    <span className="text-gradient">{t(section.heading)}</span>
                  </h2>
                  <p className="mx-auto mt-3 max-w-lg text-sm text-gray-500 leading-relaxed">{t(section.description)}</p>
                </div>

                {/* Browser mockup */}
                <div className="mb-8 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" aria-hidden="true" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" aria-hidden="true" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" aria-hidden="true" />
                    <div className="ml-4 flex-1 rounded-md bg-white border border-gray-200 px-3 py-1 text-[11px] text-gray-400">
                      karana-platform.gov.in/{section.id}
                    </div>
                  </div>
                  <div className="relative flex items-center justify-center" style={{ minHeight: '200px', background: 'linear-gradient(135deg, rgba(0,201,167,0.04) 0%, rgba(124,58,237,0.04) 100%)' }}>
                    <div className="w-full max-w-2xl p-6 space-y-3">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #00C9A7 0%, #7C3AED 100%)' }} aria-hidden="true">
                          <MockupIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="h-3 w-40 rounded bg-gray-200" aria-hidden="true" />
                          <div className="mt-1.5 h-2.5 w-24 rounded bg-gray-100" aria-hidden="true" />
                        </div>
                        <div className="ml-auto flex gap-2" aria-hidden="true">
                          {[60, 80, 48].map((w, i) => (
                            <div key={i} className="h-6 rounded-full" style={{ width: `${w}px`, background: i === 0 ? '#00C9A7' : '#e5e7eb' }} />
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3" aria-hidden="true">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                            <div className="h-2.5 w-16 rounded bg-gray-200 mb-2" />
                            <div className="h-6 w-20 rounded bg-gray-100 mb-1" />
                            <div className="h-2 w-12 rounded bg-gray-100" />
                          </div>
                        ))}
                      </div>
                      <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm" aria-hidden="true">
                        <div className="flex gap-2 items-center mb-2">
                          <div className="h-2.5 w-24 rounded bg-gray-200" />
                          <div className="ml-auto h-2 w-16 rounded" style={{ background: '#00C9A7' }} />
                        </div>
                        <div className="h-2 w-full rounded bg-gray-100 mb-1.5" />
                        <div className="h-2 w-3/4 rounded bg-gray-100" />
                      </div>
                      <p className="text-center text-[10px] text-gray-400 pt-1">{t(section.mockupLabel)}</p>
                    </div>
                  </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {section.cards.map((card, cIdx) => {
                    const CardIcon = card.icon;
                    const key = `${section.id}-${cIdx}`;
                    const isExpanded = !!expanded[key];
                    return (
                      <div key={cIdx} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: card.iconBg }} aria-hidden="true">
                          <CardIcon className="h-5 w-5" style={{ color: card.iconColor }} />
                        </div>
                        <h3 className="text-[13.5px] font-bold text-[#1a2433] mb-1.5">{t(card.title)}</h3>
                        <p className={`text-[12.5px] text-gray-500 leading-relaxed flex-1 ${!isExpanded ? 'line-clamp-3' : ''}`}>{t(card.body)}</p>
                        <button className="mt-4 self-start flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-[#00C9A7] hover:text-[#00C9A7] transition-colors text-lg font-light leading-none"
                          onClick={() => toggle(key)} aria-expanded={isExpanded} aria-label={isExpanded ? t('Collapse') : t('Expand')}>
                          {isExpanded ? '−' : '+'}
                        </button>
                      </div>
                    );
                  })}

                  {/* Learn more card */}
                  <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: '#F3EEFF' }} aria-hidden="true">
                        <ArrowRight className="h-5 w-5" style={{ color: '#7C3AED' }} />
                      </div>
                      <h3 className="text-[13.5px] font-bold text-gradient mb-1.5">{t('Learn more with Karana today!')}</h3>
                      <p className="text-[12.5px] text-gray-500 leading-relaxed">
                        {t('Explore the full platform. Open the live demo to see every feature in action.')}
                      </p>
                    </div>
                    <Link href="/dashboard" className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-gradient hover:opacity-80 transition-opacity"
                      aria-label={`${t('Learn more')} — ${t(section.heading)}`}>
                      {t('Open Platform')}<ArrowRight className="h-3.5 w-3.5" style={{ color: '#7C3AED' }} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* IMPACT */}
        <section id="impact" className="scroll-mt-28 bg-white border-y border-gray-100" aria-labelledby="impact-heading">
          <div className="mx-auto max-w-6xl px-4 lg:px-8 py-16 lg:py-20">
            <div className="mb-10 text-center">
              <p className="section-label mb-3">{t('Our Impact')}</p>
              <h2 id="impact-heading" className="text-3xl font-extrabold tracking-tight lg:text-4xl text-[#1a2433]">
                {t('Karana drives impact by streamlining')} <span className="text-gradient">{t('infrastructure management')}</span>,<br />
                {t('coordination planning, and public savings.')}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {IMPACT_STATS.map((stat) => (
                <div key={stat.label} className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'rgba(0,201,167,0.10)' }}>
                  <p className="text-5xl font-extrabold tracking-tight lg:text-6xl" style={{ color: '#00A88E' }}>{stat.value}</p>
                  <p className="mt-3 text-sm font-semibold text-[#1a2433]">{t(stat.label)}</p>
                  <p className="mt-1.5 text-xs text-gray-500">{t(stat.sub)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY KARANA */}
        <section className="bg-[#FAFAFA]" aria-labelledby="why-heading">
          <div className="mx-auto max-w-6xl px-4 lg:px-8 py-16 lg:py-20">
            <p className="section-label text-center mb-3">{t('Why with Karana')}</p>
            <h2 id="why-heading" className="text-3xl font-extrabold tracking-tight text-center lg:text-4xl text-[#1a2433] mb-12">
              {t('More about Karana and its features.')}
              <span className="text-gradient">{t('Let\'s learn!')}</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="space-y-4">
                  {WHY_FEATURES.map((f) => {
                    const Icon = f.icon;
                    return (
                      <div key={f.text} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: 'rgba(0,201,167,0.12)' }} aria-hidden="true">
                          <Icon className="h-3.5 w-3.5" style={{ color: '#00C9A7' }} />
                        </div>
                        <p className="text-[13.5px] text-gray-600 leading-relaxed">{t(f.text)}</p>
                      </div>
                    );
                  })}
                </div>
                <Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #00C9A7 0%, #7C3AED 100%)' }}>
                  {t('Open Platform')}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: ShieldCheck, iconBg: '#E0FFF8', iconColor: '#00A88E', label: 'A Familiar & Intuitive Experience Users Know', sub: 'Roles for Commissioner, Dept Head, Field Engineer & Tender Officer.' },
                  { icon: Users, iconBg: '#E8F0FF', iconColor: '#3B5BDB', label: 'Onboarded Thousands of Departments', sub: 'Karana streamlines workflows so teams adopt fast and operate with efficiency.' },
                  { icon: Globe, iconBg: '#FFF3E0', iconColor: '#E07C24', label: 'GatiShakti-Compliant Architecture', sub: 'Fully aligned with the national infrastructure master plan framework.' },
                  { icon: AlertTriangle, iconBg: '#FFF0F5', iconColor: '#D63B6A', label: 'Risk Surfaced Before It Becomes Cost', sub: 'AI scoring in under 3 seconds means no clash goes undetected.' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: item.iconBg }} aria-hidden="true">
                        <Icon className="h-[18px] w-[18px]" style={{ color: item.iconColor }} />
                      </div>
                      <h3 className="text-[12.5px] font-bold text-[#1a2433] mb-1">{t(item.label)}</h3>
                      <p className="text-[11.5px] text-gray-500 leading-relaxed">{t(item.sub)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* NEWS */}
        <section id="news" className="scroll-mt-28 bg-white" aria-labelledby="news-heading">
          <div className="mx-auto max-w-6xl px-4 lg:px-8 py-16 lg:py-20">
            <div className="mb-10 text-center">
              <p className="section-label mb-3">{t('Latest Updates')}</p>
              <h2 id="news-heading" className="text-3xl font-extrabold tracking-tight lg:text-4xl text-[#1a2433]">
                {t('Introducing the')} <span className="text-gradient">{t('AI Monitoring Suite')}</span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 leading-relaxed">
                {t('A coordinated set of AI services for monitoring, coordination, triggering, and live map intelligence.')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {NEWS_ITEMS.map((item) => (
                <div key={item.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-[13.5px] font-bold text-[#1a2433] mb-2">{t(item.title)}</h3>
                  <p className="text-[12.5px] text-gray-500 leading-relaxed">{t(item.body)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="cta-heading" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)' }}>
          <div className="mx-auto max-w-6xl px-4 lg:px-8 py-16 lg:py-20 text-center">
            <h2 id="cta-heading" className="text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
              {t('Ready to Transform Your')}<br />{t('Infrastructure Operations?')}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[14.5px] text-white/75 leading-relaxed">
              {t('Discover how Karana can streamline coordination, save time, and cut crores in costs. See the full platform in action.')}
            </p>
            <div className="mt-8 flex items-center justify-center">
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-sm font-semibold text-[#2563EB] hover:bg-blue-50 transition-colors">
                {t('Book a Demo')}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="contact" style={{ backgroundColor: '#1a2433' }} aria-label="Site footer">
        <div className="mx-auto max-w-6xl px-4 lg:px-8 pt-12 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-white/10">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #00C9A7 0%, #7C3AED 100%)' }}>
                  <Zap className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                </div>
                <span className="text-[14px] font-bold text-white">Karana</span>
              </Link>
              <p className="text-[12px] leading-relaxed" style={{ color: '#8494a9' }}>
                {t('Powering Intelligent Infrastructure Coordination for a smarter, efficient India.')}
              </p>
            </div>

            {FOOTER_COLS.map((col) => (
              <div key={col.heading}>
                <h3 className="text-[12px] font-semibold text-white mb-3 uppercase tracking-wider">{t(col.heading)}</h3>
                <ul className="space-y-2">
                  {col.links.map((link, i) => {
                    const href = col.hrefs?.[i] ?? '#';
                    const isExternal = href.startsWith('http');
                    return (
                      <li key={link}>
                        <Link href={href} className="text-[12.5px] transition-colors hover:text-white" style={{ color: '#8494a9' }}
                          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                          {t(link)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11.5px]" style={{ color: '#8494a9' }}>
              {t('© 2026 Karana Platform · AI Innovation Sprint · Gwalior, Madhya Pradesh')}
            </p>
            <p className="text-[11.5px]" style={{ color: '#8494a9' }}>
              {t('Built for PM GatiShakti National Master Plan')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
