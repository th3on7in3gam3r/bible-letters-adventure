/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SOUND_URLS } from '../constants';

class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private musicAudio: HTMLAudioElement | null = null;

  private constructor() {
    // Read saved sound preference immediately on init
    try {
      const saved = localStorage.getItem('bible_letters_sound');
      this.enabled = saved !== 'false'; // default true
    } catch { this.enabled = true; }

    this.loadSound('click', SOUND_URLS.CLICK);
    this.loadSound('correct', SOUND_URLS.CORRECT);
    this.loadSound('incorrect', SOUND_URLS.INCORRECT);
    this.loadSound('win', SOUND_URLS.WIN);
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private loadSound(name: string, url: string) {
    try {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = 0.5;
      this.sounds.set(name, audio);
    } catch (error) {
      console.warn(`Failed to load sound ${name}:`, error);
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /** Register the background music element so we can control it directly */
  public setMusicAudio(audio: HTMLAudioElement | null) {
    this.musicAudio = audio;
  }

  public setMusicEnabled(enabled: boolean) {
    if (!this.musicAudio) return;
    if (enabled) {
      this.musicAudio.play().catch(() => {});
    } else {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
    }
  }

  public play(name: string, volume: number = 0.5) {
    if (!this.enabled) return;
    const audio = this.sounds.get(name);
    if (audio) {
      try {
        const soundClone = audio.cloneNode() as HTMLAudioElement;
        soundClone.volume = Math.max(0, Math.min(1, volume));
        soundClone.play().catch(() => {});
      } catch { /* silent */ }
    }
  }
}

export const soundManager = SoundManager.getInstance();
