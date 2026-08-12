import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listar as listarBoxeadores } from '../../../api/boxeadores'
import { extraerMensajeError } from '../../../api/errors'
import { inscribirBoxeador } from '../../../api/eventos'
import { obtenerMisGimnasios } from '../../../api/gimnasios'

interface Props {
  eventoId: string
  open: boolean
  onClose: () => void
}

export function InscribirBoxeadorDialog({ eventoId, open, onClose }: Props) {
  const [gimnasioId, setGimnasioId] = useState('')
  const [boxeadorId, setBoxeadorId] = useState('')
  const queryClient = useQueryClient()

  const gimnasiosQuery = useQuery({
    queryKey: ['gimnasios', 'mios'],
    queryFn: obtenerMisGimnasios,
    enabled: open,
  })
  const gimnasioSeleccionado =
    gimnasioId || (gimnasiosQuery.data?.length === 1 ? gimnasiosQuery.data[0].id : '')

  const boxeadoresQuery = useQuery({
    queryKey: ['boxeadores', 'gimnasio', gimnasioSeleccionado],
    queryFn: () => listarBoxeadores({ gimnasioId: gimnasioSeleccionado }, 0),
    enabled: open && !!gimnasioSeleccionado,
  })

  const mutation = useMutation({
    mutationFn: () => inscribirBoxeador(eventoId, { boxeadorId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos', eventoId, 'inscripciones'] })
      setBoxeadorId('')
      onClose()
    },
  })

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Inscribir peleador</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {gimnasiosQuery.data && gimnasiosQuery.data.length > 1 && (
            <TextField
              select
              fullWidth
              label="Gimnasio"
              value={gimnasioId}
              onChange={(e) => {
                setGimnasioId(e.target.value)
                setBoxeadorId('')
              }}
            >
              <MenuItem value="">Selecciona un gimnasio</MenuItem>
              {gimnasiosQuery.data.map((gimnasio) => (
                <MenuItem key={gimnasio.id} value={gimnasio.id}>
                  {gimnasio.nombre}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            select
            fullWidth
            label="Boxeador"
            value={boxeadorId}
            onChange={(e) => setBoxeadorId(e.target.value)}
            disabled={!gimnasioSeleccionado}
            helperText={
              gimnasioSeleccionado && boxeadoresQuery.data?.content.length === 0
                ? 'Este gimnasio no tiene boxeadores registrados'
                : undefined
            }
          >
            <MenuItem value="">Selecciona un boxeador</MenuItem>
            {boxeadoresQuery.data?.content.map((boxeador) => (
              <MenuItem key={boxeador.id} value={boxeador.id}>
                {boxeador.nombre} {boxeador.categoriaNombre ? `(${boxeador.categoriaNombre})` : ''}
              </MenuItem>
            ))}
          </TextField>

          {mutation.isError && (
            <Alert severity="error">
              {extraerMensajeError(mutation.error, 'No se pudo inscribir al boxeador.')}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          disabled={!boxeadorId || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? 'Inscribiendo...' : 'Inscribir'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
