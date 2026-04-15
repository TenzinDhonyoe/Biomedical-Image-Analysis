/**
 * Pure image processing utilities for interactive demos.
 * All operations work on flat arrays of grayscale values (0-255).
 */

// --- Test Image Generation ---

export function generateTestImage(
  w: number,
  h: number,
  type: 'checkerboard' | 'circle' | 'gradient' | 'lines' | 'cameraman'
): Uint8Array {
  const img = new Uint8Array(w * h);

  switch (type) {
    case 'checkerboard': {
      const blockSize = Math.max(1, Math.floor(w / 8));
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          const bx = Math.floor(x / blockSize) % 2;
          const by = Math.floor(y / blockSize) % 2;
          img[y * w + x] = (bx ^ by) ? 220 : 35;
        }
      break;
    }
    case 'circle': {
      const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.35;
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
          img[y * w + x] = d < r ? 200 : 30;
        }
      break;
    }
    case 'gradient': {
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++)
          img[y * w + x] = Math.round((x / (w - 1)) * 255);
      break;
    }
    case 'lines': {
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          const stripe = Math.floor(y / Math.max(1, Math.floor(h / 8))) % 2;
          img[y * w + x] = stripe ? 200 : 50;
        }
      break;
    }
    case 'cameraman': {
      // Synthetic "scene" with multiple shapes at different intensities
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          let v = 40; // background
          const nx = x / w, ny = y / h;
          // large circle
          if ((nx - 0.35) ** 2 + (ny - 0.4) ** 2 < 0.06) v = 180;
          // rectangle
          if (nx > 0.55 && nx < 0.85 && ny > 0.2 && ny < 0.7) v = 120;
          // small bright circle
          if ((nx - 0.3) ** 2 + (ny - 0.75) ** 2 < 0.015) v = 240;
          // diagonal gradient band
          if (Math.abs(nx + ny - 1.0) < 0.08) v = Math.round(80 + 150 * nx);
          img[y * w + x] = v;
        }
      break;
    }
  }
  return img;
}

// --- Histogram ---

export function histogram(img: Uint8Array | number[], levels = 256): number[] {
  const hist = new Array(levels).fill(0);
  for (let i = 0; i < img.length; i++) {
    const v = Math.max(0, Math.min(levels - 1, Math.round(img[i])));
    hist[v]++;
  }
  return hist;
}

// --- Convolution ---

export function convolve2d(
  img: Uint8Array | number[],
  kernel: number[][],
  w: number,
  h: number
): Float64Array {
  const kh = kernel.length;
  const kw = kernel[0].length;
  const khalf = Math.floor(kh / 2);
  const kwhalf = Math.floor(kw / 2);
  const out = new Float64Array(w * h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      for (let ky = 0; ky < kh; ky++) {
        for (let kx = 0; kx < kw; kx++) {
          const iy = y + ky - khalf;
          const ix = x + kx - kwhalf;
          if (iy >= 0 && iy < h && ix >= 0 && ix < w) {
            sum += img[iy * w + ix] * kernel[ky][kx];
          }
        }
      }
      out[y * w + x] = sum;
    }
  }
  return out;
}

// --- Noise ---

export function addGaussianNoise(img: Uint8Array, variance: number): Uint8Array {
  const out = new Uint8Array(img.length);
  const std = Math.sqrt(variance);
  for (let i = 0; i < img.length; i++) {
    // Box-Muller transform
    const u1 = Math.random() || 0.0001;
    const u2 = Math.random();
    const n = std * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    out[i] = Math.max(0, Math.min(255, Math.round(img[i] + n)));
  }
  return out;
}

export function addSaltPepperNoise(img: Uint8Array, density: number): Uint8Array {
  const out = new Uint8Array(img);
  for (let i = 0; i < out.length; i++) {
    const r = Math.random();
    if (r < density / 2) out[i] = 0;
    else if (r < density) out[i] = 255;
  }
  return out;
}

// --- 2D FFT (Cooley-Tukey radix-2) ---

