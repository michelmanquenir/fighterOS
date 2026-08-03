import { useState, type SyntheticEvent } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { obtenerPerfil } from '../api/boxeadores'
import { useAuth } from '../auth/useAuth'
import { CategoriaChip } from '../features/boxeadores/components/CategoriaChip'
import { EditarPerfilDialog } from '../features/boxeadores/components/EditarPerfilDialog'
import { EstadisticasTab } from '../features/boxeadores/components/EstadisticasTab'
import { EstadoChip } from '../features/boxeadores/components/EstadoChip'
import { FotoUploadButton } from '../features/boxeadores/components/FotoUploadButton'
import { HistorialTab } from '../features/boxeadores/components/HistorialTab'
import { MultimediaTab } from '../features/boxeadores/components/MultimediaTab'
import { PalmaresTab } from '../features/boxeadores/components/PalmaresTab'
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

  if (!id) return null
  if (query.isLoading) return <CircularProgress />
  if (query.isError || !query.data) {
    return <Typography color="error">No se encontró el boxeador.</Typography>
  }

  const boxeador = query.data
  const esPropio = auth?.usuarioId === boxeador.id

  function handleTabChange(_event: SyntheticEvent, value: TabKey) {
    setTab(value)
  }

  return (
    <Stack spacing={4}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        sx={{ alignItems: { sm: 'center' } }}
      >
        <Box sx={{ position: 'relative' }}>
          <Avatar src={boxeador.fotoUrl ?? undefined} sx={{ width: 120, height: 120, fontSize: '2.5rem' }}>
            {boxeador.nombre.charAt(0)}
          </Avatar>
          {esPropio && (
            <Box sx={{ position: 'absolute', bottom: -8, right: -8 }}>
              <FotoUploadButton boxeadorId={boxeador.id} />
            </Box>
          )}
        </Box>

        <Stack spacing={1} sx={{ flexGrow: 1 }}>
          <Typography variant="h1">{boxeador.nombre}</Typography>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
            <CategoriaChip nombre={boxeador.categoriaNombre} />
            <EstadoChip estado={boxeador.estadoDeportivo} />
            {boxeador.gimnasioNombre && (
              <Typography variant="body2" color="text.secondary">
                {boxeador.gimnasioNombre}
              </Typography>
            )}
            {boxeador.regionNombre && (
              <Typography variant="body2" color="text.secondary">
                · {boxeador.regionNombre}
              </Typography>
            )}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {boxeador.edad} años · RUT {boxeador.rut} · {boxeador.sexo === 'M' ? 'Masculino' : 'Femenino'}
          </Typography>
        </Stack>

        {esPropio && (
          <Button variant="outlined" onClick={() => setEditOpen(true)}>
            Editar perfil
          </Button>
        )}
      </Stack>

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

      {esPropio && (
        <EditarPerfilDialog boxeador={boxeador} open={editOpen} onClose={() => setEditOpen(false)} />
      )}
    </Stack>
  )
}
