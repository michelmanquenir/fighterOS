import { useState, type SyntheticEvent } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { obtenerPerfil } from '../api/boxeadores'
import { listarCategoriasPeso } from '../api/catalogos'
import { useAuth } from '../auth/useAuth'
import { EditarPerfilDialog } from '../features/boxeadores/components/EditarPerfilDialog'
import { EquipoCard } from '../features/boxeadores/components/EquipoCard'
import { EstadisticasTab } from '../features/boxeadores/components/EstadisticasTab'
import { HistorialTab } from '../features/boxeadores/components/HistorialTab'
import { InformacionBasicaCard } from '../features/boxeadores/components/InformacionBasicaCard'
import { MultimediaTab } from '../features/boxeadores/components/MultimediaTab'
import { PalmaresTab } from '../features/boxeadores/components/PalmaresTab'
import { PerfilHero } from '../features/boxeadores/components/PerfilHero'
import { PerfilPrivadoCard } from '../features/boxeadores/components/PerfilPrivadoCard'
import { ProximasPeleasTab } from '../features/boxeadores/components/ProximasPeleasTab'

type TabKey = 'estadisticas' | 'historial' | 'proximas' | 'palmares' | 'multimedia'

export function BoxeadorPerfilPage() {
  const { id } = useParams<{ id: string }>()
  const { auth } = useAuth()
  const [tab, setTab] = useState<TabKey>('estadisticas')
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
  const pesoMax = categoriasQuery.data?.find((c) => c.id === boxeador.categoriaId)?.pesoMax ?? null

  function handleTabChange(_event: SyntheticEvent, value: TabKey) {
    setTab(value)
  }

  return (
    <Stack spacing={4}>
      <PerfilHero
        boxeador={boxeador}
        esPropio={esPropio}
        pesoMax={pesoMax}
        onEditar={() => setEditOpen(true)}
      />

      <InformacionBasicaCard
        pesoActual={boxeador.pesoActual}
        categoriaNombre={boxeador.categoriaNombre}
        gimnasioNombre={boxeador.gimnasioNombre}
        regionNombre={boxeador.regionNombre}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          {esPropio ? (
            <Box>
              <Tabs value={tab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                <Tab label="Estadísticas" value="estadisticas" />
                <Tab label="Historial" value="historial" />
                <Tab label="Próximas peleas" value="proximas" />
                <Tab label="Palmarés" value="palmares" />
                <Tab label="Multimedia" value="multimedia" />
              </Tabs>
              <Box sx={{ pt: 3 }}>
                {tab === 'estadisticas' && <EstadisticasTab boxeadorId={boxeador.id} />}
                {tab === 'historial' && <HistorialTab boxeadorId={boxeador.id} />}
                {tab === 'proximas' && <ProximasPeleasTab boxeadorId={boxeador.id} />}
                {tab === 'palmares' && <PalmaresTab boxeadorId={boxeador.id} esPropio={esPropio} />}
                {tab === 'multimedia' && <MultimediaTab boxeadorId={boxeador.id} esPropio={esPropio} />}
              </Box>
            </Box>
          ) : (
            <PerfilPrivadoCard nombre={boxeador.nombre} />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <EquipoCard entrenadorNombre={boxeador.entrenadorNombre} gimnasioNombre={boxeador.gimnasioNombre} />
        </Grid>
      </Grid>

      {esPropio && (
        <EditarPerfilDialog boxeador={boxeador} open={editOpen} onClose={() => setEditOpen(false)} />
      )}
    </Stack>
  )
}
