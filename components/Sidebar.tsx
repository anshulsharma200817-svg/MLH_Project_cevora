'use client';

import { useI18n } from '@/components/LanguageProvider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Briefcase, Camera, FileText, LayoutDashboard, MapPin, Trophy } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects Hub', icon: Briefcase },
  { href: '/map', label: 'Live Map', icon: MapPin },
  { href: '/tender', label: 'Tender', icon: FileText },
  { href: '/ar', label: 'AR View', icon: Camera },
  { href: '/contractor', label: 'Scoreboard', icon: Trophy },
];

export default function Sidebar() {
  const { t } = useI18n();
  const pathname = usePathname();

  return (
    <aside className="w-60 border-r border-border bg-sidebar hidden lg:flex flex-col shrink-0">
      <ScrollArea className="flex-1">
        <div className="px-3 py-4">
          <p className="px-3 mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {t('Navigation')}
          </p>
          <nav className="space-y-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{t(item.label)}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </ScrollArea>

      <Separator />
      <div className="px-4 py-3">
        <p className="text-[11px] text-muted-foreground text-center">
          {t('Karana Platform')} &middot; {t('GatiShakti Ready')}
        </p>
      </div>
    </aside>
  );
}
