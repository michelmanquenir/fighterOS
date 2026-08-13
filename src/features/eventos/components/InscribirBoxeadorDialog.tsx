import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listar as listarBoxeadores } from '../../../api/boxeadores'
import { extraerMensajeError } from '../../../api/errors'
import { inscribirBoxeador } from '../../../api/eventos'
import { obtenerMisGimnasios } from '../../../api/gimnasios'
import type { BoxeadorResumenResponse } from '../../../api/types'

const filtrarBoxeadores = createFilterOptions<BoxeadorResumenResponse>({
  stringify: (option) => `${option.nombre} ${option.id}`,
})

interface Props {
  eventoId: string
  open: boolean
  onClose: () => void
}

export function InscribirBoxeadorDialog({ eventoId, open, onClose }: Props) {
  const [gimnasioId, setGimnasioId] = useState('')
  const [boxeador, setBoxeador] = useState<BoxeadorResumenResponse | null>(null)
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
    mutationFn: () => inscribirBoxeador(eventoId, { boxeadorId: boxeador!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos', eventoId, 'inscripciones'] })
      setBoxeador(null)
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
                setBoxeador(null)
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

          <Autocomplete
            options={boxeadoresQuery.data?.content ?? []}
            value={boxeador}
            onChange={(_event, value) => setBoxeador(value)}
            filterOptions={filtrarBoxeadores}
            getOptionLabel={(option) => option.nombre}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={!gimnasioSeleccionado}
            noOptionsText="Sin resultados"
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <Stack spacing={0}>
                  <span>
                    {option.nombre} {option.categoriaNombre ? `(${option.categoriaNombre})` : ''}
                  </span>
                  <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                    {option.id}
                  </Typography>
                </Stack>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Boxeador"
                placeholder="Busca por nombre o pega el ID"
                helperText={
                  gimnasioSeleccionado && boxeadoresQuery.data?.content.length === 0
                    ? 'Este gimnasio no tiene boxeadores registrados'
                    : undefined
                }
              />
            )}
          />

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
          disabled={!boxeador || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? 'Inscribiendo...' : 'Inscribir'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
