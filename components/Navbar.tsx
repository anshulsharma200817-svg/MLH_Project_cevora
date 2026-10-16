'use client';

import { useI18n } from '@/components/LanguageProvider';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SidebarNav from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const { t } = useI18n();
  const [role, setRole] = useState('commissioner');

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-14 items-center px-4 lg:px-6">
        {/* Mobile menu trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden mr-2" aria-label="Open navigation menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">{t('Navigation')}</SheetTitle>
            <SidebarNav />
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group mr-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
          </div>
          <span className="font-semibold text-base tracking-tight group-hover:text-primary transition-colors">
            {t('Karana')}
          </span>
        </Link>

        <Separator orientation="vertical" className="h-6 hidden lg:block" />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Role selector and theme toggle */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <span className="text-xs text-muted-foreground hidden sm:inline ml-2">{t('Role')}</span>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-[160px] h-8 text-xs bg-secondary border-border" aria-label={t('Select role')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="commissioner">{t('Commissioner')}</SelectItem>
              <SelectItem value="dept-head">{t('Dept Head')}</SelectItem>
              <SelectItem value="field-engineer">{t('Field Engineer')}</SelectItem>
              <SelectItem value="tender-officer">{t('Tender Officer')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
