import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import Box from '@mui/material/Box'
import { SectionHeader } from './SectionHeader'

const TILES = 4

export function GaleriaSection() {
  return (
    <Box>
      <SectionHeader title="Galería multimedia" />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {Array.from({ length: TILES }).map((_, i) => (
          <Box
            key={i}
            sx={{
              aspectRatio: '1 / 1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? i % 2 === 0
                    ? 'linear-gradient(135deg, #1a1a1f, #0B0B0D)'
                    : 'linear-gradient(135deg, #1c0f0f, #0B0B0D)'
                  : i % 2 === 0
                    ? `linear-gradient(135deg, ${theme.palette.grey[200]}, ${theme.palette.background.paper})`
                    : `linear-gradient(135deg, #FBEAEA, ${theme.palette.background.paper})`,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <PhotoCameraIcon
              sx={{
                color: (theme) => (theme.palette.mode === 'dark' ? 'rgba(245,245,245,0.15)' : 'rgba(0,0,0,0.15)'),
                fontSize: 36,
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
