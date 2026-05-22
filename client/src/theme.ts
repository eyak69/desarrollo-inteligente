import { createTheme, alpha } from '@mui/material/styles';

// --- DESIGN TOKENS (Obsidian Premium) ---
export const DESIGN_TOKENS = {
  colors: {
    obsidian: '#050505',
    paper: '#0a0a0a',
    primary: '#3b82f6',
    secondary: '#a855f7',
    border: 'rgba(255, 255, 255, 0.05)',
    textPrimary: '#ffffff',
    textSecondary: '#a0a0a0',
  },
  glass: {
    blur: '20px',
    backgroundColor: 'rgba(10, 10, 10, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  }
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: DESIGN_TOKENS.colors.primary,
      light: '#60a5fa',
      dark: '#2563eb',
    },
    secondary: {
      main: DESIGN_TOKENS.colors.secondary,
    },
    background: {
      default: DESIGN_TOKENS.colors.obsidian,
      paper: DESIGN_TOKENS.colors.paper,
    },
    text: {
      primary: DESIGN_TOKENS.colors.textPrimary,
      secondary: DESIGN_TOKENS.colors.textSecondary,
    },
    divider: DESIGN_TOKENS.colors.border,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
        },
        containedPrimary: {
          boxShadow: `0 4px 14px 0 ${alpha(DESIGN_TOKENS.colors.primary, 0.39)}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: DESIGN_TOKENS.colors.border,
          backdropFilter: `blur(${DESIGN_TOKENS.glass.blur})`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: DESIGN_TOKENS.glass.backgroundColor,
          backgroundImage: 'none',
          borderRadius: 12,
          border: DESIGN_TOKENS.glass.border,
          backdropFilter: `blur(${DESIGN_TOKENS.glass.blur})`,
        },
      },
    },
  },
});

export default theme;
