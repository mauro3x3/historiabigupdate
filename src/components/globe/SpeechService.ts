// Speech service for text-to-speech functionality
export class SpeechService {
  private static instance: SpeechService;

  private constructor() {
    // Initialize speech service
  }

  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }

  // Generate natural speech using Web Speech API
  public async generateSpeech(event: any): Promise<string> {
    const date = new Date(event.dateHappened);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Enhanced speech text with more natural flow
    let speechText = `Welcome to today's historical journey. `;
    speechText += `Let me tell you about ${event.title}. `;
    speechText += `${event.description} `;
    speechText += `This remarkable event took place on ${formattedDate}. `;
    speechText += `This historical insight was contributed by ${event.author}. `;
    speechText += `Let's continue our journey through time.`;

    return speechText;
  }

  // Use Web Speech API for text-to-speech
  public speakText(text: string, onStart?: () => void, onEnd?: () => void, onError?: () => void): void {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Enhanced voice settings for better historical narration
    utterance.rate = 0.85; // Slightly slower for better comprehension
    utterance.pitch = 1.1; // Slightly higher pitch for engagement
    utterance.volume = 0.9;

    // Try to use a more natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.name.includes('Samantha') ||
      voice.name.includes('Alex')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onError?.();

    window.speechSynthesis.speak(utterance);
  }

  // Stop current speech
  public stopSpeech(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Check if speech is currently playing
  public isSpeaking(): boolean {
    return 'speechSynthesis' in window && window.speechSynthesis.speaking;
  }

  // Get available voices
  public getVoices(): SpeechSynthesisVoice[] {
    if ('speechSynthesis' in window) {
      return window.speechSynthesis.getVoices();
    }
    return [];
  }

  // Load voices (needed for some browsers)
  public loadVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          resolve(voices);
        } else {
          window.speechSynthesis.onvoiceschanged = () => {
            resolve(window.speechSynthesis.getVoices());
          };
        }
      } else {
        resolve([]);
      }
    });
  }
}

export default SpeechService;
