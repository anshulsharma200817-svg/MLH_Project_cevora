'use client';

import { useI18n } from '@/components/LanguageProvider';

export default function LanguageSwitcher() {
  const { language, setLanguage, options, t } = useI18n();

  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="hidden sm:inline">{t('Language')}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as typeof language)}
        className="h-8 rounded-md border border-border bg-secondary px-2 text-xs text-foreground"
        aria-label={t('Select language')}
      >
        {options.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
