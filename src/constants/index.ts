export const GAME_CONFIG = {
  // Responsive breakpoints
  SMALL_SCREEN_WIDTH: 500,
  MEDIUM_SCREEN_WIDTH: 640,
  
  // Game mechanics
  DRAG_THRESHOLD: 50 as number,
  LARGE_DRAG_THRESHOLD: 80 as number,
  SPEECH_REPEAT_INTERVAL: 1200,
  WIN_CELEBRATION_DELAY: 300,
  REWARD_TRANSITION_DELAY: 1500,
  SENTENCE_REWARD_DELAY: 2500,
  PEEK_DURATION_MS: 850,
  PEEK_COOLDOWN_MS: 1200,
  
  // Sizing ratios
  TILE_SIZE_RATIO: 0.22,
  SLOT_SIZE_RATIO: 0.18,
  WORD_TILE_WIDTH_RATIO: 0.25,
  WORD_TILE_HEIGHT_RATIO: 0.15,
  SCATTERING_HEIGHT_RATIO: 0.45,
  SCATTERING_AREA_RATIO: 0.6,
  
  // Maximum sizes
  MAX_TILE_SIZE: 110,
  MAX_SLOT_SIZE: 90,
  MAX_WORD_TILE_WIDTH: 120,
  MAX_WORD_TILE_HEIGHT: 60,
  MAX_BUTTON_WIDTH: 400,
} as const;

export const SPEECH_CONFIG = {
  RATE: 1.0,
  PITCH: 1.2,
  SLOW_RATE: 0.9,
  SLOW_PITCH: 1.1,
} as const;

export const ANIMATION_CONFIG = {
  CONFETTI: {
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#3B82F6', '#F59E0B', '#10B981', '#EF4444'] as string[],
  },
} as const;

export const SOUND_URLS = {
  CLICK: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  CORRECT: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
  INCORRECT: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',
  WIN: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
} as const;

export const PLACEHOLDER_MUSIC_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';