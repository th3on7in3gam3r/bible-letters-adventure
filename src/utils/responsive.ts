import { GAME_CONFIG } from '../constants';

export interface ResponsiveConfig {
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  tileSize: number;
  slotSize: number;
  wordTileWidth: number;
  wordTileHeight: number;
  buttonWidth: number;
  titleFontSize: string;
  subtitleFontSize: string;
  tileFontSize: string;
}

export function getResponsiveConfig(windowWidth: number, windowHeight: number): ResponsiveConfig {
  const isSmallScreen = windowWidth < GAME_CONFIG.SMALL_SCREEN_WIDTH;
  const isMediumScreen = windowWidth < GAME_CONFIG.MEDIUM_SCREEN_WIDTH;

  return {
    isSmallScreen,
    isMediumScreen,
    tileSize: Math.min(windowWidth * GAME_CONFIG.TILE_SIZE_RATIO, GAME_CONFIG.MAX_TILE_SIZE),
    slotSize: Math.min(windowWidth * GAME_CONFIG.SLOT_SIZE_RATIO, GAME_CONFIG.MAX_SLOT_SIZE),
    wordTileWidth: Math.min(windowWidth * GAME_CONFIG.WORD_TILE_WIDTH_RATIO, GAME_CONFIG.MAX_WORD_TILE_WIDTH),
    wordTileHeight: Math.min(windowWidth * GAME_CONFIG.WORD_TILE_HEIGHT_RATIO, GAME_CONFIG.MAX_WORD_TILE_HEIGHT),
    buttonWidth: Math.min(windowWidth * 0.8, GAME_CONFIG.MAX_BUTTON_WIDTH),
    titleFontSize: isSmallScreen ? "text-5xl" : "text-7xl",
    subtitleFontSize: isSmallScreen ? "text-3xl" : "text-5xl",
    tileFontSize: isSmallScreen ? "text-xl" : "text-3xl",
  };
}

export function getScatteringBounds(containerWidth: number, windowHeight: number, tileWidth: number) {
  const scatteringHeight = windowHeight * GAME_CONFIG.SCATTERING_HEIGHT_RATIO;
  const maxX = (containerWidth - tileWidth) / 2;
  const maxY = (scatteringHeight * GAME_CONFIG.SCATTERING_AREA_RATIO) / 2;
  
  return {
    maxX,
    maxY,
    scatteringHeight,
  };
}