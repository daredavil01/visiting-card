import general from './general.js';
import developer from './developer.js';
import runner from './runner.js';
import trekker from './trekker.js';

// Order here is the order of the segmented control, and the order the left/right
// arrow keys cycle through.
export const VIEWS = { general, developer, runner, trekker };

export const VIEW_KEYS = Object.keys(VIEWS);

export const DEFAULT_VIEW = 'general';

export function isView(key) {
  return Object.prototype.hasOwnProperty.call(VIEWS, key);
}
