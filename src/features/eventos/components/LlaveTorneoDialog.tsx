import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { extraerMensajeError } from '../../../api/errors'
import { eliminarPelea, listarPeleas, pactarPelea } from '../../../api/eventos'
import type { EventoInscripcionResponse, EventoPeleaResponse, EventoTorneoResponse } from '../../../api/types'

interface Props {
  eventoId: string
  torneo: EventoTorneoResponse
  inscritosDelTorneo: EventoInscripcionResponse[]
  open: boolean
  onClose: () => void
}

function FighterRow({
  nombre,
  fotoUrl,
}: {
  nombre: string
  fotoUrl: string | null
}) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', px: 1.25, py: 1 }}>
      <Avatar src={fotoUrl ?? undefined} sx={{ width: 26, height: 26, fontSize: '0.8rem' }}>
        {nombre.charAt(0)}
      </Avatar>
      <Typography
        variant="body2"
        sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {nombre}
      </Typography>
    </Stack>
  )
}

function MatchCard({
  pelea,
  puedeEliminar,
  onEliminar,
}: {
  pelea: EventoPeleaResponse
  puedeEliminar: boolean
  onEliminar: () => void
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        width: 220,
        borderRadius: 1.5,
        overflow: 'hidden',
        position: 'relative',
        bgcolor: 'background.paper',
        '&:hover .eliminar-cruce': { opacity: 1 },
      }}
    >
      <FighterRow nombre={pelea.boxeadorANombre} fotoUrl={pelea.boxeadorAFotoUrl} />
      <Divider />
      <FighterRow nombre={pelea.boxeadorBNombre} fotoUrl={pelea.boxeadorBFotoUrl} />
      {puedeEliminar && (
        <IconButton
          className="eliminar-cruce"
          size="small"
          onClick={onEliminar}
          aria-label="Eliminar cruce"
          sx={{
            position: 'absolute',
            top: 2,
            right: 2,
            opacity: 0,
            transition: 'opacity 0.15s',
            bgcolor: 'background.default',
            '&:hover': { bgcolor: 'background.default' },
          }}
        >
          <CloseIcon sx={{ fontSize: 14 }} />
        </IconButton>
      )}
    </Paper>
  )
}

export function LlaveTorneoDialog({ eventoId, torneo, inscritosDelTorneo, open, onClose }: Props) {
  const [ronda, setRonda] = useState(1)
  const [aId, setAId] = useState('')
  const [bId, setBId] = useState('')
  const queryClient = useQueryClient()

  const peleasQuery = useQuery({
    queryKey: ['eventos', eventoId, 'peleas'],
    queryFn: () => listarPeleas(eventoId),
    enabled: open,
  })

  const peleasDelTorneo = (peleasQuery.data ?? []).filter((p) => p.torneoId === torneo.id)
  const rondas = Array.from(new Set([1, ...peleasDelTorneo.map((p) => p.ronda)])).sort((a, b) => a - b)
  const ultimaRonda = rondas[rondas.length - 1]

  const pactarMutation = useMutation({
    mutationFn: () => pactarPelea(eventoId, { boxeadorAId: aId, boxeadorBId: bId, torneoId: torneo.id, ronda }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos', eventoId, 'peleas'] })
      setAId('')
      setBId('')
    },
  })

  const eliminarMutation = useMutation({
    mutationFn: (peleaId: string) => eliminarPelea(eventoId, peleaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos', eventoId, 'peleas'] })
    },
  })

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <EmojiEventsIcon color="secondary" />
        {torneo.nombre}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Agregar cruce</Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 6, sm: 2 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Ronda"
                  value={ronda}
                  onChange={(e) => setRonda(Number(e.target.value))}
                >
                  {Array.from(new Set([...rondas, Math.max(...rondas, 0) + 1])).map((r) => (
                    <MenuItem key={r} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 5 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Peleador A"
                  value={aId}
                  onChange={(e) => setAId(e.target.value)}
                >
                  <MenuItem value="">Selecciona</MenuItem>
                  {inscritosDelTorneo.map((i) => (
                    <MenuItem key={i.boxeadorId} value={i.boxeadorId} disabled={i.boxeadorId === bId}>
                      {i.boxeadorNombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 5 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Peleador B"
                  value={bId}
                  onChange={(e) => setBId(e.target.value)}
                >
                  <MenuItem value="">Selecciona</MenuItem>
                  {inscritosDelTorneo.map((i) => (
                    <MenuItem key={i.boxeadorId} value={i.boxeadorId} disabled={i.boxeadorId === aId}>
                      {i.boxeadorNombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              disabled={!aId || !bId || aId === bId || pactarMutation.isPending}
              onClick={() => pactarMutation.mutate()}
              sx={{ alignSelf: 'flex-start' }}
            >
              {pactarMutation.isPending ? 'Agregando...' : 'Agregar cruce'}
            </Button>
            {pactarMutation.isError && (
              <Alert severity="error">{extraerMensajeError(pactarMutation.error, 'No se pudo agregar el cruce.')}</Alert>
            )}
          </Stack>

          {peleasDelTorneo.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Todavía no hay cruces pactados para este torneo.
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'stretch',
                gap: 5,
                overflowX: 'auto',
                pb: 1,
              }}
            >
              {rondas.map((r) => {
                const cruces = peleasDelTorneo.filter((p) => p.ronda === r)
                const esFinal = r === ultimaRonda && rondas.length > 1
                return (
                  <Stack key={r} sx={{ minWidth: 220 }}>
                    <Typography
                      variant="overline"
                      color={esFinal ? 'secondary.main' : 'text.secondary'}
                      sx={{ textAlign: 'center', mb: 2, fontWeight: 700 }}
                    >
                      {esFinal ? 'Final' : `Ronda ${r}`}
                    </Typography>
                    <Box
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 4,
                      }}
                    >
                      {cruces.length === 0 ? (
                        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                          Sin cruces todavía
                        </Typography>
                      ) : (
                        cruces.map((pelea) => (
                          <MatchCard
                            key={pelea.id}
                            pelea={pelea}
                            puedeEliminar={!eliminarMutation.isPending}
                            onEliminar={() => eliminarMutation.mutate(pelea.id)}
                          />
                        ))
                      )}
                    </Box>
                  </Stack>
                )
              })}
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
