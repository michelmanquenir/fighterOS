import { useMemo, useState, type ReactNode } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, type PaletteMode } from '@mui/material/styles'
import { ColorModeContext } from './colorModeContext'
import { createAppTheme } from './theme'

const STORAGE_KEY = 'fighteros_theme_mode'

function leerModoGuardado(): PaletteMode {
  const guardado = localStorage.getItem(STORAGE_KEY)
  return guardado === 'light' || guardado === 'dark' ? guardado : 'dark'
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>(leerModoGuardado)

  function toggleMode() {
    setMode((actual) => {
      const siguiente = actual === 'dark' ? 'light' : 'dark'
      localStorage.setItem(STORAGE_KEY, siguiente)
      return siguiente
    })
  }

  const theme = useMemo(() => createAppTheme(mode), [mode])

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
