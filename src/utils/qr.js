// A minimal QR Code encoder — byte mode, error correction level M, versions 1
// through 10 (up to 213 bytes, far more than any URL this card produces).
//
// Written out rather than pulled from npm because the share panel needs to encode
// whatever combination the visitor is currently looking at, so the encoder has to
// ship to the browser; a general-purpose library is several times the size of the
// entire rest of this app. `npm run check:qr` verifies every module of the output
// against the reference `qrcode` package.
//
// Follows ISO/IEC 18004. The pieces, in order: Reed-Solomon over GF(256), the
// per-version block layout, bitstream assembly, function-pattern placement, the
// zigzag data walk, the eight masks with their penalty scores, and the BCH format
// and version information words.

// --- GF(256), primitive polynomial 0x11D -----------------------------------

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

const mul = (a, b) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]);

// Generator polynomial for `degree` error-correction codewords.
function generatorPoly(degree) {
  let poly = [1];
  for (let d = 0; d < degree; d++) {
    const next = new Array(poly.length + 1).fill(0);
    for (let i = 0; i < poly.length; i++) {
      next[i] ^= poly[i];
      next[i + 1] ^= mul(poly[i], EXP[d]);
    }
    poly = next;
  }
  return poly;
}

function ecCodewords(data, count) {
  const gen = generatorPoly(count);
  const rem = new Array(count).fill(0);
  for (const byte of data) {
    const factor = byte ^ rem[0];
    rem.shift();
    rem.push(0);
    for (let i = 0; i < count; i++) rem[i] ^= mul(gen[i + 1], factor);
  }
  return rem;
}

// --- Version tables, error correction level M ------------------------------

// [total codewords, EC codewords per block, block count group 1, data codewords
//  in group-1 blocks, block count group 2, data codewords in group-2 blocks]
const VERSIONS = {
  1: [26, 10, 1, 16, 0, 0],
  2: [44, 16, 1, 28, 0, 0],
  3: [70, 26, 1, 44, 0, 0],
  4: [100, 18, 2, 32, 0, 0],
  5: [134, 24, 2, 43, 0, 0],
  6: [172, 16, 4, 27, 0, 0],
  7: [196, 18, 4, 31, 0, 0],
  8: [242, 22, 2, 38, 2, 39],
  9: [292, 22, 3, 36, 2, 37],
  10: [346, 26, 4, 43, 1, 44],
};

// Byte-mode data capacity in characters, level M.
const CAPACITY = { 1: 14, 2: 26, 3: 42, 4: 62, 5: 84, 6: 106, 7: 122, 8: 152, 9: 180, 10: 213 };

// Row/column centres of the alignment patterns.
const ALIGNMENT = {
  1: [],
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
  7: [6, 22, 38],
  8: [6, 24, 42],
  9: [6, 26, 46],
  10: [6, 28, 50],
};

// Bits of padding after the final codeword.
const REMAINDER_BITS = { 1: 0, 2: 7, 3: 7, 4: 7, 5: 7, 6: 7, 7: 0, 8: 0, 9: 0, 10: 0 };

function pickVersion(byteLength) {
  for (let v = 1; v <= 10; v++) if (byteLength <= CAPACITY[v]) return v;
  throw new Error(`QR: ${byteLength} bytes exceeds the version-10 level-M capacity`);
}

// --- Bitstream --------------------------------------------------------------

class BitBuffer {
  constructor() {
    this.bits = [];
  }
  put(value, length) {
    for (let i = length - 1; i >= 0; i--) this.bits.push((value >>> i) & 1);
  }
  get length() {
    return this.bits.length;
  }
  toBytes() {
    const bytes = [];
    for (let i = 0; i < this.bits.length; i += 8) {
      let b = 0;
      for (let j = 0; j < 8; j++) b = (b << 1) | (this.bits[i + j] || 0);
      bytes.push(b);
    }
    return bytes;
  }
}

function buildCodewords(bytes, version) {
  const [total, ecPerBlock, g1Count, g1Size, g2Count, g2Size] = VERSIONS[version];
  const dataCount = total - ecPerBlock * (g1Count + g2Count);

  const bb = new BitBuffer();
  bb.put(0b0100, 4); // byte mode
  bb.put(bytes.length, version < 10 ? 8 : 16); // character count indicator
  for (const b of bytes) bb.put(b, 8);

  // Terminator, then pad to a byte boundary, then the alternating pad bytes.
  const capacityBits = dataCount * 8;
  bb.put(0, Math.min(4, capacityBits - bb.length));
  while (bb.length % 8 !== 0) bb.put(0, 1);
  const data = bb.toBytes();
  for (let i = 0; data.length < dataCount; i++) data.push(i % 2 === 0 ? 0xec : 0x11);

  // Split into blocks, compute EC for each, then interleave both halves.
  const blocks = [];
  let offset = 0;
  for (let i = 0; i < g1Count + g2Count; i++) {
    const size = i < g1Count ? g1Size : g2Size;
    const block = data.slice(offset, offset + size);
    offset += size;
    blocks.push({ data: block, ec: ecCodewords(block, ecPerBlock) });
  }

  const out = [];
  const maxData = Math.max(g1Size, g2Size);
  for (let i = 0; i < maxData; i++) {
    for (const b of blocks) if (i < b.data.length) out.push(b.data[i]);
  }
  for (let i = 0; i < ecPerBlock; i++) {
    for (const b of blocks) out.push(b.ec[i]);
  }
  return out;
}

