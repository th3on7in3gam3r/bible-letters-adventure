import { SPEECH_CONFIG, GAME_CONFIG } from '../constants';

class SpeechService {
  private static instance: SpeechService;
  private enabled: boolean = true;
  private repeatInterval: number | null = null;
  private guideVoiceURI: string | null = null;
  private pronunciationAudio: HTMLAudioElement | null = null;

  private constructor() {
    this.resolveGuideVoice();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.resolveGuideVoice();
      };
    }
  }
  private resolveGuideVoice() {
    try {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const preferredVoiceHints = ["Samantha", "Google US English", "Aria", "Jenny", "Female"];
      const matched = voices.find((voice) =>
        preferredVoiceHints.some((hint) => voice.name.toLowerCase().includes(hint.toLowerCase()))
      );
      this.guideVoiceURI = (matched ?? voices[0]).voiceURI;
    } catch {
      this.guideVoiceURI = null;
    }
  }


  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopRepeating();
    }
  }

  private normalizeText(text: string): string {
    // Convert single letters to phonetic pronunciation to avoid "Capital A" issue
    if (text.length === 1 && /[A-Z]/.test(text)) {
      const letterMap: { [key: string]: string } = {
        'A': 'ay', 'B': 'bee', 'C': 'see', 'D': 'dee', 'E': 'ee',
        'F': 'eff', 'G': 'gee', 'H': 'aitch', 'I': 'eye', 'J': 'jay',
        'K': 'kay', 'L': 'ell', 'M': 'em', 'N': 'en', 'O': 'oh',
        'P': 'pee', 'Q': 'cue', 'R': 'are', 'S': 'ess', 'T': 'tee',
        'U': 'you', 'V': 'vee', 'W': 'double you', 'X': 'ex', 'Y': 'why', 'Z': 'zee'
      };
      return letterMap[text] || text.toLowerCase();
    }
    return text;
  }

  public speak(text: string, options: { rate?: number; pitch?: number } = {}) {
    if (!this.enabled) return;

    try {
      window.speechSynthesis.cancel();
      const normalizedText = this.normalizeText(text);
      const utterance = new SpeechSynthesisUtterance(normalizedText);
      utterance.rate = options.rate ?? SPEECH_CONFIG.RATE;
      utterance.pitch = options.pitch ?? SPEECH_CONFIG.PITCH;
      if (this.guideVoiceURI) {
        const voice = window.speechSynthesis.getVoices().find((v) => v.voiceURI === this.guideVoiceURI);
        if (voice) utterance.voice = voice;
      }
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn('Speech synthesis failed:', error);
    }
  }

  public speakSlow(text: string) {
    this.speak(text, {
      rate: SPEECH_CONFIG.SLOW_RATE,
      pitch: SPEECH_CONFIG.SLOW_PITCH,
    });
  }

  public startRepeating(text: string) {
    this.stopRepeating();
    this.speak(text);
    this.repeatInterval = window.setInterval(() => {
      this.speak(text);
    }, GAME_CONFIG.SPEECH_REPEAT_INTERVAL);
  }

  public stopRepeating() {
    if (this.repeatInterval) {
      clearInterval(this.repeatInterval);
      this.repeatInterval = null;
    }
    window.speechSynthesis.cancel();
  }

  public speakWordInfo(word: string, definition: string) {
    this.stopRepeating();
    this.speakWordWithClip(word);
    setTimeout(() => this.speak(definition), 500);
  }

  public speakWordWithClip(word: string) {
    if (!this.enabled) return;
    const normalized = word.toLowerCase().replace(/\s+/g, "-");
    const url = `/audio/words/${normalized}.mp3`;
    try {
      if (this.pronunciationAudio) {
        this.pronunciationAudio.pause();
      }
      const audio = new Audio(url);
      this.pronunciationAudio = audio;
      
      // Silently fallback to TTS if audio file doesn't exist
      audio.onended = () => {
        localStorage.setItem("bible_letters_audio_last", JSON.stringify({ type: "clip", word, at: Date.now() }));
      };
      audio.onerror = () => {
        // Audio file not found - use TTS instead (silent fallback)
        this.speak(word);
      };
      audio.play().catch(() => {
        // Playback failed - use TTS instead (silent fallback)
        this.speak(word);
      });
    } catch {
      // Any error - use TTS fallback
      this.speak(word);
    }
  }

  public speakCelebration(word: string, sentence: string) {
    const textToSpeak = `Your dove guide says: ${word}. ${sentence}`;
    this.speakSlow(textToSpeak);
  }
}

export const speechService = SpeechService.getInstance();