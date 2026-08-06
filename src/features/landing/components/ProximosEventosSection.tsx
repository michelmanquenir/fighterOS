import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { listar } from '../../../api/eventos'
import { EventoCard } from '../../eventos/components/EventoCard'
import { Section } from './Section'
import { SectionHeader } from './SectionHeader'

export function ProximosEventosSection() {
  const query = useQuery({
    queryKey: ['eventos', 'landing'],
    queryFn: () => listar({}, 0),
  })

  const eventos = query.data?.content?.slice(0, 5) ?? []

  return (
    <Section>
      <SectionHeader title="Próximos eventos" actionLabel="Ver todos" actionTo="/eventos" />

      {query.isLoading && (
        <Stack sx={{ alignItems: 'center', py: 4 }}>
          <CircularProgress />
        </Stack>
      )}
      {query.isError && (
        <Typography color="error">No se pudo cargar el listado de eventos.</Typography>
      )}
      {query.data && eventos.length === 0 && (
        <Typography color="text.secondary">Todavía no hay eventos publicados.</Typography>
      )}
      {eventos.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
          {eventos.map((evento) => (
            <Box key={evento.id} sx={{ flex: '0 0 220px', width: 220 }}>
              <EventoCard evento={evento} />
            </Box>
          ))}
        </Box>
      )}
    </Section>
  )
}
