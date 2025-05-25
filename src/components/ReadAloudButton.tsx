import React, { useState, useEffect } from 'react';
import { Volume2, Loader2, Settings } from 'lucide-react';
// import your TTS utility here
// import { getDavidSuchetAudio } from '@/utils/tts';
import PaywallModal from '@/components/paywall/PaywallModal';

interface ReadAloudButtonProps {
  text: string;
  buttonClassName?: string;
  isPro?: boolean;
  onFontChange?: (font: string) => void;
}

// In-memory cache for audio URLs by text
const audioCache = new Map<string, string>();

const getElevenLabsAudio = async (text: string): Promise<string> => {
  if (audioCache.has(text)) {
    return audioCache.get(text)!;
  }
  const apiKey = 'sk_61a4b6d60808ba509b2239bd9e51004e8a55ae50438d1320'; // <-- Replace with your real API key
  if (!apiKey || apiKey === 'YOUR_ELEVENLABS_API_KEY') {
    throw new Error('API key not set. Please set your ElevenLabs API key.');
  }
  const voiceId = 'L1aJrPa7pLJEyYlh3Ilq';
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error('Failed to fetch audio: ' + errorText);
  }
  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  audioCache.set(text, audioUrl);
  return audioUrl;
};

const FONT_OPTIONS = [
  { label: 'EB Garamond (Classic, Free)', value: 'ebgaramond' },
  { label: 'Crimson Pro (Scholarly, Free)', value: 'crimsonpro' },
  { label: 'Cormorant Garamond (Decorative, Free)', value: 'cormorant' },
  { label: 'Literata (Modern, Free)', value: 'literata' },
  { label: 'Alegreya (Dynamic, Free)', value: 'alegreya' },
  { label: 'Lora (Warm, Free)', value: 'lora' },
  { label: 'Bitter (Structured, Free)', value: 'bitter' },
  { label: 'Inter (Minimalist, Free)', value: 'inter' },
  { label: 'Merriweather (Screen Serif, Free)', value: 'merriweather' },
  { label: 'Playfair Display (Stylish, Free)', value: 'playfair' },
  { label: 'Serif (System)', value: 'serif' },
  { label: 'Sans-serif (System)', value: 'sans-serif' },
  { label: 'Dyslexia-friendly', value: 'opendyslexic' },
];

const ReadAloudButton: React.FC<ReadAloudButtonProps> = ({ text, buttonClassName, isPro, onFontChange }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [fontModalOpen, setFontModalOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState<string>(() => localStorage.getItem('lessonFont') || 'ebgaramond');

  useEffect(() => {
    const storedFont = localStorage.getItem('lessonFont');
    if (storedFont) {
      setSelectedFont(storedFont);
      if (onFontChange) onFontChange(storedFont);
    }
  }, [onFontChange]);

  const handleReadAloud = async () => {
    if (!isPro) {
      setPaywallOpen(true);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = await getElevenLabsAudio(text);
      setAudioUrl(url);
    } catch (err: any) {
      setError(err.message || 'Could not generate audio.');
    }
    setLoading(false);
  };

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    localStorage.setItem('lessonFont', font);
    if (onFontChange) onFontChange(font);
    setFontModalOpen(false);
  };

  return (
    <div style={{ marginTop: 8, marginBottom: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          className={buttonClassName + ' flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60'}
          onClick={handleReadAloud}
          disabled={loading}
          aria-label="Read Out Loud"
          style={{ minWidth: 140 }}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Volume2 size={20} />}
          <span>Read Out Loud</span>
        </button>
        <button
          className="ml-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 transition"
          aria-label="Font Settings"
          onClick={() => setFontModalOpen(true)}
        >
          <Settings size={20} />
        </button>
      </div>
      {error && <div style={{ color: 'red', marginTop: 8, maxWidth: 320 }}>{error}</div>}
      {audioUrl && (
        <audio src={audioUrl} controls autoPlay style={{ marginTop: 12, width: '100%' }} />
      )}
      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />
      {fontModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-[260px] flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4">Font Settings</h3>
            <div className="flex flex-col gap-2 w-full">
              {FONT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`w-full px-4 py-2 rounded-lg border text-left ${selectedFont === opt.value ? 'bg-blue-100 border-blue-400 font-bold' : 'bg-gray-50 border-gray-200'}`}
                  onClick={() => handleFontChange(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button className="mt-6 text-sm text-gray-500 hover:underline" onClick={() => setFontModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadAloudButton; 