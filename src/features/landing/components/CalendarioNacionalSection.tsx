import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PlaceIcon from '@mui/icons-material/Place'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import { listar } from '../../../api/eventos'
import type { EventoResponse } from '../../../api/types'
import { AccentBar } from './AccentBar'
import { Section } from './Section'
import { SectionHeader } from './SectionHeader'

const MESES_LABEL = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function proximosMeses(cantidad: number): Array<{ anio: number; mes: number }> {
  const ahora = new Date()
  return Array.from({ length: cantidad }, (_, i) => {
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth() + i, 1)
    return { anio: fecha.getFullYear(), mes: fecha.getMonth() }
  })
}

export function CalendarioNacionalSection() {
  const query = useQuery({
    queryKey: ['eventos', 'landing-calendario'],
    queryFn: () => listar({}, 0),
  })

  const eventos = query.data?.content ?? []
  const columnas = proximosMeses(4)

  function eventosDelMes(anio: number, mes: number): EventoResponse[] {
    return eventos
      .filter((e) => {
        const fecha = new Date(e.fecha)
        return fecha.getFullYear() === anio && fecha.getMonth() === mes
      })
      .sort((a, b) => a.fecha.localeCompare(b.fecha))
  }

  return (
    <Section sx={{ pt: 0 }}>
      <SectionHeader title="Calendario nacional" actionLabel="Ver todos los eventos" actionTo="/eventos" />
      <Grid container spacing={2}>
        {columnas.map(({ anio, mes }) => {
          const eventosDelMesActual = eventosDelMes(anio, mes)
          return (
            <Grid key={`${anio}-${mes}`} size={{ xs: 12, sm: 6, md: 3 }}>
              <Stack sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
                <Stack spacing={1} sx={{ bgcolor: 'grey.900', color: '#FFFFFF', p: 2 }}>
                  <Typography variant="h5">
                    {MESES_LABEL[mes]} {anio}
                  </Typography>
                  <AccentBar width={32} />
                </Stack>
                <Stack spacing={0} sx={{ flexGrow: 1 }}>
                  {eventosDelMesActual.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                      Sin eventos programados.
                    </Typography>
                  ) : (
                    eventosDelMesActual.map((evento, index) => (
                      <Stack
                        key={evento.id}
                        component={RouterLink}
                        to={`/eventos/${evento.id}`}
                        direction="row"
                        spacing={1.5}
                        sx={{
                          alignItems: 'center',
                          p: 1.5,
                          textDecoration: 'none',
                          color: 'inherit',
                          borderBottom:
                            index < eventosDelMesActual.length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider',
                        }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            flexShrink: 0,
                            bgcolor: 'primary.main',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                          }}
                        >
                          {String(new Date(evento.fecha).getDate()).padStart(2, '0')}
                        </Box>
                        <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                            {evento.nombre}
                          </Typography>
                          {evento.lugar && (
                            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                              <CalendarMonthIcon sx={{ fontSize: 14 }} color="disabled" />
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {evento.lugar}
                              </Typography>
                            </Stack>
                          )}
                          {evento.regionNombre && (
                            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                              <PlaceIcon sx={{ fontSize: 14 }} color="disabled" />
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {evento.regionNombre}
                              </Typography>
                            </Stack>
                          )}
                        </Stack>
                      </Stack>
                    ))
                  )}
                </Stack>
              </Stack>
            </Grid>
          )
        })}
      </Grid>
    </Section>
  )
}
