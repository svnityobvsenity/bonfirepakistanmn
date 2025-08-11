export const colors = {
  // Background colors
  primary: '#36393f',      // Main background
  secondary: '#2f3136',    // Secondary background (server list, channel list)
  tertiary: '#202225',     // Darker background
  hover: '#40444b',        // Hover state
  
  // Text colors
  textPrimary: '#ffffff',     // Primary white text
  textSecondary: '#b9bbbe',   // Secondary gray text
  textMuted: '#72767d',       // Muted gray text
  textDimmed: '#4f545c',      // Dimmed text
  
  // Accent colors
  blurple: '#5865f2',      // Discord blue
  green: '#3ba55d',        // Online status
  yellow: '#faa61a',       // Away status
  red: '#ed4245',          // DND status
  
  // UI elements
  channelSelected: '#42464d',  // Selected channel background
  messageHover: '#32353b',     // Message hover background
  divider: '#40444b',          // Divider lines
  
  // Status indicators
  online: '#3ba55d',
  idle: '#faa61a',
  dnd: '#ed4245',
  offline: '#747f8d',
} as const;

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  '4xl': '3rem',    // 48px
} as const;

export const typography = {
  fontFamily: {
    primary: ['Whitney', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
    mono: ['Consolas', 'Andale Mono WT', 'Andale Mono', 'Lucida Console', 'Lucida Sans Typewriter', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Liberation Mono', 'Nimbus Mono L', 'Monaco', 'Courier New', 'Courier', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
  },
} as const;

export const layout = {
  serverListWidth: '72px',
  channelListWidth: '240px',
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px',
  },
} as const;

export const borderRadius = {
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  full: '9999px',   // Full radius
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
} as const;
