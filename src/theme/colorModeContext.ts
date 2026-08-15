import { createContext } from 'react'
import type { PaletteMode } from '@mui/material/styles'

export interface ColorModeContextValue {
  mode: PaletteMode
  toggleMode: () => void
}

export const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined)
