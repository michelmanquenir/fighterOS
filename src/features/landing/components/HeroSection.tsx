import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import ShieldIcon from '@mui/icons-material/Shield'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import GroupsIcon from '@mui/icons-material/Groups'
import GavelIcon from '@mui/icons-material/Gavel'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'

const BADGES = [
  { icon: ShieldIcon, title: '100% Amateur', subtitle: 'Deportistas reales' },
  { icon: HistoryEduIcon, title: 'Historial oficial', subtitle: 'Tu carrera, para siempre' },
  { icon: GroupsIcon, title: 'Comunidad unida', subtitle: 'Juntos somos más fuertes' },
  { icon: GavelIcon, title: 'Transparencia', subtitle: 'Reglas claras, siempre' },
]

export function HeroSection() {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid',
        borderColor: 'divider',
        background:
          'radial-gradient(circle at 82% 25%, rgba(214,40,40,0.22), transparent 55%), radial-gradient(circle at 15% 85%, rgba(201,162,39,0.10), transparent 45%), #0B0B0D',
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={{ xs: 6, md: 4 }} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3}>
              <Typography variant="h1" sx={{ fontSize: { xs: '2.75rem', md: '3.75rem' }, lineHeight: 1.05 }}>
                La plataforma que conecta a todo el{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>
                  deporte de combate amateur
                </Box>
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem', maxWidth: 560 }}>
                Registra deportistas, organiza eventos, encuentra rivales compatibles y construye
                el historial deportivo oficial.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={RouterLink}
                  to="/eventos"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<CalendarMonthIcon />}
                >
                  Explorar eventos
                </Button>
                <Button
                  component={RouterLink}
                  to="/registro"
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<HowToRegIcon />}
                >
                  Registrarse
                </Button>
              </Stack>

              <Grid container spacing={2} sx={{ pt: 2 }}>
                {BADGES.map(({ icon: Icon, title, subtitle }) => (
                  <Grid key={title} size={{ xs: 6, sm: 3 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                      <Icon color="primary" fontSize="small" sx={{ mt: 0.25 }} />
                      <Stack spacing={0}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {subtitle}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                position: 'relative',
                aspectRatio: '4 / 5',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                background:
                  'linear-gradient(155deg, #1a1a1f 0%, #0B0B0D 55%, #1c0f0f 100%)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'repeating-linear-gradient(115deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 10px)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: '55%',
                  background: 'linear-gradient(180deg, rgba(214,40,40,0.35), transparent 70%)',
                }}
              />
              <ShieldIcon
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: { xs: 140, md: 180 },
                  color: 'rgba(245,245,245,0.06)',
                }}
              />
              <Box sx={{ position: 'relative', p: { xs: 3, md: 4 } }}>
                <Typography variant="h4" sx={{ lineHeight: 1.1 }}>
                  Somos más que combates.
                </Typography>
                <Typography variant="h4" color="primary" sx={{ lineHeight: 1.1 }}>
                  Somos comunidad.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
