import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { obtenerPerfil } from '../api/boxeadores'
import { listarCategoriasPeso } from '../api/catalogos'
import { useAuth } from '../auth/useAuth'
import { CombatesCard } from '../features/boxeadores/components/CombatesCard'
import { EditarPerfilDialog } from '../features/boxeadores/components/EditarPerfilDialog'
import { EquipoCard } from '../features/boxeadores/components/EquipoCard'
import { InformacionBasicaCard } from '../features/boxeadores/components/InformacionBasicaCard'
import { MultimediaCard } from '../features/boxeadores/components/MultimediaCard'
import { PalmaresResumenCard } from '../features/boxeadores/components/PalmaresResumenCard'
import { PerfilDeportivoCard } from '../features/boxeadores/components/PerfilDeportivoCard'
import { PerfilHero } from '../features/boxeadores/components/PerfilHero'
import { PerfilPrivadoCard } from '../features/boxeadores/components/PerfilPrivadoCard'

export function BoxeadorPerfilPage() {
  const { id } = useParams<{ id: string }>()
  const { auth } = useAuth()
  const [editOpen, setEditOpen] = useState(false)

  const query = useQuery({
    queryKey: ['boxeador', id],
    queryFn: () => obtenerPerfil(id!),
    enabled: !!id,
  })
  const categoriasQuery = useQuery({
    queryKey: ['catalogos', 'categorias-peso'],
    queryFn: listarCategoriasPeso,
  })

  if (!id) return null
  if (query.isLoading) return <CircularProgress />
  if (query.isError || !query.data) {
    return <Typography color="error">No se encontró el boxeador.</Typography>
  }

  const boxeador = query.data
  const esPropio = auth?.usuarioId === boxeador.id
  const verPublico = esPropio || boxeador.perfilPublico
  const pesoMax = categoriasQuery.data?.find((c) => c.id === boxeador.categoriaId)?.pesoMax ?? null

  return (
    <Stack spacing={4}>
      <PerfilHero
        boxeador={boxeador}
        esPropio={esPropio}
        pesoMax={pesoMax}
        onEditar={() => setEditOpen(true)}
      />

      {verPublico ? (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Stack spacing={3}>
              <PerfilDeportivoCard
                boxeadorId={boxeador.id}
                edad={boxeador.edad}
                pesoActual={boxeador.pesoActual}
                categoriaNombre={boxeador.categoriaNombre}
                nivelProgresion={boxeador.nivelProgresion}
              />
              <MultimediaCard boxeadorId={boxeador.id} esPropio={esPropio} />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <CombatesCard boxeadorId={boxeador.id} />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={3}>
              <PalmaresResumenCard boxeadorId={boxeador.id} esPropio={esPropio} />
              <EquipoCard entrenadorNombre={boxeador.entrenadorNombre} gimnasioNombre={boxeador.gimnasioNombre} />
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={4}>
              <InformacionBasicaCard
                pesoActual={boxeador.pesoActual}
                categoriaNombre={boxeador.categoriaNombre}
                gimnasioNombre={boxeador.gimnasioNombre}
                regionNombre={boxeador.regionNombre}
              />
              <PerfilPrivadoCard nombre={boxeador.nombre} />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <EquipoCard entrenadorNombre={boxeador.entrenadorNombre} gimnasioNombre={boxeador.gimnasioNombre} />
          </Grid>
        </Grid>
      )}

      {esPropio && (
        <EditarPerfilDialog boxeador={boxeador} open={editOpen} onClose={() => setEditOpen(false)} />
      )}
    </Stack>
  )
}
