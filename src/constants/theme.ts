/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0B1320',
    background: '#F0F4F8',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E2E8F0',
    textSecondary: '#5B6B82',
    neonGreen: '#00BA52',
    accent: '#00BA52',
    pitchGreen: '#059669',
    gold: '#D97706',
    goldGlow: '#FDE68A',
    cardBg: '#FFFFFF',
    cardBorder: '#DCE4EC',
    liveRed: '#EF4444',
    electricCyan: '#0284C7',
    badgeDark: '#1E293B',
  },
  dark: {
    text: '#FFFFFF',
    background: '#070B14',
    backgroundElement: '#0E1726',
    backgroundSelected: '#16233B',
    textSecondary: '#8B9BB4',
    neonGreen: '#00FF87',
    accent: '#00FF87',
    pitchGreen: '#00D166',
    gold: '#FFD700',
    goldGlow: '#FFE566',
    cardBg: '#111B2E',
    cardBorder: '#1F2F4D',
    liveRed: '#FF3366',
    electricCyan: '#00E5FF',
    badgeDark: '#080E1B',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
