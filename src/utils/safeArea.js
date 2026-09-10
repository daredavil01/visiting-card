// Compact chrome offsets. A phone with a notch or a home indicator reports the
// intrusion through env(); on every other device these resolve to the plain 16px
// and 14px the layout used before.
export const SAFE_TOP = 'calc(16px + env(safe-area-inset-top))';
export const SAFE_BOTTOM = 'calc(16px + env(safe-area-inset-bottom))';
export const SAFE_LEFT = 'calc(14px + env(safe-area-inset-left))';
export const SAFE_RIGHT = 'calc(14px + env(safe-area-inset-right))';
