import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
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
import type { EventoInscripcionResponse, EventoTorneoResponse } from '../../../api/types'

interface Props {
  eventoId: string
  torneo: EventoTorneoResponse
  inscritosDelTorneo: EventoInscripcionResponse[]
  open: boolean
  onClose: () => void
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Llave: {torneo.nombre}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Agregar cruce</Typography>
            <Grid container spacing={1.5}>
              <Grid size={3}>
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
              <Grid size={4.5}>
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
              <Grid size={4.5}>
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

          <Stack spacing={2.5}>
            {rondas.map((r) => {
              const cruces = peleasDelTorneo.filter((p) => p.ronda === r)
              if (cruces.length === 0) return null
              return (
                <Stack key={r} spacing={1}>
                  <Typography variant="overline" color="text.secondary">
                    Ronda {r}
                  </Typography>
                  <Stack spacing={1}>
                    {cruces.map((pelea) => (
                      <Paper
                        key={pelea.id}
                        variant="outlined"
                        sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}
                      >
                        <Avatar src={pelea.boxeadorAFotoUrl ?? undefined} sx={{ width: 32, height: 32 }}>
                          {pelea.boxeadorANombre.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 700, flexGrow: 1 }}>
                          {pelea.boxeadorANombre}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          vs
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, flexGrow: 1, textAlign: 'right' }}>
                          {pelea.boxeadorBNombre}
                        </Typography>
                        <Avatar src={pelea.boxeadorBFotoUrl ?? undefined} sx={{ width: 32, height: 32 }}>
                          {pelea.boxeadorBNombre.charAt(0)}
                        </Avatar>
                        <IconButton
                          size="small"
                          disabled={eliminarMutation.isPending}
                          onClick={() => eliminarMutation.mutate(pelea.id)}
                          aria-label="Eliminar cruce"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Paper>
                    ))}
                  </Stack>
                </Stack>
              )
            })}
            {peleasDelTorneo.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Todavía no hay cruces pactados para este torneo.
              </Typography>
            )}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
