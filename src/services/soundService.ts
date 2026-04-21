/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SOUND_URLS } from '../constants';

class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  private constructor() {
    // Preload sounds
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

  public play(name: string, volume: number = 0.5) {
    if (!this.enabled) return;

    const audio = this.sounds.get(name);
    if (audio) {
      try {
        // Create a clone to allow overlapping sounds of the same type
        const soundClone = audio.cloneNode() as HTMLAudioElement;
        soundClone.volume = Math.max(0, Math.min(1, volume));
        soundClone.play().catch(() => {
          // Silently fail - sound is optional
        });
      } catch (error) {
        // Silently fail - sound is optional
      }
    }
  }
}

export const soundManager = SoundManager.getInstance();
