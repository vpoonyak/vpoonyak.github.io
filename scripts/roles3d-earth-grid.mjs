// Rebuilds public/roles3d/assets/earth-grid.png from the archival raw grid at
// design/roles3d/earth-grid.bin.
//
// The raw grid is 512x256 RGBA-ish bytes sampled out of the living_earth GLB:
// channel 0 is the normalised radius (relief), channels 1-3 are the surface
// colour. Shipped raw it was 512 KB, and gzip only got it to 355 KB -- it was
// by far the heaviest thing the stage downloaded, and the scene blocked on it.
//
// Preserve the original 512x256 surface colour for the detailed globe mesh.
// A light 3x3 Gaussian filter on relief reduces isolated spikes while keeping
// finer land features. PNG filtering compresses both planes in one request.
//
// The two data planes are stacked into one image rather than shipped as two
// files (one request, and no second round trip):
//
//     rows   0..255  -> RGB = surface colour
//     rows 256..511  -> R=G=B = relief
//
// RGB, never RGBA: canvas stores alpha-premultiplied, so a data channel put in
// the alpha slot comes back out of getImageData quantised.
//
//     node scripts/roles3d-earth-grid.mjs

import fs from 'node:fs';
import zlib from 'node:zlib';
import { MASK_W, MASK_H, MASK_B64 } from '../public/roles3d/land-mask.js';

const SRC = 'design/roles3d/earth-grid.bin';
const OUT = 'public/roles3d/assets/earth-grid.png';
const W = 512, H = 256;          // source grid
const GW = W, GH = H;           // retain source resolution
const mask = Buffer.from(MASK_B64, 'base64');
// Keep a coast margin wider than the bilinear/filter footprints. Ocean-only
// texels never reach the visible surface, so blanking them is lossless there.
function nearLand(x, y) {
  const sourceLon = (x + 0.5) / W * 360 - 180;
  const sourceLat = 90 - (y + 0.5) / H * 180;
  const lon = 90 - sourceLon, lat = -sourceLat;
  for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
    const mx = ((Math.floor((lon + 180) / 360 * MASK_W) + dx) % MASK_W + MASK_W) % MASK_W;
    const my = Math.max(0, Math.min(MASK_H - 1, Math.floor((90 - lat) / 180 * MASK_H) + dy));
    const i = my * MASK_W + mx;
    if ((mask[i >> 3] >> (7 - (i & 7))) & 1) return true;
  }
  return false;
}

const crcTable = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
const crc32 = (b) => {
  let c = -1;
  for (const x of b) c = crcTable[(c ^ x) & 255] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const sum = Buffer.alloc(4); sum.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, sum]);
}

// Adaptive filtering: try all five PNG filters per row and keep the one with
// the smallest sum of absolute (signed) deltas, which is the heuristic the
// spec itself suggests and what libpng does.
function encodePNG(w, h, pixels) {
  const bpp = 3, stride = w * bpp;
  const raw = Buffer.alloc((stride + 1) * h);
  const cand = Buffer.alloc(stride);
  const paeth = (a, b, c) => {
    const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  for (let y = 0; y < h; y++) {
    let best = null, bestScore = Infinity, bestFilter = 0;
    for (let f = 0; f < 5; f++) {
      let score = 0;
      for (let i = 0; i < stride; i++) {
        const x = pixels[y * stride + i];
        const a = i >= bpp ? pixels[y * stride + i - bpp] : 0;
        const b = y ? pixels[(y - 1) * stride + i] : 0;
        const c = i >= bpp && y ? pixels[(y - 1) * stride + i - bpp] : 0;
        const v = (f === 0 ? x : f === 1 ? x - a : f === 2 ? x - b : f === 3 ? x - ((a + b) >> 1) : x - paeth(a, b, c)) & 255;
        cand[i] = v;
        score += v < 128 ? v : 256 - v;
      }
      if (score < bestScore) { bestScore = score; bestFilter = f; best = Buffer.from(cand); }
    }
    raw[y * (stride + 1)] = bestFilter;
    best.copy(raw, y * (stride + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // colour type: truecolour, no alpha
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const src = fs.readFileSync(SRC);
if (src.length !== W * H * 4) throw new Error(`${SRC}: expected ${W * H * 4} bytes, got ${src.length}`);

const out = Buffer.alloc(GW * GH * 2 * 3);
for (let y = 0; y < GH; y++) {
  for (let x = 0; x < GW; x++) {
    if (!nearLand(x, y)) continue;
    let elevation = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const sx = (x + dx + W) % W;
        const sy = Math.max(0, Math.min(H - 1, y + dy));
        const weight = (dx === 0 ? 2 : 1) * (dy === 0 ? 2 : 1);
        elevation += src[(sy * W + sx) * 4] * weight;
      }
    }
    const colour = (y * GW + x) * 3;
    const source = (y * W + x) * 4;
    out[colour] = src[source + 1];
    out[colour + 1] = src[source + 2];
    out[colour + 2] = src[source + 3];
    const relief = ((GH + y) * GW + x) * 3;
    out[relief] = out[relief + 1] = out[relief + 2] = Math.round(elevation / 16);
  }
}

const png = encodePNG(GW, GH * 2, out);
fs.writeFileSync(OUT, png);
console.log(`${OUT}: ${GW}x${GH * 2} RGB, ${png.length} bytes (from ${src.length} raw)`);
