import { useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import ChatIcon from '@mui/icons-material/Chat'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import LockIcon from '@mui/icons-material/Lock'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import PlaceIcon from '@mui/icons-material/Place'
import SportsIcon from '@mui/icons-material/Sports'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { dejarDeSeguir, obtenerEstado, seguir } from '../../../api/seguidores'
import type { BoxeadorPerfilResponse, EstadoDeportivoEnum } from '../../../api/types'
import { useAuth } from '../../../auth/useAuth'
import { FotoUploadButton } from './FotoUploadButton'

function IdConCopia({ id }: { id: string }) {
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    await navigator.clipboard.writeText(id)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 1500)
  }

  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
      >
        ID: {id}
      </Typography>
      <Tooltip title={copiado ? '¡Copiado!' : 'Copiar ID'}>
        <IconButton size="small" onClick={copiar} aria-label="Copiar ID del boxeador">
          <ContentCopyIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Tooltip>
    </Stack>
  )
}

const ESTADO_CONFIG: Record<EstadoDeportivoEnum, { label: string; dot: string }> = {
  activo: { label: 'Disponible para competir', dot: '#4CAF50' },
  lesionado: { label: 'Lesionado', dot: '#FF5252' },
  suspendido: { label: 'Suspendido', dot: '#F5A623' },
  retirado: { label: 'Retirado', dot: '#A1A1AA' },
}

interface PerfilHeroProps {
  boxeador: BoxeadorPerfilResponse
  esPropio: boolean
  pesoMax: number | null
  onEditar: () => void
}

function BotonSeguir({ boxeadorId }: { boxeadorId: string }) {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const estadoQuery = useQuery({
    queryKey: ['seguidores', boxeadorId, 'estado'],
    queryFn: () => obtenerEstado(boxeadorId),
    enabled: !!auth,
  })
  const estado = auth ? (estadoQuery.data?.estado ?? 'ninguno') : 'ninguno'

  const seguirMutation = useMutation({
    mutationFn: () => seguir(boxeadorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seguidores', boxeadorId, 'estado'] })
    },
  })
  const dejarDeSeguirMutation = useMutation({
    mutationFn: () => dejarDeSeguir(boxeadorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seguidores', boxeadorId, 'estado'] })
    },
  })

  function handleClick() {
    if (!auth) {
      navigate('/login')
      return
    }
    if (estado === 'ninguno') {
      seguirMutation.mutate()
    } else {
      dejarDeSeguirMutation.mutate()
    }
  }

  const cargando = estadoQuery.isLoading || seguirMutation.isPending || dejarDeSeguirMutation.isPending

  if (estado === 'aceptado') {
    return (
      <Button
        variant="outlined"
        color="secondary"
        startIcon={cargando ? <CircularProgress size={16} /> : <CheckIcon />}
        onClick={handleClick}
        disabled={cargando}
        fullWidth
      >
        Siguiendo
      </Button>
    )
  }
  if (estado === 'pendiente') {
    return (
      <Button
        variant="outlined"
        startIcon={cargando ? <CircularProgress size={16} /> : <HourglassEmptyIcon />}
        onClick={handleClick}
        disabled={cargando}
        fullWidth
      >
        Solicitud enviada
      </Button>
    )
  }
  return (
    <Button
      variant="contained"
      startIcon={cargando ? <CircularProgress size={16} color="inherit" /> : <PersonAddAlt1Icon />}
      onClick={handleClick}
      disabled={cargando}
      fullWidth
    >
      Seguir
    </Button>
  )
}

export function PerfilHero({ boxeador, esPropio, pesoMax, onEditar }: PerfilHeroProps) {
  const verPublico = esPropio || boxeador.perfilPublico
  const estado = ESTADO_CONFIG[boxeador.estadoDeportivo]

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        <Box
          sx={{
            width: { xs: '100%', md: 220 },
            height: 260,
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {boxeador.fotoUrl ? (
            <Box
              component="img"
              src={boxeador.fotoUrl}
              alt={boxeador.nombre}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <Stack sx={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h1" color="text.secondary">
                {boxeador.nombre.charAt(0)}
              </Typography>
            </Stack>
          )}
        </Box>
        {esPropio && (
          <Box sx={{ position: 'absolute', bottom: -8, right: -8 }}>
            <FotoUploadButton boxeadorId={boxeador.id} />
          </Box>
        )}
      </Box>

      <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
        <Typography variant="h1">{boxeador.nombre}</Typography>
        <IdConCopia id={boxeador.id} />

        <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', flexWrap: 'wrap' }}>
          {boxeador.pesoActual != null && (
            <Typography variant="h6" color="primary">
              {boxeador.pesoActual} KG
            </Typography>
          )}
          {boxeador.pesoActual != null && boxeador.categoriaNombre && (
            <Typography variant="h6" color="text.secondary">
              ·
            </Typography>
          )}
          {boxeador.categoriaNombre && <Typography variant="h6">{boxeador.categoriaNombre.toUpperCase()}</Typography>}
        </Stack>
        {pesoMax != null && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: '-8px !important' }}>
            Hasta {pesoMax} kg
          </Typography>
        )}

        {(boxeador.gimnasioNombre || boxeador.entrenadorNombre || boxeador.regionNombre) && (
          <Divider sx={{ maxWidth: 420 }} />
        )}

        <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
          {boxeador.gimnasioNombre && (
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <FitnessCenterIcon fontSize="small" color="action" />
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {boxeador.gimnasioNombre}
              </Typography>
            </Stack>
          )}
          {boxeador.entrenadorNombre && (
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <SportsIcon fontSize="small" color="action" />
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {boxeador.entrenadorNombre}
              </Typography>
            </Stack>
          )}
          {boxeador.regionNombre && (
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <PlaceIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {boxeador.regionNombre}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>

      <Stack spacing={1.5} sx={{ alignItems: { xs: 'stretch', md: 'flex-end' }, minWidth: { md: 220 } }}>
        {esPropio ? (
          <Button variant="outlined" onClick={onEditar}>
            Editar perfil
          </Button>
        ) : (
          <>
            {verPublico ? (
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}
              >
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: estado.dot }} />
                <Typography variant="overline" sx={{ color: estado.dot }}>
                  {estado.label}
                </Typography>
              </Stack>
            ) : (
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ alignItems: 'center', color: 'text.secondary', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}
              >
                <LockIcon sx={{ fontSize: 16 }} />
                <Typography variant="overline">Perfil privado</Typography>
              </Stack>
            )}

            <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
              <BotonSeguir boxeadorId={boxeador.id} />
              <Tooltip title="Función en desarrollo">
                <span>
                  <IconButton disabled sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <MoreHorizIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>

            {verPublico && boxeador.entrenadorNombre && (
              <Tooltip title="Función en desarrollo">
                <span>
                  <Button variant="contained" startIcon={<ChatIcon />} disabled>
                    Contactar entrenador
                  </Button>
                </span>
              </Tooltip>
            )}
          </>
        )}
      </Stack>
    </Stack>
  )
}
