'use client';

import { useI18n } from '@/components/LanguageProvider';
import { Button } from '@/components/ui/button';
import { Mic, Volume2 } from 'lucide-react';
import { useRef, useState } from 'react';

export default function VoiceQuery() {
  const { t } = useI18n();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(t('Speech Recognition not supported'));
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'hi-IN';

    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onend = () => setIsListening(false);

    recognitionRef.current.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript(transcriptSegment);
        }
      }
    };

    recognitionRef.current.start();
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={startListening}
        disabled={isListening}
        size="sm"
        variant={isListening ? 'secondary' : 'default'}
        aria-label={isListening ? t('Listening for voice input') : t('Start voice query')}
      >
        <Mic className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
        {isListening ? t('Listening...') : t('Voice Query')}
      </Button>

      {transcript && (
        <Button
          onClick={() => speak('यहाँ खतरा है')}
          size="sm"
          variant="destructive"
          aria-label={t('Speak warning aloud')}
        >
          <Volume2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
          {t('Warning')}
        </Button>
      )}

      {transcript && (
        <span className="text-sm text-muted-foreground" aria-live="polite">{transcript}</span>
      )}
    </div>
  );
}