// --- Matrix -----------------------------------------------------------------

// `null` marks a module that data may be written into; true/false are set.
function emptyMatrix(size) {
  return Array.from({ length: size }, () => new Array(size).fill(null));
}

function placeFinder(m, row, col) {
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const rr = row + r;
      const cc = col + c;
      if (rr < 0 || cc < 0 || rr >= m.length || cc >= m.length) continue;
      const inRing = r >= 0 && r <= 6 && (c === 0 || c === 6);
      const inCol = c >= 0 && c <= 6 && (r === 0 || r === 6);
      const inCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      m[rr][cc] = inRing || inCol || inCore;
    }
  }
}

function placeFunctionPatterns(m, version) {
  const size = m.length;

  placeFinder(m, 0, 0);
  placeFinder(m, 0, size - 7);
  placeFinder(m, size - 7, 0);

  // Timing patterns.
  for (let i = 8; i < size - 8; i++) {
    const on = i % 2 === 0;
    if (m[6][i] === null) m[6][i] = on;
    if (m[i][6] === null) m[i][6] = on;
  }

  // Alignment patterns, skipping the three finder corners.
  const centres = ALIGNMENT[version];
  for (const r of centres) {
    for (const c of centres) {
      if ((r === 6 && c === 6) || (r === 6 && c === size - 7) || (r === size - 7 && c === 6)) {
        continue;
      }
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          m[r + dr][c + dc] = Math.max(Math.abs(dr), Math.abs(dc)) !== 1;
        }
      }
    }
  }

  // The dark module, always set. placeFormatInfo writes over this cell and then
  // restores it, since the lower format strip passes through here.
  m[size - 8][8] = true;

  // Reserve the format-information strips so the data walk skips them.
  for (let i = 0; i < 9; i++) {
    if (m[8][i] === null) m[8][i] = false;
    if (m[i][8] === null) m[i][8] = false;
  }
  for (let i = 0; i < 8; i++) {
    if (m[8][size - 1 - i] === null) m[8][size - 1 - i] = false;
    if (m[size - 1 - i][8] === null) m[size - 1 - i][8] = false;
  }

  // Version information blocks, versions 7 and up.
  if (version >= 7) {
    for (let i = 0; i < 18; i++) {
      const r = Math.floor(i / 3);
      const c = size - 11 + (i % 3);
      m[r][c] = false;
      m[c][r] = false;
    }
  }
}

// A copy of the matrix marking which cells the function patterns occupy.
function reservedMask(version, size) {
  const m = emptyMatrix(size);
  placeFunctionPatterns(m, version);
  return m.map((row) => row.map((cell) => cell !== null));
}

function placeData(m, codewords, reserved) {
  const size = m.length;
  let bitIndex = 0;
  let upward = true;

  for (let right = size - 1; right >= 1; right -= 2) {
    // Column 6 is the vertical timing pattern; the walk skips over it.
    if (right === 6) right = 5;
    for (let step = 0; step < size; step++) {
      const row = upward ? size - 1 - step : step;
      for (const col of [right, right - 1]) {
        if (reserved[row][col]) continue;
        const byte = codewords[bitIndex >> 3];
        const bit = byte === undefined ? 0 : (byte >>> (7 - (bitIndex & 7))) & 1;
        m[row][col] = bit === 1;
        bitIndex++;
      }
    }
    upward = !upward;
  }
}

const MASKS = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (r, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
];

function applyMask(m, reserved, maskIndex) {
  const fn = MASKS[maskIndex];
  const out = m.map((row) => row.slice());
  for (let r = 0; r < m.length; r++) {
    for (let c = 0; c < m.length; c++) {
      if (!reserved[r][c] && fn(r, c)) out[r][c] = !out[r][c];
    }
  }
  return out;
}

