import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import { misEventos } from '../api/eventos'
import { EventoCard } from '../features/eventos/components/EventoCard'

export function MisEventosPage() {
  const [page, setPage] = useState(0)

  const query = useQuery({
    queryKey: ['eventos', 'mios', page],
    queryFn: () => misEventos(page),
  })

  return (
    <Stack spacing={3}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h1">Mis Eventos</Typography>
        <Button component={RouterLink} to="/eventos/crear" variant="contained" startIcon={<AddIcon />}>
          Crear evento
        </Button>
      </Stack>

      {query.isLoading && <CircularProgress />}
      {query.isError && <Typography color="error">No se pudo cargar tus eventos.</Typography>}

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
            <Typography color="text.secondary">Todavía no has creado ningún evento.</Typography>
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
