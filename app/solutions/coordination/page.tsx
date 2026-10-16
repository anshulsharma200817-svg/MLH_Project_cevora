'use client';

import { useI18n } from '@/components/LanguageProvider';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { AlertTriangle, ArrowRight, Brain, CheckCircle2, Map, MapPin, Zap } from 'lucide-react';
import Link from 'next/link';

interface FeatureCard {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  body: string;
}

const SOLUTIONS_NAV = [
  { label: 'Coordination', href: '/solutions/coordination', active: true },
  { label: 'Mapping', href: '/solutions/mapping' },
  { label: 'Tenders', href: '/solutions/tenders' },
  { label: 'Field Operations', href: '/solutions/field-operations' },
];

const FEATURE_CARDS: FeatureCard[] = [
  {
    icon: <AlertTriangle className="h-5 w-5" />,
    iconBg: '#E0FFF8',
    iconColor: '#00A88E',
    title: 'Real-Time Clash Detection',
    body: 'Automatically detects spatial and temporal conflicts across all 6+ departments simultaneously, flagging overlaps before they cause delays and cost overruns.',
  },
  {
    icon: <Map className="h-5 w-5" />,
    iconBg: '#E8F0FF',
    iconColor: '#3B5BDB',
    title: 'Multi-Department Visibility',
    body: 'Single platform for PWD, Water Board, Municipal, Telecom, and electrical departments to coordinate schedules, zones, and asset schedules in real-time.',
  },
  {
    icon: <CheckCircle2 className="h-5 w-5" />,
    iconBg: '#FFF3E0',
    iconColor: '#E07C24',
    title: 'Instant Conflict Resolution',
    body: 'Get AI-powered recommendations to resolve clashes—reschedule, re-route, or rebid contracts—all within seconds, not weeks of inter-department negotiations.',
  },
];

const IMPACT_STATS = [
  { value: '98%', label: 'Clash Detection Accuracy', sub: 'AI-powered spatial analysis across all departments' },
  { value: '14 Days', label: 'Avg. Time Saved per Clash', sub: 'from detection to resolution' },
  { value: '₹5–12Cr', label: 'Annual Loss Prevention', sub: 'per mid-sized city via clash avoidance' },
];

const WHY_FEATURES = [
  { icon: <Brain className="h-4 w-4" />, text: 'AI-powered clash scoring & risk prioritization' },
  { icon: <Map className="h-4 w-4" />, text: 'Spatial database with GatiShakti alignment' },
  { icon: <AlertTriangle className="h-4 w-4" />, text: 'Automated alerts to all affected departments' },
  { icon: <CheckCircle2 className="h-4 w-4" />, text: 'Conflict resolution workflows with audit trail' },
  { icon: <MapPin className="h-4 w-4" />, text: 'Offline-first mobile clash verification' },
  { icon: <Zap className="h-4 w-4" />, text: '< 3 sec clash analysis on tender submission' },
];

