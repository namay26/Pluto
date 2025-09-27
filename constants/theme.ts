/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * Redesigned to match the modern financial app design with dark green/teal theme.
 */

import { Platform } from 'react-native';

const tintColorLight = '#00D4AA';
const tintColorDark = '#00D4AA';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF',
    background: '#0A0F0D',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
  },
};

// Modern Financial App Color Palette
export const AppColors = {
  // Background colors
  primary: '#0A0F0D',        // Main dark background
  secondary: '#1A2B23',      // Card backgrounds
  tertiary: '#2D4A3A',       // Elevated surfaces
  
  // Accent colors
  accent: '#00D4AA',         // Primary teal/green
  accentLight: '#4AE5C7',    // Lighter teal
  accentDark: '#00B894',     // Darker teal
  
  // Status colors
  success: '#00D4AA',        // Green for positive
  warning: '#FFD93D',        // Yellow for warnings
  danger: '#FF6B6B',         // Red for negative
  info: '#74B9FF',           // Blue for info
  
  // Text colors
  textPrimary: '#FFFFFF',    // Main text
  textSecondary: '#9CA3AF',  // Secondary text
  textMuted: '#6B7280',      // Muted text
  
  // Border colors
  border: '#374151',         // Default borders
  borderLight: '#4B5563',    // Light borders
  
  // Utility colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.25)',
};

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
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
