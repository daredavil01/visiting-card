import wanderer from './wanderer.js';
import terminal from './terminal.js';
import sahyadri from './sahyadri.js';
import blueprint from './blueprint.js';
import holographic from './holographic.js';

// Order here is the order of the chips in the theme toggle, and the order the
// up/down arrow keys cycle through.
export const THEMES = { wanderer, terminal, sahyadri, blueprint, holographic };

export const THEME_KEYS = Object.keys(THEMES);

export const DEFAULT_THEME = 'wanderer';

export function isTheme(key) {
  return Object.prototype.hasOwnProperty.call(THEMES, key);
}
