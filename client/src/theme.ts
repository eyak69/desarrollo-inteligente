import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6', // Azul Eléctrico
      light: '#60a5fa',
      dark: '#2563eb',
    },
    secondary: {
      main: '#a855f7', // Púrpura sutil
    },
    background: {
      default: '#050505',
      paper: '#121212',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a0a0a0',
    },
    divider: 'rgba(255, 255, 255, 0.05)',
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
          boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#121212',
          backgroundImage: 'none',
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
