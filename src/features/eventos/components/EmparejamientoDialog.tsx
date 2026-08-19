import { useState } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HandshakeIcon from '@mui/icons-material/Handshake'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { comparar } from '../../../api/boxeadores'
import { extraerMensajeError } from '../../../api/errors'
import { pactarPelea } from '../../../api/eventos'
import type { EventoInscripcionResponse, NivelProgresionEnum } from '../../../api/types'

const NIVEL_LABEL: Record<NivelProgresionEnum, string> = {
  debutante: 'Debutante',
  novato: 'Novato',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
  elite_amateur: 'Élite amateur',
}

function colorPuntaje(puntaje: number): 'success' | 'warning' | 'error' {
  if (puntaje >= 70) return 'success'
  if (puntaje >= 40) return 'warning'
  return 'error'
}

function FactorRow({ label, detalle, puntaje }: { label: string; detalle: string; puntaje: number }) {
  return (
    <Stack spacing={0.5}>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {label}
        </Typography>
        <Typography variant="body2" color={`${colorPuntaje(puntaje)}.main`} sx={{ fontWeight: 700 }}>
          {puntaje}%
        </Typography>
      </Stack>
      <LinearProgress variant="determinate" value={puntaje} color={colorPuntaje(puntaje)} sx={{ height: 6 }} />
      <Typography variant="caption" color="text.secondary">
        {detalle}
      </Typography>
    </Stack>
  )
}

interface Props {
  eventoId: string
  inscritos: EventoInscripcionResponse[]
  open: boolean
  onClose: () => void
}

export function EmparejamientoDialog({ eventoId, inscritos, open, onClose }: Props) {
  const [aId, setAId] = useState('')
  const [bId, setBId] = useState('')
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['boxeadores', 'comparar', aId, bId],
    queryFn: () => comparar(aId, bId),
    enabled: open && !!aId && !!bId && aId !== bId,
  })

  const resultado = aId && bId && aId !== bId ? query.data : undefined

  const inscripcionA = inscritos.find((i) => i.boxeadorId === aId)
  const inscripcionB = inscritos.find((i) => i.boxeadorId === bId)
  const torneoComun =
    inscripcionA?.torneoId && inscripcionA.torneoId === inscripcionB?.torneoId ? inscripcionA.torneoId : undefined

  const pactarMutation = useMutation({
    mutationFn: () => pactarPelea(eventoId, { boxeadorAId: aId, boxeadorBId: bId, torneoId: torneoComun }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos', eventoId, 'peleas'] })
      setAId('')
      setBId('')
    },
  })

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Emparejamientos</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Elige dos peleadores inscritos para ver qué tan parejo es el combate.
          </Typography>

          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                select
                fullWidth
                label="Peleador 1"
                value={aId}
                onChange={(e) => {
                  setAId(e.target.value)
                  pactarMutation.reset()
                }}
              >
                <MenuItem value="">Selecciona</MenuItem>
                {inscritos.map((i) => (
                  <MenuItem key={i.boxeadorId} value={i.boxeadorId} disabled={i.boxeadorId === bId}>
                    {i.boxeadorNombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={6}>
              <TextField
                select
                fullWidth
                label="Peleador 2"
                value={bId}
                onChange={(e) => {
                  setBId(e.target.value)
                  pactarMutation.reset()
                }}
              >
                <MenuItem value="">Selecciona</MenuItem>
                {inscritos.map((i) => (
                  <MenuItem key={i.boxeadorId} value={i.boxeadorId} disabled={i.boxeadorId === aId}>
                    {i.boxeadorNombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {aId && bId && aId !== bId && query.isLoading && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {resultado && (
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <Stack sx={{ alignItems: 'center' }}>
                <Typography variant="h1" color={`${colorPuntaje(resultado.puntajeGeneral)}.main`}>
                  {resultado.puntajeGeneral}%
                </Typography>
                <Typography variant="overline" color="text.secondary">
                  Compatibilidad estimada
                </Typography>
              </Stack>

              <FactorRow
                label="Peso y categoría"
                puntaje={resultado.puntajePeso}
                detalle={`${resultado.pesoA ?? '—'} kg vs ${resultado.pesoB ?? '—'} kg${
                  resultado.mismaCategoria
                    ? ` · misma categoría (${resultado.categoriaANombre})`
                    : ` · categorías distintas (${resultado.categoriaANombre ?? 'sin categoría'} / ${resultado.categoriaBNombre ?? 'sin categoría'})`
                }`}
              />
              <FactorRow
                label="Experiencia"
                puntaje={resultado.puntajeExperiencia}
                detalle={`${resultado.peleasA} peleas registradas vs ${resultado.peleasB} peleas registradas`}
              />
              <FactorRow
                label="Nivel deportivo"
                puntaje={resultado.puntajeNivel}
                detalle={`${NIVEL_LABEL[resultado.nivelANombre]} vs ${NIVEL_LABEL[resultado.nivelBNombre]}`}
              />

              {pactarMutation.isSuccess ? (
                <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success">
                  Pelea pactada. Puedes seguir armando más cruces.
                </Alert>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<HandshakeIcon />}
                  disabled={pactarMutation.isPending}
                  onClick={() => pactarMutation.mutate()}
                >
                  {pactarMutation.isPending ? 'Pactando...' : 'Pactar pelea'}
                </Button>
              )}

              {pactarMutation.isError && (
                <Alert severity="error">
                  {extraerMensajeError(pactarMutation.error, 'No se pudo pactar la pelea.')}
                </Alert>
              )}
            </Stack>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
