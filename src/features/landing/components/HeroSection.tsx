import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
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
import type { BoxeadorResumenResponse, EventoResponse } from '../../../api/types'
import { AccentBar } from './AccentBar'

// Foto de portada opcional: si existe public/hero.jpg se usa de fondo;
// si no, queda el negro plano de respaldo.
const HERO_IMAGEN = '/hero.jpg'
const NEGRO = '#111111'

const TOP_STORIES = [
  { categoria: 'Eventos', titulo: 'Cartelera nacional de boxeo amateur', to: '/eventos' },
  { categoria: 'Peleadores', titulo: 'Conoce a los deportistas de la comunidad', to: '/boxeadores' },
  { categoria: 'Clubes', titulo: 'Gimnasios registrados en todo Chile', to: '/clubes' },
  { categoria: 'Rankings', titulo: 'El escalafón oficial Fighteros, muy pronto', to: '/rankings' },
  { categoria: 'Entrenadores', titulo: 'Perfiles de entrenadores, muy pronto', to: '/entrenadores' },
  { categoria: 'Contenido', titulo: 'Historias, técnica y entrevistas', to: '/contenido-destacado' },
  { categoria: 'Comunidad', titulo: 'Regístrate y crea tu perfil deportivo', to: '/registro' },
]

function fechaLocal(fecha: string): Date {
  // "YYYY-MM-DD" se interpreta como UTC y en Chile se corre un día; forzar hora local.
  return new Date(`${fecha}T00:00:00`)
}

function TextoVertical({ lineas, align = 'left' }: { lineas: string[]; align?: 'left' | 'right' }) {
  return (
    <Stack spacing={0.75} sx={{ alignItems: align === 'left' ? 'flex-start' : 'flex-end' }}>
      <Typography
        sx={{
          fontFamily: '"Bebas Neue", sans-serif',
          letterSpacing: '0.18em',
          fontSize: '0.95rem',
          lineHeight: 1.25,
          color: '#FFFFFF',
          textAlign: align,
        }}
      >
        {lineas.map((l) => (
          <Box key={l} component="span" sx={{ display: 'block' }}>
            {l}
          </Box>
        ))}
      </Typography>
      <AccentBar width={24} />
    </Stack>
  )
}

