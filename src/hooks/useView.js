import { useCardStore } from './useCardStore.js';
import { VIEWS } from '../content/index.js';

// Resolved content for the active view.
export function useView() {
  return VIEWS[useCardStore((s) => s.view)];
}

export function useViewKey() {
  return useCardStore((s) => s.view);
}
