import Box from '@mui/material/Box'

// Barra roja plana usada como acento de marca en toda la landing:
// vertical junto a los títulos de sección, horizontal como subrayado.
export function AccentBar({ width = 40, vertical = false }: { width?: number; vertical?: boolean }) {
  if (vertical) {
    return <Box sx={{ width: 5, alignSelf: 'stretch', bgcolor: 'primary.main', flexShrink: 0 }} />
  }
  return <Box sx={{ width, height: 4, bgcolor: 'primary.main' }} />
}
