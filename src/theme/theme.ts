import { createTheme } from '@mui/material/styles'

// Dark & Editorial: cartel de pelea, no dashboard SaaS.
// Fondo casi negro, acento rojo sangre, tipografía condensada en mayúsculas
// para títulos, esquinas rectas, sin sombras Material por defecto.

const colors = {
  background: '#0B0B0D',
  paper: '#16161A',
  border: '#26262B',
  accent: '#D62828',
  gold: '#C9A227',
  textPrimary: '#F5F5F5',
  textSecondary: '#A1A1AA',
}

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: colors.background,
      paper: colors.paper,
    },
    primary: {
      main: colors.accent,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: colors.gold,
      contrastText: '#0B0B0D',
    },
    error: {
      main: '#FF5252',
    },
    warning: {
      main: '#F5A623',
    },
    success: {
      main: '#4CAF50',
    },
    info: {
      main: '#3B82F6',
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
    divider: colors.border,
  },
  shape: {
    borderRadius: 2,
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: { fontFamily: '"Bebas Neue", sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '3.5rem' },
    h2: { fontFamily: '"Bebas Neue", sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '2.75rem' },
    h3: { fontFamily: '"Bebas Neue", sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '2.25rem' },
    h4: { fontFamily: '"Bebas Neue", sans-serif', textTransform: 'uppercase', letterSpacing: '0.03em', fontSize: '1.75rem' },
    h5: { fontFamily: '"Bebas Neue", sans-serif', textTransform: 'uppercase', letterSpacing: '0.03em', fontSize: '1.375rem' },
    h6: { fontFamily: '"Bebas Neue", sans-serif', textTransform: 'uppercase', letterSpacing: '0.03em', fontSize: '1.125rem' },
    button: {
      textTransform: 'uppercase',
      fontWeight: 700,
      letterSpacing: '0.05em',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background,
          backgroundImage: 'none',
          boxShadow: 'none',
          borderBottom: `1px solid ${colors.border}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${colors.border}`,
          boxShadow: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: `0 0 0 1px ${colors.accent}`,
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          textTransform: 'uppercase',
          fontWeight: 700,
          fontSize: '0.7rem',
          letterSpacing: '0.03em',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: '0.03em',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: colors.border,
        },
      },
    },
  },
})
