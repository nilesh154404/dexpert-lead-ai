/**
 * Color utility functions for HSL colors
 */

export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

/**
 * Parse HSL string to object
 * Format: "240 60% 50%" -> { h: 240, s: 60, l: 50 }
 */
export function parseHSLString(hslString: string): HSLColor {
  const parts = hslString.trim().split(/\s+/);
  return {
    h: parseInt(parts[0], 10) || 0,
    s: parseInt(parts[1], 10) || 0,
    l: parseInt(parts[2], 10) || 0,
  };
}

/**
 * Convert HSL object to string
 * Format: { h: 240, s: 60, l: 50 } -> "240 60% 50%"
 */
export function toHSLString(hsl: HSLColor): string {
  return `${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%`;
}

/**
 * Convert HSL to RGB hex
 */
export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Convert RGB hex to HSL
 */
export function hexToHSL(hex: string): HSLColor {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}