// The four penalty rules from the specification; lower is better.
function penalty(m) {
  const size = m.length;
  let score = 0;

  // Rule 1: runs of five or more same-coloured modules in a row or column.
  for (const transposed of [false, true]) {
    for (let a = 0; a < size; a++) {
      let run = 1;
      for (let b = 1; b < size; b++) {
        const prev = transposed ? m[b - 1][a] : m[a][b - 1];
        const cur = transposed ? m[b][a] : m[a][b];
        if (cur === prev) {
          run++;
        } else {
          if (run >= 5) score += run - 2;
          run = 1;
        }
      }
      if (run >= 5) score += run - 2;
    }
  }

  // Rule 2: 2x2 blocks of one colour.
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = m[r][c];
      if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1]) score += 3;
    }
  }

  // Rule 3: the finder-like 1:1:3:1:1 sequence with four light modules beside it.
  const A = [true, false, true, true, true, false, true, false, false, false, false];
  const B = [false, false, false, false, true, false, true, true, true, false, true];
  const matches = (get, start) => {
    let a = true;
    let b = true;
    for (let i = 0; i < 11; i++) {
      const v = get(start + i);
      if (v !== A[i]) a = false;
      if (v !== B[i]) b = false;
    }
    return a || b;
  };
  for (let a = 0; a < size; a++) {
    for (let b = 0; b + 11 <= size; b++) {
      if (matches((i) => m[a][i], b)) score += 40;
      if (matches((i) => m[i][a], b)) score += 40;
    }
  }

  // Rule 4: deviation from an even balance of dark and light.
  //
  // The spec describes this as the distance to the nearer of the two multiples
  // of five bracketing the dark percentage; in practice every encoder in the
  // wild uses the equivalent ceil form below, and the two disagree for
  // percentages just above 50 — enough to pick a different mask. Matching the
  // common reading keeps this encoder's output identical to theirs.
  let dark = 0;
  for (const row of m) for (const v of row) if (v) dark++;
  const percent = (dark * 100) / (size * size);
  score += Math.abs(Math.ceil(percent / 5) - 10) * 10;

  return score;
}

// BCH(15,5) format information. Level M is 0b00.
function formatBits(maskIndex) {
  const data = (0b00 << 3) | maskIndex;
  let rem = data << 10;
  for (let i = 14; i >= 10; i--) {
    if ((rem >>> i) & 1) rem ^= 0b10100110111 << (i - 10);
  }
  return ((data << 10) | rem) ^ 0b101010000010010;
}

// BCH(18,6) version information, versions 7 and up. The generator is the
// degree-12 polynomial 0x1F25.
function versionBits(version) {
  let rem = version;
  for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
  return (version << 12) | rem;
}

function placeFormatInfo(m, maskIndex) {
  const size = m.length;
  const bits = formatBits(maskIndex);
  // The strips are written most-significant bit first: the module nearest the
  // top-left finder carries bit 14, not bit 0.
  const bit = (i) => ((bits >>> (14 - i)) & 1) === 1;

  // Copy one: around the top-left finder.
  for (let i = 0; i <= 5; i++) m[8][i] = bit(i);
  m[8][7] = bit(6);
  m[8][8] = bit(7);
  m[7][8] = bit(8);
  for (let i = 9; i <= 14; i++) m[14 - i][8] = bit(i);

  // Copy two: seven modules climbing from the bottom-left finder, then eight
  // running left-to-right beside the top-right one. The split is 7/8, not 8/7 —
  // the extra module is the top-right strip's leftmost column.
  for (let i = 0; i <= 6; i++) m[size - 1 - i][8] = bit(i);
  for (let i = 7; i <= 14; i++) m[8][size - 15 + i] = bit(i);

  // The lower strip runs straight through the dark module's cell, so the dark
  // module is restored last — it is not part of the format word.
  m[size - 8][8] = true;
}

function placeVersionInfo(m, version) {
  if (version < 7) return;
  const size = m.length;
  const bits = versionBits(version);
  for (let i = 0; i < 18; i++) {
    const on = ((bits >>> i) & 1) === 1;
    const r = Math.floor(i / 3);
    const c = size - 11 + (i % 3);
    m[r][c] = on;
    m[c][r] = on;
  }
}

// --- Public API -------------------------------------------------------------

// Returns a square array of booleans; true is a dark module. No quiet zone —
// callers add their own margin.
export function encodeQR(text) {
  const bytes = Array.from(new TextEncoder().encode(text));
  const version = pickVersion(bytes.length);
  const size = version * 4 + 17;

  const codewords = buildCodewords(bytes, version);
  // Trailing remainder bits are always zero and simply pad the walk.
  const withRemainder = codewords.concat(REMAINDER_BITS[version] ? [0] : []);

  const reserved = reservedMask(version, size);
  const base = emptyMatrix(size);
  placeFunctionPatterns(base, version);
  placeData(base, withRemainder, reserved);

  // Try all eight masks and keep the least penalised, as the spec requires.
  let best = null;
  let bestScore = Infinity;
  for (let maskIndex = 0; maskIndex < 8; maskIndex++) {
    const candidate = applyMask(base, reserved, maskIndex);
    placeFormatInfo(candidate, maskIndex);
    placeVersionInfo(candidate, version);
    const score = penalty(candidate);
    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  return best;
}

// Convenience for the share panel: the modules plus the geometry it needs.
export function qrModules(text) {
  const matrix = encodeQR(text);
  return { matrix, size: matrix.length };
}

// Exposed for scripts/check-qr.mjs, which compares mask scoring against the
// reference encoder. Not used by the app.
export const __penalty = penalty;
