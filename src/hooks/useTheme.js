import { useCardStore } from './useCardStore.js';
import { THEMES } from '../themes/index.js';

// Resolved theme tokens for the active theme.
export function useTheme() {
  return THEMES[useCardStore((s) => s.theme)];
}

export function useThemeKey() {
  return useCardStore((s) => s.theme);
}
