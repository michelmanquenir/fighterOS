import AddCircleIcon from '@mui/icons-material/AddCircle'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SportsMmaIcon from '@mui/icons-material/SportsMma'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import { Section } from './Section'

const PUNTOS = [
  'Crea y publica tus eventos',
  'Invita gimnasios y deportistas',
  'Administra cartelera y resultados',
  'Gestiona árbitros y sedes',
  'Lleva tus eventos al siguiente nivel',
]

export function OrganizadorCtaSection() {
  return (
    <Box sx={{ bgcolor: 'background.paper', borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Section sx={{ py: { xs: 6, md: 6 } }}>
        <Grid container spacing={4} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={2}>
              <Typography variant="h3">¿Eres organizador?</Typography>
              <Stack spacing={1}>
                {PUNTOS.map((p) => (
                  <Stack key={p} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                    <Typography variant="body2">{p}</Typography>
                  </Stack>
                ))}
              </Stack>
              <Button
                component={RouterLink}
                to="/eventos/crear"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddCircleIcon />}
                sx={{ alignSelf: 'flex-start' }}
              >
                Crear evento
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <Box
              sx={{
                width: '100%',
                aspectRatio: '4 / 3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #1c0f0f, #0B0B0D)'
                    : `linear-gradient(135deg, #FBEAEA, ${theme.palette.background.default})`,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <SportsMmaIcon sx={{ fontSize: 96, color: 'rgba(214,40,40,0.4)' }} />
            </Box>
          </Grid>
        </Grid>
      </Section>
    </Box>
  )
}