function fft1d(real: Float64Array, imag: Float64Array, n: number, inverse: boolean) {
  // Bit-reversal permutation
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [real[i], real[j]] = [real[j], real[i]];
      [imag[i], imag[j]] = [imag[j], imag[i]];
    }
  }
  // FFT butterflies
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (2 * Math.PI / len) * (inverse ? -1 : 1);
    const wReal = Math.cos(ang);
    const wImag = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let curR = 1, curI = 0;
      for (let j = 0; j < len / 2; j++) {
        const uR = real[i + j], uI = imag[i + j];
        const vR = real[i + j + len / 2] * curR - imag[i + j + len / 2] * curI;
        const vI = real[i + j + len / 2] * curI + imag[i + j + len / 2] * curR;
        real[i + j] = uR + vR;
        imag[i + j] = uI + vI;
        real[i + j + len / 2] = uR - vR;
        imag[i + j + len / 2] = uI - vI;
        const newR = curR * wReal - curI * wImag;
        curI = curR * wImag + curI * wReal;
        curR = newR;
      }
    }
  }
  if (inverse) {
    for (let i = 0; i < n; i++) {
      real[i] /= n;
      imag[i] /= n;
    }
  }
}

export function fft2d(
  real: Float64Array,
  imag: Float64Array,
  w: number,
  h: number,
  inverse = false
) {
  // Transform rows
  const rowR = new Float64Array(w);
  const rowI = new Float64Array(w);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      rowR[x] = real[y * w + x];
      rowI[x] = imag[y * w + x];
    }
    fft1d(rowR, rowI, w, inverse);
    for (let x = 0; x < w; x++) {
      real[y * w + x] = rowR[x];
      imag[y * w + x] = rowI[x];
    }
  }
  // Transform columns
  const colR = new Float64Array(h);
  const colI = new Float64Array(h);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      colR[y] = real[y * w + x];
      colI[y] = imag[y * w + x];
    }
    fft1d(colR, colI, h, inverse);
    for (let y = 0; y < h; y++) {
      real[y * w + x] = colR[y];
      imag[y * w + x] = colI[y];
    }
  }
}

/** Shift zero-frequency component to center */
export function fftShift(data: Float64Array, w: number, h: number): Float64Array {
  const out = new Float64Array(w * h);
  const hw = w >> 1, hh = h >> 1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ny = (y + hh) % h;
      const nx = (x + hw) % w;
      out[ny * w + nx] = data[y * w + x];
    }
  }
  return out;
}

/** Compute log magnitude spectrum for display */
export function logMagnitude(real: Float64Array, imag: Float64Array): Float64Array {
  const mag = new Float64Array(real.length);
  for (let i = 0; i < real.length; i++) {
    mag[i] = Math.log(1 + Math.sqrt(real[i] ** 2 + imag[i] ** 2));
  }
  // Normalize to 0-255
  let max = 0;
  for (let i = 0; i < mag.length; i++) if (mag[i] > max) max = mag[i];
  if (max > 0) for (let i = 0; i < mag.length; i++) mag[i] = (mag[i] / max) * 255;
  return mag;
}

// --- Morphology ---

export function dilate(
  img: Uint8Array,
  w: number,
  h: number,
  se: boolean[][]
): Uint8Array {
  const sh = se.length, sw = se[0].length;
  const shalf = Math.floor(sh / 2), swhalf = Math.floor(sw / 2);
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let hit = false;
      for (let ky = 0; ky < sh && !hit; ky++) {
        for (let kx = 0; kx < sw && !hit; kx++) {
          if (!se[ky][kx]) continue;
          const iy = y + ky - shalf, ix = x + kx - swhalf;
          if (iy >= 0 && iy < h && ix >= 0 && ix < w && img[iy * w + ix] > 0) {
            hit = true;
          }
        }
      }
      out[y * w + x] = hit ? 255 : 0;
    }
  }
  return out;
}

export function erode(
  img: Uint8Array,
  w: number,
  h: number,
  se: boolean[][]
): Uint8Array {
  const sh = se.length, sw = se[0].length;
  const shalf = Math.floor(sh / 2), swhalf = Math.floor(sw / 2);
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let allFit = true;
      for (let ky = 0; ky < sh && allFit; ky++) {
        for (let kx = 0; kx < sw && allFit; kx++) {
          if (!se[ky][kx]) continue;
          const iy = y + ky - shalf, ix = x + kx - swhalf;
          if (iy < 0 || iy >= h || ix < 0 || ix >= w || img[iy * w + ix] === 0) {
            allFit = false;
          }
        }
      }
      out[y * w + x] = allFit ? 255 : 0;
    }
  }
  return out;
}

// --- Gaussian Blur Kernel ---

export function gaussianKernel(size: number, sigma: number): number[][] {
  const k = Math.floor(size / 2);
  const kernel: number[][] = [];
  let sum = 0;
  for (let y = -k; y <= k; y++) {
    const row: number[] = [];
    for (let x = -k; x <= k; x++) {
      const v = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
      row.push(v);
      sum += v;
    }
    kernel.push(row);
  }
  // Normalize
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
      kernel[y][x] /= sum;
  return kernel;
}
