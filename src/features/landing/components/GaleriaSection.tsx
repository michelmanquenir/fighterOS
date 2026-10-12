import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Section } from './Section'
import { SectionHeader } from './SectionHeader'

function TileVacio({ grande = false }: { grande?: boolean }) {
  return (
    <Stack
      sx={{
        position: 'relative',
        aspectRatio: grande ? '4 / 3' : '16 / 10',
        bgcolor: 'grey.900',
        color: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Chip
        label="Próximamente"
        size="small"
        color="primary"
        sx={{ position: 'absolute', top: 12, left: 12 }}
      />
      <PhotoCameraIcon sx={{ fontSize: grande ? 56 : 32, color: 'grey.600' }} />
    </Stack>
  )
}

export function GaleriaSection() {
  return (
    <Section sx={{ pt: 0 }}>
      <SectionHeader title="Galería multimedia" actionLabel="Ver toda la galería" actionTo="/contenido-destacado" />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ height: '100%' }}>
            <TileVacio grande />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={2}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid key={i} size={6}>
                <TileVacio />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Muy pronto encontrarás aquí fotos y videos de la comunidad Fighteros.
      </Typography>
    </Section>
  )
}
