'use client';

import { useI18n } from '@/components/LanguageProvider';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

export default function MapView() {
  const { t } = useI18n();
  const MapComponent = useMemo(
    () =>
      dynamic(() => import('./MapComponent'), {
        ssr: false,
        loading: () => (
          <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
              <p className="text-sm text-muted-foreground">{t('Loading Gwalior Map...')}</p>
            </div>
          </div>
        ),
      }),
    [t]
  );

  return <MapComponent />;
}
