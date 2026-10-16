'use client';

import { useI18n } from '@/components/LanguageProvider';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ArrowRight, Database, Layers, MapPin, Navigation, Zap } from 'lucide-react';
import Link from 'next/link';

const SOLUTIONS_NAV = [
  { label: 'Coordination', href: '/solutions/coordination' },
  { label: 'Mapping', href: '/solutions/mapping', active: true },
  { label: 'Tenders', href: '/solutions/tenders' },
  { label: 'Field Operations', href: '/solutions/field-operations' },
];

const FEATURE_CARDS = [
  {
    icon: Layers,
    iconBg: '#E0FFF8',
    iconColor: '#00A88E',
    title: 'Multi-Layer Department View',
    body: 'Color-coded GIS layers for each department—PWD, Water, Municipal, Telecom. Toggle visibility to understand overlap patterns and coordinate asset placement.',
  },
  {
    icon: Navigation,
    iconBg: '#E8F0FF',
    iconColor: '#3B5BDB',
    title: 'Offline-First Mapping',
    body: 'Download tile packages for offline access in areas with poor connectivity. Field engineers can verify assets and update status without internet.',
  },
  {
    icon: Database,
    iconBg: '#FFF3E0',
    iconColor: '#E07C24',
    title: 'Asset Hierarchy & Metadata',
    body: 'Parent-child asset relationships, full CRUD operations, integrated file storage for DPRs, photos, and permits. All tied to the live map.',
  },
];

const IMPACT_STATS = [
  { value: '100K+', label: 'Assets Mapped', sub: 'across all 6+ departments in Gwalior' },
  { value: '50%', label: 'Faster Planning', sub: 'with real-time visibility vs. spreadsheets' },
  { value: '0 Min', label: 'Setup Time', sub: 'no GIS training needed—intuitive UI' },
];

const WHY_FEATURES = [
  { icon: <MapPin className="h-4 w-4" />, text: 'GatiShakti alignment with national master plan' },
  { icon: <Layers className="h-4 w-4" />, text: 'Unlimited layer support per department' },
  { icon: <Database className="h-4 w-4" />, text: 'Full asset lifecycle tracking with versioning' },
  { icon: <Navigation className="h-4 w-4" />, text: 'Offline tile sync for field work' },
  { icon: <Zap className="h-4 w-4" />, text: 'Real-time updates across all mobile + web' },
  { icon: <ArrowRight className="h-4 w-4" />, text: 'One-click GeoJSON exports for planning' },
];

export default function MappingSolution() {
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
            <p className="section-label mb-4">{t('Infrastructure Mapping')}</p>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.12] text-[#1a2433]">
              {t('Map Every Project.')}<br /><span className="text-gradient">{t('Miss Nothing.')}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] text-gray-500 leading-relaxed">
              {t('Visualise all infrastructure assets, projects, and risk zones across Gwalior on a live, multi-layer GIS map. Powered by Leaflet, aligned with GatiShakti standards.')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/map" className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #00C9A7 0%, #7C3AED 100%)' }}>
                {t('Open Live Map')}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
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
              <p className="section-label mb-3">{t('How Mapping Works')}</p>
              <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-[#1a2433]">
                <span className="text-gradient">{t('Real-Time, Multi-Department Visibility')}</span>
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-gray-500 leading-relaxed">
                {t('Live GIS layers for all departments with offline support for field operations.')}
              </p>
            </div>

            {/* Browser Mockup */}
            <div className="mb-8 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" aria-hidden="true" />
                <div className="ml-4 flex-1 rounded-md bg-white border border-gray-200 px-3 py-1 text-[11px] text-gray-400">
                  karana-platform.gov.in/map
                </div>
              </div>
              <div className="relative flex items-center justify-center" style={{ minHeight: '280px', background: 'linear-gradient(135deg, rgba(0,201,167,0.04) 0%, rgba(124,58,237,0.04) 100%)' }}>
                <div className="w-full p-6">
                  <div className="rounded-lg border border-gray-200 bg-white p-4 h-56 flex items-center justify-center relative overflow-hidden" aria-hidden="true">
                    <div className="absolute inset-0 opacity-10">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="absolute border-2 rounded-full" style={{
                          width: `${100 + i * 50}px`,
                          height: `${100 + i * 50}px`,
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          borderColor: i % 2 === 0 ? '#00C9A7' : '#7C3AED'
                        }} />
                      ))}
                    </div>
                    <div className="relative space-y-2 w-full">
                      <div className="flex gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ background: '#00C9A7' }} />
                        <div className="h-2 w-24 rounded bg-gray-200" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ background: '#3B5BDB' }} />
                        <div className="h-2 w-32 rounded bg-gray-200" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ background: '#E07C24' }} />
                        <div className="h-2 w-28 rounded bg-gray-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURE_CARDS.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div key={idx} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: card.iconBg }} aria-hidden="true">
                      <Icon className="h-5 w-5" style={{ color: card.iconColor }} />
                    </div>
                    <h3 className="text-[13.5px] font-bold text-[#1a2433] mb-1.5">{t(card.title)}</h3>
                    <p className="text-[12.5px] text-gray-500 leading-relaxed flex-1">{t(card.body)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* IMPACT */}
        <section className="bg-[#FAFAFA] border-y border-gray-100">
          <div className="mx-auto max-w-6xl px-4 lg:px-8 py-16 lg:py-20">
            <div className="mb-10 text-center">
              <p className="section-label mb-3">{t('Scale & Impact')}</p>
              <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-[#1a2433]">
                {t('Mapping that')} <span className="text-gradient">{t('scales from city to region')}</span>
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

        {/* WHY MAPPING */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 lg:px-8 py-16 lg:py-20">
            <div className="mb-10 text-center">
              <p className="section-label mb-3">{t('Why Choose Mapping')}</p>
              <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-[#1a2433] mb-12">
                {t('GIS that works')} <span className="text-gradient">{t('for government, not against it')}</span>
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
                  { emoji: '🗺️', label: 'Leaflet-Powered', sub: 'Open-source GIS—no expensive ArcGIS licenses' },
                  { emoji: '📱', label: 'Mobile-First', sub: 'Works on any device—web, tablet, field phone' },
                  { emoji: '🔒', label: 'Permissions-Based', sub: 'Role-based access per department layer' },
                  { emoji: '⚡', label: 'Real-Time Sync', sub: 'Changes visible across all users instantly' },
                ].map((item, i) => (
                  <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-2">{item.emoji}</div>
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
              {t('Map Your Infrastructure')}<br />{t('in Minutes, Not Months')}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[14.5px] text-white/75 leading-relaxed">
              {t('Live GIS with offline support, multi-department layers, and full asset tracking.')}
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link href="/map" className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-sm font-semibold text-[#2563EB] hover:bg-blue-50 transition-colors">
                {t('View Live Map')}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
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
