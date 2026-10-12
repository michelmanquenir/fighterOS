import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import PlaceIcon from '@mui/icons-material/Place'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { listar as listarBoxeadores } from '../../../api/boxeadores'
import { listar as listarEventos } from '../../../api/eventos'
import { AccentBar } from './AccentBar'

const ENLACES = [
  { categoria: 'Eventos', titulo: 'Explora la cartelera nacional de boxeo amateur', to: '/eventos' },
  { categoria: 'Peleadores', titulo: 'Conoce a los deportistas de la comunidad', to: '/boxeadores' },
  { categoria: 'Clubes', titulo: 'Gimnasios registrados en todo el país', to: '/clubes' },
  { categoria: 'Rankings', titulo: 'El escalafón oficial, próximamente', to: '/rankings' },
  { categoria: 'Entrenadores', titulo: 'Perfiles de entrenadores, próximamente', to: '/entrenadores' },
]

function PanelOscuro({ children }: { children: ReactNode }) {
  return (
    <Stack
      sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'background.paper' : 'grey.900'),
        color: '#FFFFFF',
        height: '100%',
        p: { xs: 3, md: 3.5 },
      }}
    >
      {children}
    </Stack>
  )
}

export function HeroSection() {
  const eventosQuery = useQuery({ queryKey: ['eventos', 'landing-proximo'], queryFn: () => listarEventos({}, 0) })
  const boxeadoresQuery = useQuery({
    queryKey: ['boxeadores', 'landing-destacados'],
    queryFn: () => listarBoxeadores({}, 0),
  })

  const proximoEvento = eventosQuery.data?.content?.[0]
  const peleadores = boxeadoresQuery.data?.content?.slice(0, 4) ?? []

  return (
    <Box sx={{ bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={2}>
          {/* Hero principal */}
          <Grid size={{ xs: 12, md: 8 }}>
            <PanelOscuro>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Stack spacing={0.5}>
                  <Typography variant="overline" sx={{ lineHeight: 1.4 }}>
                    Peleadores reales
                    <br />
                    Historias reales
                  </Typography>
                  <AccentBar />
                </Stack>
                <Stack spacing={0.5} sx={{ textAlign: 'right' }}>
                  <Typography variant="overline" sx={{ lineHeight: 1.4 }}>
                    Boxeo
                    <br />
                    Disciplina
                    <br />
                    Respeto
                    <br />
                    Futuro
                  </Typography>
                  <AccentBar width={32} />
                </Stack>
              </Stack>

              <Stack spacing={3} sx={{ flexGrow: 1, justifyContent: 'center', py: 4 }}>
                <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, lineHeight: 1 }}>
                  Más que pelea
                  <br />
                  somos{' '}
                  <Box component="span" sx={{ color: 'primary.main' }}>
                    comunidad
                  </Box>
                </Typography>
                <Typography sx={{ color: 'grey.400', maxWidth: 460 }}>
                  Registra deportistas, organiza eventos, encuentra rivales compatibles y construye
                  el historial deportivo oficial del boxeo amateur chileno.
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
                    Ver cartelera completa
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/registro"
                    variant="outlined"
                    size="large"
                    startIcon={<HowToRegIcon />}
                    sx={{ color: '#FFFFFF', borderColor: '#FFFFFF', '&:hover': { borderColor: '#FFFFFF' } }}
                  >
                    Conoce la comunidad
                  </Button>
                </Stack>
              </Stack>
            </PanelOscuro>
          </Grid>

          {/* Explora Fighteros */}
          <Grid size={{ xs: 12, md: 4 }}>
            <PanelOscuro>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Explora Fighteros
              </Typography>
              <Stack spacing={0} sx={{ flexGrow: 1 }}>
                {ENLACES.map((enlace, index) => (
                  <Stack
                    key={enlace.to}
                    component={RouterLink}
                    to={enlace.to}
                    direction="row"
                    spacing={2}
                    sx={{
                      alignItems: 'center',
                      py: 1.5,
                      textDecoration: 'none',
                      color: 'inherit',
                      borderBottom: index < ENLACES.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        flexShrink: 0,
                        bgcolor: 'primary.main',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Stack spacing={0} sx={{ minWidth: 0 }}>
                      <Typography variant="overline" sx={{ color: 'primary.light', lineHeight: 1.6 }}>
                        {enlace.categoria}
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.3 }}>
                        {enlace.titulo}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </PanelOscuro>
          </Grid>

          {/* Rankings teaser */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <PanelOscuro>
              <Stack spacing={1.5} sx={{ height: '100%', justifyContent: 'space-between' }}>
                <Stack spacing={1}>
                  <Typography variant="overline" sx={{ color: 'grey.400' }}>
                    Rankings Fighteros
                  </Typography>
                  <Typography variant="h5">El escalafón oficial está en camino</Typography>
                  <AccentBar width={32} />
                </Stack>
                <Button component={RouterLink} to="/rankings" size="small" sx={{ color: '#FFFFFF', alignSelf: 'flex-start' }} endIcon={<ArrowForwardIcon />}>
                  Ver más
                </Button>
              </Stack>
            </PanelOscuro>
          </Grid>

          {/* Próximo evento */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <PanelOscuro>
              {proximoEvento ? (
                <Stack spacing={1.5} sx={{ height: '100%', justifyContent: 'space-between' }}>
                  <Stack spacing={1}>
                    <Typography variant="overline" sx={{ color: 'grey.400' }}>
                      Próximo evento
                    </Typography>
                    <Typography variant="h5" noWrap>
                      {proximoEvento.nombre}
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                      <CalendarMonthIcon fontSize="small" sx={{ color: 'grey.500' }} />
                      <Typography variant="body2" sx={{ color: 'grey.400' }}>
                        {new Date(proximoEvento.fecha).toLocaleDateString('es-CL')}
                      </Typography>
                    </Stack>
                    {proximoEvento.lugar && (
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                        <PlaceIcon fontSize="small" sx={{ color: 'grey.500' }} />
                        <Typography variant="body2" sx={{ color: 'grey.400' }} noWrap>
                          {proximoEvento.lugar}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                  <Button
                    component={RouterLink}
                    to={`/eventos/${proximoEvento.id}`}
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Más información
                  </Button>
                </Stack>
              ) : (
                <Stack spacing={1} sx={{ height: '100%', justifyContent: 'center' }}>
                  <Typography variant="overline" sx={{ color: 'grey.400' }}>
                    Próximo evento
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    Todavía no hay eventos publicados.
                  </Typography>
                </Stack>
              )}
            </PanelOscuro>
          </Grid>

          {/* Peleadores destacados */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <PanelOscuro>
              <Stack spacing={1.5} sx={{ height: '100%' }}>
                <Typography variant="overline" sx={{ color: 'grey.400' }}>
                  Peleadores destacados
                </Typography>
                {peleadores.length > 0 ? (
                  <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
                    {peleadores.map((p) => (
                      <Stack
                        key={p.id}
                        component={RouterLink}
                        to={`/boxeadores/${p.id}`}
                        spacing={0.5}
                        sx={{ alignItems: 'center', textDecoration: 'none', color: 'inherit', width: 64 }}
                      >
                        <Avatar src={p.fotoUrl ?? undefined} sx={{ width: 48, height: 48 }}>
                          {p.nombre.charAt(0)}
                        </Avatar>
                        <Typography variant="caption" noWrap sx={{ maxWidth: 64 }}>
                          {p.nombre}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    Todavía no hay peleadores registrados.
                  </Typography>
                )}
                <Button
                  component={RouterLink}
                  to="/boxeadores"
                  size="small"
                  sx={{ color: '#FFFFFF', alignSelf: 'flex-start' }}
                  endIcon={<EmojiEventsIcon fontSize="small" />}
                >
                  Ver todos
                </Button>
              </Stack>
            </PanelOscuro>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
