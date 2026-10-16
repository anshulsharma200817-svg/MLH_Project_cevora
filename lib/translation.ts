type TranslateRequest = {
  text: string;
  source: string;
  target: string;
};

type TranslateResult = {
  translatedText: string;
  provider: string;
};

const provider = (process.env.TRANSLATION_PROVIDER || 'langbly').toLowerCase();

const translateWithLangbly = async ({ text, source, target }: TranslateRequest): Promise<TranslateResult> => {
  const apiKey = process.env.LANGBLY_API_KEY;
  if (!apiKey) {
    return { translatedText: text, provider: 'langbly-missing-key' };
  }

  const response = await fetch('https://api.langbly.com/language/translate/v2', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ q: text, source, target }),
  });

  if (!response.ok) {
    return { translatedText: text, provider: 'langbly-error' };
  }

  const data = (await response.json()) as {
    data?: { translations?: Array<{ translatedText?: string }> };
  };

  const translatedText = data.data?.translations?.[0]?.translatedText ?? text;
  return { translatedText, provider: 'langbly' };
};

const translateWithLibre = async ({ text, source, target }: TranslateRequest): Promise<TranslateResult> => {
  const baseUrl = process.env.LIBRETRANSLATE_URL || 'http://localhost:5000';
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, source, target, format: 'text' }),
  });

  if (!response.ok) {
    return { translatedText: text, provider: 'libre-error' };
  }

  const data = (await response.json()) as { translatedText?: string };
  return { translatedText: data.translatedText ?? text, provider: 'libre' };
};

export const translateText = async (request: TranslateRequest): Promise<TranslateResult> => {
  if (provider === 'libre') {
    return translateWithLibre(request);
  }

  return translateWithLangbly(request);
};
