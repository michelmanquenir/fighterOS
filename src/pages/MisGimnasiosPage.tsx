import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import { obtenerMisGimnasios } from '../api/gimnasios'
import { GimnasioRosterCard } from '../features/gimnasios/components/GimnasioRosterCard'

export function MisGimnasiosPage() {
  const query = useQuery({
    queryKey: ['gimnasios', 'mios'],
    queryFn: obtenerMisGimnasios,
  })

  return (
    <Stack spacing={3}>
      <Typography variant="h1">Mis Gimnasios</Typography>

      {query.isLoading && <CircularProgress />}
      {query.isError && <Typography color="error">No se pudieron cargar tus gimnasios.</Typography>}

      {query.data && query.data.length === 0 && (
        <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
          <Typography color="text.secondary">Todavía no tienes un gimnasio registrado.</Typography>
          <Button component={RouterLink} to="/gimnasios/crear" variant="contained">
            Crear gimnasio
          </Button>
        </Stack>
      )}

      {query.data && query.data.length > 0 && (
        <Stack spacing={3}>
          {query.data.map((gimnasio) => (
            <GimnasioRosterCard key={gimnasio.id} gimnasio={gimnasio} />
          ))}
        </Stack>
      )}
    </Stack>
  )
}