function TarjetaInferior({
  titulo,
  to,
  accion,
  children,
}: {
  titulo: string
  to: string
  accion: string
  children: ReactNode
}) {
  return (
    <Stack sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', p: 1.5, height: '100%' }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.25, px: 0.5 }}>
        <Typography variant="h6">{titulo}</Typography>
        <Stack
          component={RouterLink}
          to={to}
          direction="row"
          spacing={0.5}
          sx={{ alignItems: 'center', textDecoration: 'none', color: 'text.primary' }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
            {accion}
          </Typography>
          <ArrowForwardIcon sx={{ fontSize: 16 }} color="primary" />
        </Stack>
      </Stack>
      <Box sx={{ flexGrow: 1, minHeight: 150, position: 'relative', bgcolor: NEGRO, color: '#FFFFFF' }}>
        {children}
      </Box>
    </Stack>
  )
}

function ProximoEvento({ evento }: { evento: EventoResponse | undefined }) {
  if (!evento) {
    return (
      <Stack sx={{ p: 2.5, height: '100%', justifyContent: 'center' }}>
        <Typography variant="body2" sx={{ color: 'grey.400' }}>
          Todavía no hay eventos publicados.
        </Typography>
      </Stack>
    )
  }

  const fecha = fechaLocal(evento.fecha)
    .toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' })
    .toUpperCase()

  return (
    <Box
      sx={{
        height: '100%',
        backgroundImage: evento.afichePosterUrl ? `url(${evento.afichePosterUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Stack spacing={0.5} sx={{ height: '100%', p: 2.5, bgcolor: 'rgba(0,0,0,0.6)', justifyContent: 'center' }}>
        <Typography variant="h4" sx={{ lineHeight: 1 }} noWrap>
          {evento.regionNombre ?? evento.nombre}
        </Typography>
        <Typography variant="h4" sx={{ lineHeight: 1 }}>
          {fecha}
        </Typography>
        <Typography variant="caption" sx={{ color: 'grey.400', letterSpacing: '0.1em', textTransform: 'uppercase' }} noWrap>
          {evento.lugar ?? evento.nombre}
        </Typography>
        <Box sx={{ pt: 1 }}>
          <Button
            component={RouterLink}
            to={`/eventos/${evento.id}`}
            variant="outlined"
            size="small"
            sx={{ color: '#FFFFFF', borderColor: 'primary.main', '&:hover': { borderColor: 'primary.main' } }}
          >
            Más información
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

function PeleadoresDestacados({ peleadores }: { peleadores: BoxeadorResumenResponse[] }) {
  if (peleadores.length === 0) {
    return (
      <Stack sx={{ p: 2.5, height: '100%', justifyContent: 'center' }}>
        <Typography variant="body2" sx={{ color: 'grey.400' }}>
          Todavía no hay peleadores registrados.
        </Typography>
      </Stack>
    )
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${peleadores.length}, 1fr)`, gap: '2px', height: '100%' }}>
      {peleadores.map((p) => (
        <Box
          key={p.id}
          component={RouterLink}
          to={`/boxeadores/${p.id}`}
          sx={{
            position: 'relative',
            minHeight: 150,
            bgcolor: 'grey.800',
            backgroundImage: p.fotoUrl ? `url(${p.fotoUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            textDecoration: 'none',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!p.fotoUrl && (
            <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '2.5rem', color: 'grey.600' }}>
              {p.nombre.charAt(0)}
            </Typography>
          )}
          <Stack
            spacing={0.5}
            sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, p: 1, bgcolor: 'rgba(0,0,0,0.65)', alignItems: 'center' }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.1 }} noWrap>
              {p.nombre}
            </Typography>
            <AccentBar width={20} />
          </Stack>
        </Box>
      ))}
    </Box>
  )
}

export function HeroSection() {
  const eventosQuery = useQuery({ queryKey: ['eventos', 'landing-proximo'], queryFn: () => listarEventos({}, 0) })
  const boxeadoresQuery = useQuery({
    queryKey: ['boxeadores', 'landing-destacados'],
    queryFn: () => listarBoxeadores({}, 0),
  })

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const proximoEvento = (eventosQuery.data?.content ?? [])
    .filter((e) => fechaLocal(e.fecha) >= hoy)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))[0]
  const peleadores = boxeadoresQuery.data?.content?.slice(0, 4) ?? []

  return (
    <Box sx={{ bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
        <Grid container spacing={2.5}>
          {/* Portada + tarjeta superpuesta */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 360, md: 470 },
                  bgcolor: NEGRO,
                  backgroundImage: `url(${HERO_IMAGEN})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.35)' }} />
                <Box sx={{ position: 'absolute', top: 28, left: 28 }}>
                  <TextoVertical lineas={['Peleadores', 'reales', 'Historias', 'reales']} />
                </Box>
                <Box sx={{ position: 'absolute', top: 28, right: 28, transform: 'rotate(-6deg)' }}>
                  <TextoVertical lineas={['Boxeo', 'Disciplina', 'Respeto', 'Futuro']} align="right" />
                </Box>
                <Typography
                  sx={{
                    position: 'absolute',
                    top: { xs: 110, md: 70 },
                    left: { xs: '40%', md: '57%' },
                    transform: 'rotate(-8deg)',
                    fontFamily: '"Bebas Neue", sans-serif',
                    fontSize: { xs: '1.8rem', md: '2.6rem' },
                    lineHeight: 0.95,
                    letterSpacing: '0.08em',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                  }}
                >
                  Más
                  <br />
                  que
                  <br />
                  pelea
                  <br />
                  somos
                  <br />
                  <Box component="span" sx={{ color: 'primary.main' }}>
                    comunidad
                  </Box>
                </Typography>
              </Box>

              <Box sx={{ position: 'relative', mt: { xs: -6, md: -9 }, mx: { xs: 1.5, md: 3 } }}>
                <Box sx={{ position: 'absolute', top: -6, left: 36, width: 220, height: 6, bgcolor: 'primary.main' }} />
                <Stack spacing={1.5} sx={{ bgcolor: 'background.paper', p: { xs: 2.5, md: 4 }, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Comunidad Fighteros
                  </Typography>
                  <Typography variant="h1" sx={{ fontSize: { xs: '2.4rem', md: '3.5rem' }, lineHeight: 1 }}>
                    El ring es de todos
                  </Typography>
                  <Typography color="text.secondary" sx={{ textTransform: 'uppercase', maxWidth: 640 }}>
                    El talento amateur sube al ring. Peleas, historias y nuevas promesas que representan el
                    futuro del combate en Chile.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
                    <Button component={RouterLink} to="/eventos" variant="contained" color="primary" size="large" sx={{ minWidth: 240 }}>
                      Ver cartelera completa
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/registro"
                      variant="outlined"
                      size="large"
                      sx={{ minWidth: 240, color: 'text.primary', borderColor: 'text.primary', '&:hover': { borderColor: 'text.primary' } }}
                    >
                      Conoce la comunidad
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          </Grid>

          {/* Top stories */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack sx={{ bgcolor: NEGRO, color: '#FFFFFF', p: { xs: 2.5, md: 3 }, height: '100%' }}>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.4rem' }, mb: 1.5 }}>
                Top stories
              </Typography>
              <Box sx={{ height: 2, bgcolor: 'primary.main' }} />
              <Stack sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
                {TOP_STORIES.map((story, index) => (
                  <Stack
                    key={story.to}
                    component={RouterLink}
                    to={story.to}
                    direction="row"
                    spacing={2}
                    sx={{
                      alignItems: 'center',
                      py: 1.5,
                      textDecoration: 'none',
                      color: 'inherit',
                      borderBottom: '2px solid',
                      borderColor: 'primary.main',
                      '&:hover .titulo-story': { color: 'primary.main' },
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: '"Bebas Neue", sans-serif',
                        fontSize: '1.6rem',
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Stack spacing={0} sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'grey.500', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {story.categoria}
                      </Typography>
                      <Typography
                        className="titulo-story"
                        sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.15rem', lineHeight: 1.1, letterSpacing: '0.03em' }}
                      >
                        {story.titulo}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Fila inferior */}
          <Grid size={{ xs: 12, md: 4 }}>
            <TarjetaInferior titulo="Rankings Fighteros" to="/rankings" accion="Ver todos">
              <Stack sx={{ height: '100%', justifyContent: 'center', alignItems: 'flex-end', p: 3 }}>
                <Stack spacing={1.25} sx={{ alignItems: 'flex-start' }}>
                  <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.35rem', letterSpacing: '0.12em', lineHeight: 1.2 }}>
                    Los mejores
                    <br />
                    peleadores amateur
                    <br />
                    de Chile
                  </Typography>
                  <AccentBar width={36} />
                </Stack>
              </Stack>
            </TarjetaInferior>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TarjetaInferior titulo="Próximos eventos" to="/eventos" accion="Ver cartelera">
              <ProximoEvento evento={proximoEvento} />
            </TarjetaInferior>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TarjetaInferior titulo="Peleadores destacados" to="/boxeadores" accion="Ver todos">
              <PeleadoresDestacados peleadores={peleadores} />
            </TarjetaInferior>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