export default function CoordinationSolution() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1a2433]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00C9A7] focus:text-white">
        {t('Skip to main content')}
      </a>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #00C9A7 0%, #7C3AED 100%)' }}>
              <Zap className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <span className="text-[15px] font-bold text-[#1a2433]">
              {t('Karana')}<span className="text-[10px] font-normal text-gray-400 ml-1">{t('Solutions')}</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Solutions navigation">
            {SOLUTIONS_NAV.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`px-3 py-1.5 text-[13.5px] font-medium rounded-md transition-colors ${
                  link.active
                    ? 'text-[#1a2433] bg-gray-100'
                    : 'text-gray-500 hover:text-[#1a2433] hover:bg-gray-50'
                }`}
              >
                {t(link.label)}
              </Link>
            ))}
          </nav>

          <Link href="/dashboard" className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #00C9A7 0%, #7C3AED 100%)' }}>
            {t('Get Started')}
          </Link>
          <div className="hidden md:flex">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main id="main" className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden bg-white">
          <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,201,167,0.08) 0%, transparent 70%)' }} aria-hidden="true" />
          <div className="mx-auto max-w-6xl px-4 lg:px-8 pt-20 pb-12 text-center">
            <p className="section-label mb-4">{t('Coordination & Clash Detection')}</p>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.12] text-[#1a2433]">
              {t('Multi-Department')}<br /><span className="text-gradient">{t('Coordination Effortless')}</span><br />{t('With Karana')}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] text-gray-500 leading-relaxed">
              {t('Stop clash-driven delays. Get real-time visibility across all 6+ departments, AI-powered clash detection, and instant conflict resolution—all on one platform. From Gwalior to any city.')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #00C9A7 0%, #7C3AED 100%)' }}>
                {t('See It Live')}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link href="/" className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-[#1a2433] hover:bg-gray-50 transition-colors">
                {t('Back to Home')}
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURE SHOWCASE */}
        <section className="bg-white border-y border-gray-100">
          <div className="mx-auto max-w-6xl px-4 lg:px-8 py-16 lg:py-20">
            <div className="mb-8 text-center">
              <p className="section-label mb-3">{t('How Coordination Works')}</p>
              <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-[#1a2433]">
                <span className="text-gradient">{t('Instant Visibility. Zero Clashes.')}</span>
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-gray-500 leading-relaxed">
                {t('Real-time spatial analysis identifies conflicts in seconds—before they lock up your budget.')}
              </p>
            </div>

            {/* Browser Mockup */}
            <div className="mb-8 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" aria-hidden="true" />
                <div className="ml-4 flex-1 rounded-md bg-white border border-gray-200 px-3 py-1 text-[11px] text-gray-400">
                  karana-platform.gov.in/coordination
                </div>
              </div>
              <div className="relative flex items-center justify-center" style={{ minHeight: '240px', background: 'linear-gradient(135deg, rgba(0,201,167,0.04) 0%, rgba(124,58,237,0.04) 100%)' }}>
                <div className="w-full max-w-2xl p-6 space-y-3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #00C9A7 0%, #7C3AED 100%)' }} aria-hidden="true">
                      <Map className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="h-3 w-40 rounded bg-gray-200" aria-hidden="true" />
                      <div className="mt-1.5 h-2.5 w-32 rounded bg-gray-100" aria-hidden="true" />
                    </div>
                    <div className="space-x-1" aria-hidden="true">
                      <span className="inline-block h-2 w-8 rounded-full" style={{ background: '#00C9A7' }} />
                      <span className="inline-block h-2 w-8 rounded-full bg-red-400" />
                      <span className="inline-block h-2 w-8 rounded-full bg-gray-200" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3" aria-hidden="true">
                    {[1, 2].map((i) => (
                      <div key={i} className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
                        <div className="h-2.5 w-16 rounded bg-gray-200 mb-2" />
                        <div className="h-6 w-20 rounded bg-gray-100" />
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-white p-3 space-y-2" aria-hidden="true">
                    <div className="flex gap-2">
                      <div className="h-2 flex-1 rounded" style={{ background: '#D63B6A' }} />
                      <div className="h-2 w-20 rounded bg-gray-200" />
                    </div>
                    <div className="h-2 w-3/4 rounded bg-gray-100" />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURE_CARDS.map((card, idx) => (
                <div key={idx} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: card.iconBg }} aria-hidden="true">
                    <div style={{ color: card.iconColor }}>{card.icon}</div>
                  </div>
                      <h3 className="text-[13.5px] font-bold text-[#1a2433] mb-1.5">{t(card.title)}</h3>
                      <p className={`text-[12.5px] text-gray-500 leading-relaxed flex-1`}>{t(card.body)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IMPACT */}
        <section className="bg-[#FAFAFA] border-y border-gray-100">
          <div className="mx-auto max-w-6xl px-4 lg:px-8 py-16 lg:py-20">
            <div className="mb-10 text-center">
              <p className="section-label mb-3">{t('Impact at Scale')}</p>
              <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-[#1a2433]">
                {t('Coordination that saves')} <span className="text-gradient">{t('time, money, and headaches')}</span>
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

        {/* WHY COORDINATION */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 lg:px-8 py-16 lg:py-20">
            <div className="mb-10 text-center">
              <p className="section-label mb-3">{t('Why Choose Coordination')}</p>
              <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-[#1a2433] mb-12">
                {t('Built for')} <span className="text-gradient">{t('Indian infrastructure')}</span> {t('from the ground up')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                {WHY_FEATURES.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: 'rgba(0,201,167,0.12)' }} aria-hidden="true">
                      <div style={{ color: '#00C9A7' }}>{f.icon}</div>
                    </div>
                    <p className="text-[13.5px] text-gray-600 leading-relaxed">{t(f.text)}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🏛️', label: '6+ Departments', sub: 'PWD, Water, Municipal, Telecom, Electrical + more' },
                  { icon: '📍', label: 'GatiShakti-Ready', sub: 'Meets all PM infrastructure master plan specs' },
                  { icon: '⚡', label: 'Sub-3-Second Analysis', sub: 'Clash scoring in < 3 seconds on submission' },
                  { icon: '🔒', label: 'Audit-Trail Approved', sub: 'Full compliance for government reporting' },
                ].map((item, i) => (
                  <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h3 className="text-[12.5px] font-bold text-[#1a2433] mb-1">{t(item.label)}</h3>
                    <p className="text-[11.5px] text-gray-500 leading-relaxed">{t(item.sub)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="cta-heading" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)' }}>
          <div className="mx-auto max-w-6xl px-4 lg:px-8 py-16 lg:py-20 text-center">
            <h2 id="cta-heading" className="text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
              {t('See Clash Detection in Action')}<br />{t('Today')}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[14.5px] text-white/75 leading-relaxed">
              {t('Get real-time clash detection, automated conflict resolution, and multi-department coordination on one platform.')}
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-sm font-semibold text-[#2563EB] hover:bg-blue-50 transition-colors">
                {t('Open Platform')}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#1a2433' }} aria-label="Site footer">
        <div className="mx-auto max-w-6xl px-4 lg:px-8 pt-12 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
            <div>
              <h3 className="text-[12px] font-semibold text-white mb-3 uppercase tracking-wider">{t('Solutions')}</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Coordination', href: '/solutions/coordination' },
                  { label: 'Mapping', href: '/solutions/mapping' },
                  { label: 'Tenders', href: '/solutions/tenders' },
                  { label: 'Field Ops', href: '/solutions/field-operations' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[12.5px] transition-colors hover:text-white" style={{ color: '#8494a9' }}>
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[12px] font-semibold text-white mb-3 uppercase tracking-wider">{t('Platform')}</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Dashboard', href: '/dashboard' },
                  { label: 'Live Map', href: '/map' },
                  { label: 'Tenders', href: '/tender' },
                  { label: 'AR View', href: '/ar' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[12.5px] transition-colors hover:text-white" style={{ color: '#8494a9' }}>
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[12px] font-semibold text-white mb-3 uppercase tracking-wider">{t('Company')}</h3>
              <ul className="space-y-2">
                {[
                  { label: 'About', href: '#' },
                  { label: 'News', href: '#' },
                  { label: 'Contact', href: '#' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[12.5px] transition-colors hover:text-white" style={{ color: '#8494a9' }}>
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[12px] font-semibold text-white mb-3 uppercase tracking-wider">{t('Legal')}</h3>
              <ul className="space-y-2">
                {[
                  { label: 'Privacy', href: '#' },
                  { label: 'Terms', href: '#' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[12.5px] transition-colors hover:text-white" style={{ color: '#8494a9' }}>
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-6 text-center">
            <p className="text-[11.5px]" style={{ color: '#8494a9' }}>
              {t('© 2026 Karana Platform · Gwalior, Madhya Pradesh · Built for PM GatiShakti')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
