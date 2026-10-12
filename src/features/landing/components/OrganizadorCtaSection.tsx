import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import FavoriteIcon from '@mui/icons-material/Favorite'
import GroupsIcon from '@mui/icons-material/Groups'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import { AccentBar } from './AccentBar'

const PUNTOS = [
  { icon: VisibilityIcon, label: 'Más visibilidad' },
  { icon: GroupsIcon, label: 'Comunidad real' },
  { icon: FavoriteIcon, label: 'Apoyo al boxeo chileno' },
]

export function OrganizadorCtaSection() {
  return (
    <Box sx={{ bgcolor: 'grey.900', color: '#FFFFFF' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 6 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}>
          <Stack spacing={1.5} sx={{ flex: 1 }}>
            <Typography variant="h2">¿Eres organizador?</Typography>
            <AccentBar />
            <Typography sx={{ color: 'grey.400', maxWidth: 460 }}>
              Crea tus eventos en Fighteros y llega a más boxeadores, clubes y fanáticos en Chile.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={4} sx={{ flexWrap: 'wrap' }}>
            {PUNTOS.map(({ icon: Icon, label }) => (
              <Stack key={label} spacing={1} sx={{ alignItems: 'center', width: 100 }}>
                <Icon sx={{ fontSize: 32, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ textAlign: 'center', color: 'grey.300', fontWeight: 700 }}>
                  {label}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Button
            component={RouterLink}
            to="/eventos/crear"
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ flexShrink: 0 }}
          >
            Crear evento
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}
