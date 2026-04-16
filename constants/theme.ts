/**
 * Slow Roll Health OS — Design tokens
 * Ported from rotaryhtml_03APR26.html :root variables.
 */

import { Platform } from 'react-native';

// ---------------------------------------------------------------------------
// Palette (from HTML :root)
// ---------------------------------------------------------------------------

export const Palette = {
  bg: '#f5f2ea',
  bg2: '#fffdf8',
  panel: '#fffaf3',
  panel2: '#f2ede4',
  ink: '#14171a',
  muted: '#6d7780',
  line: 'rgba(20,23,26,0.10)',
  line2: 'rgba(20,23,26,0.16)',
  blue: '#2567ff',
  blue2: '#7ea7ff',
  green: '#1ea35d',
  green2: '#77d39a',
  orange: '#eb6a2d',
  orange2: '#ff9b61',
  cream: '#fff7ed',
  splash: '#56a6ff',
  danger: '#d34e4e',
  gold: '#c6952f',
  white: '#ffffff',
  cardBg: 'rgba(255,250,243,0.96)',
  cardBorder: 'rgba(20,23,26,0.10)',
} as const;

// ---------------------------------------------------------------------------
// Flag colors for lab values
// ---------------------------------------------------------------------------

export const FlagColors = {
  good: Palette.green,
  bad: Palette.danger,
  warn: Palette.gold,
} as const;

// ---------------------------------------------------------------------------
// Theme (light-only for now — the HTML is a light console)
// ---------------------------------------------------------------------------

export const Colors = {
  light: {
    text: Palette.ink,
    background: Palette.bg,
    tint: Palette.blue,
    icon: Palette.muted,
    tabIconDefault: Palette.muted,
    tabIconSelected: Palette.blue,
    card: Palette.cardBg,
    cardBorder: Palette.cardBorder,
    muted: Palette.muted,
    surface: Palette.panel,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: Palette.blue2,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: Palette.blue2,
    card: '#1e2022',
    cardBorder: 'rgba(255,255,255,0.08)',
    muted: '#9BA1A6',
    surface: '#1e2022',
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
