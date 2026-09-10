// Google Fonts → sfnt (TTF) buffers for resvg.
//
// The card loads its eight families from the Google Fonts CDN at runtime, so
// nothing is vendored in the repo. resvg has no network and no system copy of
// these faces, so the OG script fetches the same families once and caches the
// unwrapped fonts under scripts/.fontcache/ (gitignored). Re-running is free
// after that.
//
// The css2 endpoint serves woff2 to modern browsers and woff to old ones, and
// nothing at all serves plain TTF for the variable families here. resvg reads
// sfnt (TTF/OTF) only, so we ask with a 2010-era user agent for woff and unwrap
// it. WOFF1 is a thin container — per-table zlib inside an sfnt skeleton — so
// the unwrapping below is a few lines of node:zlib rather than a dependency.

import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CACHE = join(HERE, '.fontcache');

// A UA old enough that Google Fonts falls back to woff, and to a static
// instance of a variable family rather than the variable font itself.
const LEGACY_UA =
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.112 Safari/534.30';

// WOFF1 (w3.org/TR/WOFF): 44-byte header, then 20-byte directory entries, then
// each table zlib-deflated when it compressed smaller than the original.
function woffToSfnt(woff) {
  if (woff.toString('latin1', 0, 4) !== 'wOFF') {
    throw new Error('not a WOFF file');
  }

  const flavor = woff.readUInt32BE(4);
  const numTables = woff.readUInt16BE(12);

  const entries = [];
  for (let i = 0; i < numTables; i++) {
    const at = 44 + i * 20;
    entries.push({
      tag: woff.readUInt32BE(at),
      offset: woff.readUInt32BE(at + 4),
      compLength: woff.readUInt32BE(at + 8),
      origLength: woff.readUInt32BE(at + 12),
      checksum: woff.readUInt32BE(at + 16),
    });
  }

  const head = 12 + numTables * 16;
  const tables = entries.map((e) => {
    const raw = woff.subarray(e.offset, e.offset + e.compLength);
    const data = e.compLength < e.origLength ? inflateSync(raw) : raw;
    if (data.length !== e.origLength) {
      throw new Error('WOFF table length mismatch — the file is corrupt');
    }
    return data;
  });

  const padded = tables.map((d) => (4 - (d.length % 4)) % 4);
  const total = head + tables.reduce((n, d, i) => n + d.length + padded[i], 0);

  const out = Buffer.alloc(total);
  // sfnt header. searchRange/entrySelector/rangeShift are the spec's derived
  // binary-search hints; every reader recomputes them, but write them correctly.
  const maxPow = Math.floor(Math.log2(numTables));
  const searchRange = 2 ** maxPow * 16;
  out.writeUInt32BE(flavor, 0);
  out.writeUInt16BE(numTables, 4);
  out.writeUInt16BE(searchRange, 6);
  out.writeUInt16BE(maxPow, 8);
  out.writeUInt16BE(numTables * 16 - searchRange, 10);

  let at = head;
  entries.forEach((e, i) => {
    const rec = 12 + i * 16;
    out.writeUInt32BE(e.tag, rec);
    out.writeUInt32BE(e.checksum, rec + 4);
    out.writeUInt32BE(at, rec + 8);
    out.writeUInt32BE(e.origLength, rec + 12);
    tables[i].copy(out, at);
    at += tables[i].length + padded[i];
  });

  return out;
}

function slug(family, weight) {
  return `${family.replace(/\s+/g, '-').toLowerCase()}-${weight}.ttf`;
}

async function fetchOne(family, weight) {
  const cached = join(CACHE, slug(family, weight));
  if (existsSync(cached)) return cached;

  const css = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family,
  )}:wght@${weight}`;
  const res = await fetch(css, { headers: { 'user-agent': LEGACY_UA } });
  if (!res.ok) throw new Error(`${family} ${weight}: css2 returned ${res.status}`);

  const text = await res.text();
  const url = text.match(/src:\s*url\((https:[^)]+\.woff)\)/)?.[1];
  if (!url) {
    throw new Error(
      `${family} ${weight}: no woff source in the css2 response — Google may have ` +
        'changed what it serves the legacy user agent in scripts/fonts.mjs.',
    );
  }

  const font = await fetch(url);
  if (!font.ok) throw new Error(`${family} ${weight}: font returned ${font.status}`);
  const buf = woffToSfnt(Buffer.from(await font.arrayBuffer()));

  await mkdir(CACHE, { recursive: true });
  await writeFile(cached, buf);
  return cached;
}

// `spec` is { 'Family Name': [weight, ...] }. Returns a flat array of file paths
// for resvg's font.fontFiles.
//
// Paths, not buffers: resvg-js 2.6.2's `fontBuffers` loads the glyphs but not the
// family names, so every font-family in the SVG silently falls back to one face.
// `fontFiles` reads the same bytes off disk and matches families correctly.
export async function loadFonts(spec) {
  const jobs = [];
  for (const [family, weights] of Object.entries(spec)) {
    for (const weight of weights) jobs.push(fetchOne(family, weight));
  }
  return Promise.all(jobs);
}
