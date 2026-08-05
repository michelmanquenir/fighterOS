import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { listar } from '../api/eventos'
import type { EventoFiltros as Filtros } from '../api/types'
import { EventoCard } from '../features/eventos/components/EventoCard'
import { EventoFiltros } from '../features/eventos/components/EventoFiltros'

export function HomePage() {
  const [filtros, setFiltros] = useState<Filtros>({})
  const [page, setPage] = useState(0)

  const query = useQuery({
    queryKey: ['eventos', filtros, page],
    queryFn: () => listar(filtros, page),
  })

  function handleFiltrosChange(next: Filtros) {
    setFiltros(next)
    setPage(0)
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h1">Próximos Eventos</Typography>
      <EventoFiltros filtros={filtros} onChange={handleFiltrosChange} />

      {query.isLoading && <CircularProgress />}
      {query.isError && <Typography color="error">No se pudo cargar el listado.</Typography>}

      {query.data && (
        <>
          <Grid container spacing={2}>
            {query.data.content.map((evento) => (
              <Grid key={evento.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <EventoCard evento={evento} />
              </Grid>
            ))}
          </Grid>
          {query.data.content.length === 0 && (
            <Typography color="text.secondary">No hay eventos para estos filtros.</Typography>
          )}
          {query.data.totalPages > 1 && (
            <Pagination
              count={query.data.totalPages}
              page={page + 1}
              onChange={(_event, value) => setPage(value - 1)}
              color="primary"
            />
          )}
        </>
      )}
    </Stack>
  )
}
