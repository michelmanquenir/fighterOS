import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { listar } from '../api/boxeadores'
import type { BoxeadorFiltros as Filtros } from '../api/types'
import { BoxeadorCard } from '../features/boxeadores/components/BoxeadorCard'
import { BoxeadorFiltros } from '../features/boxeadores/components/BoxeadorFiltros'

export function BoxeadoresListPage() {
  const [filtros, setFiltros] = useState<Filtros>({})
  const [page, setPage] = useState(0)
  const [busqueda, setBusqueda] = useState('')

  const query = useQuery({
    queryKey: ['boxeadores', filtros, page],
    queryFn: () => listar(filtros, page),
  })

  function handleFiltrosChange(next: Filtros) {
    setFiltros(next)
    setPage(0)
  }

  const busquedaNormalizada = busqueda.trim().toLowerCase()
  const boxeadores = query.data?.content.filter((boxeador) =>
    boxeador.nombre.toLowerCase().includes(busquedaNormalizada),
  )

  return (
    <Stack spacing={3}>
      <Typography variant="h1">Registro Nacional de Boxeadores</Typography>
      <BoxeadorFiltros
        filtros={filtros}
        onChange={handleFiltrosChange}
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
      />

      {query.isLoading && <CircularProgress />}
      {query.isError && <Typography color="error">No se pudo cargar el listado.</Typography>}

      {boxeadores && (
        <>
          <Grid container spacing={2}>
            {boxeadores.map((boxeador) => (
              <Grid key={boxeador.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <BoxeadorCard boxeador={boxeador} />
              </Grid>
            ))}
          </Grid>
          {boxeadores.length === 0 && (
            <Typography color="text.secondary">
              {busquedaNormalizada
                ? 'Ningún boxeador de esta página coincide con la búsqueda.'
                : 'No hay boxeadores para estos filtros.'}
            </Typography>
          )}
          {(query.data?.totalPages ?? 0) > 1 && (
            <Pagination
              count={query.data?.totalPages}
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
