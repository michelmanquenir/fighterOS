import { createTheme, type PaletteMode } from '@mui/material/styles'

// Dark & Editorial: cartel de pelea, no dashboard SaaS.
// Acento rojo sangre, tipografía condensada en mayúsculas para
// títulos, esquinas rectas, sin sombras Material por defecto.
// El modo claro mantiene el mismo carácter con una paleta tipo
// papel de diario en vez de invertir colores sin más.

const palettes = {
  dark: {
    background: '#0B0B0D',
    paper: '#16161A',
    border: '#26262B',
    accent: '#D62828',
    gold: '#C9A227',
    textPrimary: '#F5F5F5',
    textSecondary: '#A1A1AA',
  },
  light: {
    background: '#F2F0EA',
    paper: '#FFFFFF',
    border: '#DCD8CE',
    accent: '#C41E1E',
    gold: '#9C7A0A',
    textPrimary: '#1A1A1D',
    textSecondary: '#5B5B63',
  },
} as const

export function createAppTheme(mode: PaletteMode) {
  const colors = palettes[mode]

  return createTheme({
    palette: {
      mode,
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
        contrastText: mode === 'dark' ? '#0B0B0D' : '#FFFFFF',
      },
      error: {
        main: mode === 'dark' ? '#FF5252' : '#C62828',
      },
      warning: {
        main: mode === 'dark' ? '#F5A623' : '#B36A00',
      },
      success: {
        main: mode === 'dark' ? '#4CAF50' : '#2E7D32',
      },
      info: {
        main: mode === 'dark' ? '#3B82F6' : '#1D4ED8',
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
}
