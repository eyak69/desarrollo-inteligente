// theme.example.ts
// Tema MUI base alineado al design system del blueprint.
// Copiar a /client/src/theme/theme.ts y ajustar lo mínimo necesario.

import { createTheme, type ThemeOptions, type PaletteMode } from '@mui/material';

const lightTokens = {
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  secondary: '#0F172A',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  border: '#E2E8F0',
  text: '#0F172A',
  textMuted: '#64748B',
  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  info: '#0284C7',
};

const darkTokens = {
  primary: '#60A5FA',
  primaryHover: '#3B82F6',
  secondary: '#E2E8F0',
  background: '#0B1220',
  surface: '#0F172A',
  surfaceAlt: '#1E293B',
  border: '#334155',
  text: '#E2E8F0',
  textMuted: '#94A3B8',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#F87171',
  info: '#38BDF8',
};

export const buildTheme = (mode: PaletteMode) => {
  const t = mode === 'light' ? lightTokens : darkTokens;

  const options: ThemeOptions = {
    palette: {
      mode,
      primary: { main: t.primary, dark: t.primaryHover },
      secondary: { main: t.secondary },
      background: { default: t.background, paper: t.surface },
      divider: t.border,
      text: { primary: t.text, secondary: t.textMuted },
      success: { main: t.success },
      warning: { main: t.warning },
      error: { main: t.error },
      info: { main: t.info },
    },
    spacing: 4, // base 4px → theme.spacing(2) = 8px
    shape: {
      borderRadius: 8, // md
    },
    typography: {
      fontFamily: `Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`,
      h1: { fontSize: 24, lineHeight: '32px', fontWeight: 600 }, // page
      h2: { fontSize: 20, lineHeight: '28px', fontWeight: 600 }, // section
      h3: { fontSize: 16, lineHeight: '24px', fontWeight: 600 }, // card
      body1: { fontSize: 14, lineHeight: '20px', fontWeight: 400 },
      body2: { fontSize: 13, lineHeight: '18px', fontWeight: 400 }, // table
      caption: { fontSize: 12, lineHeight: '16px', fontWeight: 400 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shadows: [
      'none',
      `0 1px 2px ${mode === 'light' ? 'rgba(15,23,42,0.06)' : 'rgba(0,0,0,0.4)'}`,
      `0 4px 8px ${mode === 'light' ? 'rgba(15,23,42,0.08)' : 'rgba(0,0,0,0.5)'}`,
      `0 8px 16px ${mode === 'light' ? 'rgba(15,23,42,0.10)' : 'rgba(0,0,0,0.55)'}`,
      `0 16px 32px ${mode === 'light' ? 'rgba(15,23,42,0.14)' : 'rgba(0,0,0,0.6)'}`,
      ...Array(20).fill('none'),
    ] as ThemeOptions['shadows'],
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true, variant: 'contained' },
        styleOverrides: {
          root: {
            minHeight: 40, // touch target ≥ 44 con padding
            borderRadius: 8,
          },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'small', fullWidth: true },
      },
      MuiPaper: {
        defaultProps: { elevation: 1 },
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiCssBaseline: {
        styleOverrides: {
          ':focus-visible': {
            outline: `2px solid ${t.primary}`,
            outlineOffset: 2,
          },
          'table tabular-nums': { fontVariantNumeric: 'tabular-nums' },
        },
      },
    },
  };

  return createTheme(options);
};

export const lightTheme = buildTheme('light');
export const darkTheme = buildTheme('dark');
