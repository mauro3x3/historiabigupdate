import React, { useState } from 'react';
// import your TTS utility here
// import { getDavidSuchetAudio } from '@/utils/tts';

interface ReadAloudButtonProps {
  text: string;
  buttonClassName?: string;
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

const ReadAloudButton: React.FC<ReadAloudButtonProps> = ({ text, buttonClassName }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReadAloud = async () => {
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

  return (
    <div style={{ marginTop: 8, marginBottom: 8 }}>
      <button
        className={buttonClassName}
        onClick={handleReadAloud}
        disabled={loading}
        style={{ display: 'none' }}
        aria-label="Read Out Loud"
      >
        Read Out Loud
      </button>
      {error && <div style={{ color: 'red', marginTop: 8, maxWidth: 320 }}>{error}</div>}
      {audioUrl && (
        <audio src={audioUrl} controls autoPlay style={{ marginTop: 12, width: '100%' }} />
      )}
    </div>
  );
};

export default ReadAloudButton; 