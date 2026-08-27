import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listar as listarBoxeadores } from '../../../api/boxeadores'
import { extraerMensajeError } from '../../../api/errors'
import { agregarAlumno } from '../../../api/gimnasios'
import type { BoxeadorResumenResponse } from '../../../api/types'

function useDebounced<T>(valor: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(valor)
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(valor), delayMs)
    return () => clearTimeout(timeout)
  }, [valor, delayMs])
  return debounced
}

function filtrarPorNombre(opciones: BoxeadorResumenResponse[], texto: string): BoxeadorResumenResponse[] {
  const buscado = texto.trim().toLowerCase()
  if (!buscado) return opciones
  return opciones.filter((o) => o.nombre.toLowerCase().includes(buscado))
}

interface Props {
  gimnasioId: string
  alumnosActualesIds: string[]
  open: boolean
  onClose: () => void
}

export function AgregarAlumnoDialog({ gimnasioId, alumnosActualesIds, open, onClose }: Props) {
  const [boxeador, setBoxeador] = useState<BoxeadorResumenResponse | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const busquedaDebounced = useDebounced(busqueda, 300)
  const queryClient = useQueryClient()

  const busquedaQuery = useQuery({
    queryKey: ['boxeadores', 'buscar', busquedaDebounced],
    queryFn: () => listarBoxeadores({ q: busquedaDebounced }, 0),
    enabled: open && busquedaDebounced.trim().length >= 2,
  })

  const opciones = busquedaQuery.data?.content ?? []

  const mutation = useMutation({
    mutationFn: () => agregarAlumno(gimnasioId, boxeador!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boxeadores', 'gimnasio', gimnasioId] })
      setBoxeador(null)
      setBusqueda('')
      onClose()
    },
  })

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Agregar alumno</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Busca un boxeador ya registrado en la plataforma para asignarlo a tu gimnasio.
          </Typography>
          <Autocomplete
            options={opciones}
            value={boxeador}
            onChange={(_event, value) => setBoxeador(value)}
            inputValue={busqueda}
            onInputChange={(_event, value) => setBusqueda(value)}
            filterOptions={(opts, state) => filtrarPorNombre(opts, state.inputValue)}
            getOptionLabel={(option) => option.nombre}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionDisabled={(option) => alumnosActualesIds.includes(option.id)}
            loading={busquedaQuery.isFetching}
            noOptionsText={busquedaDebounced.trim().length < 2 ? 'Escribe al menos 2 letras' : 'Sin resultados'}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <Stack spacing={0}>
                  <span>
                    {option.nombre} {option.categoriaNombre ? `(${option.categoriaNombre})` : ''}
                  </span>
                  {option.gimnasioNombre && (
                    <Typography variant="caption" color="text.secondary">
                      Actualmente en {option.gimnasioNombre}
                    </Typography>
                  )}
                </Stack>
              </li>
            )}
            renderInput={(params) => <TextField {...params} label="Boxeador" placeholder="Busca por nombre" />}
          />
          {mutation.isError && (
            <Alert severity="error">{extraerMensajeError(mutation.error, 'No se pudo agregar al alumno.')}</Alert>
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
          {mutation.isPending ? 'Agregando...' : 'Agregar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
