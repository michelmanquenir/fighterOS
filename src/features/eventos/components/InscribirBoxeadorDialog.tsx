import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Autocomplete from '@mui/material/Autocomplete'
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
import { inscribirBoxeador, listarTorneos } from '../../../api/eventos'
import { obtenerMisGimnasios } from '../../../api/gimnasios'
import type { BoxeadorResumenResponse } from '../../../api/types'

function useDebounced<T>(valor: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(valor)
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(valor), delayMs)
    return () => clearTimeout(timeout)
  }, [valor, delayMs])
  return debounced
}

// Filtro por nombre, siempre aplicado en el cliente encima de lo que
// haya devuelto el servidor - así lo que se ve nunca queda más ancho
// que lo que escribiste, sin importar qué tan al día esté la búsqueda
// del servidor.
function filtrarPorNombre(opciones: BoxeadorResumenResponse[], texto: string): BoxeadorResumenResponse[] {
  const buscado = texto.trim().toLowerCase()
  if (!buscado) return opciones
  return opciones.filter((o) => o.nombre.toLowerCase().includes(buscado))
}

interface Props {
  eventoId: string
  esOrganizador: boolean
  open: boolean
  onClose: () => void
}

export function InscribirBoxeadorDialog({ eventoId, esOrganizador, open, onClose }: Props) {
  const [gimnasioId, setGimnasioId] = useState('')
  const [boxeador, setBoxeador] = useState<BoxeadorResumenResponse | null>(null)
  const [torneoId, setTorneoId] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const busquedaDebounced = useDebounced(busqueda, 300)
  const queryClient = useQueryClient()

  const torneosQuery = useQuery({
    queryKey: ['eventos', eventoId, 'torneos'],
    queryFn: () => listarTorneos(eventoId),
    enabled: open,
  })

  const gimnasiosQuery = useQuery({
    queryKey: ['gimnasios', 'mios'],
    queryFn: obtenerMisGimnasios,
    enabled: open && !esOrganizador,
  })
  const gimnasioSeleccionado =
    gimnasioId || (gimnasiosQuery.data?.length === 1 ? gimnasiosQuery.data[0].id : '')

  const boxeadoresDeMiGimnasioQuery = useQuery({
    queryKey: ['boxeadores', 'gimnasio', gimnasioSeleccionado],
    queryFn: () => listarBoxeadores({ gimnasioId: gimnasioSeleccionado }, 0),
    enabled: open && !esOrganizador && !!gimnasioSeleccionado,
  })

  const busquedaGlobalQuery = useQuery({
    queryKey: ['boxeadores', 'buscar', busquedaDebounced],
    queryFn: () => listarBoxeadores({ q: busquedaDebounced }, 0),
    enabled: open && esOrganizador && busquedaDebounced.trim().length >= 2,
  })

  const opciones = esOrganizador
    ? (busquedaGlobalQuery.data?.content ?? [])
    : (boxeadoresDeMiGimnasioQuery.data?.content ?? [])

  const mutation = useMutation({
    mutationFn: () =>
      inscribirBoxeador(eventoId, { boxeadorId: boxeador!.id, torneoId: torneoId || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos', eventoId, 'inscripciones'] })
      queryClient.invalidateQueries({ queryKey: ['eventos', eventoId, 'torneos'] })
      setBoxeador(null)
      setBusqueda('')
      setTorneoId('')
      onClose()
    },
  })

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Inscribir peleador</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {esOrganizador && (
            <Typography variant="body2" color="text.secondary">
              Eres el organizador: puedes inscribir boxeadores de cualquier gimnasio.
            </Typography>
          )}

          {!esOrganizador && gimnasiosQuery.data && gimnasiosQuery.data.length > 1 && (
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
            options={opciones}
            value={boxeador}
            onChange={(_event, value) => setBoxeador(value)}
            inputValue={busqueda}
            onInputChange={(_event, value) => setBusqueda(value)}
            filterOptions={(opts, state) => filtrarPorNombre(opts, state.inputValue)}
            getOptionLabel={(option) => option.nombre}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={!esOrganizador && !gimnasioSeleccionado}
            loading={esOrganizador && busquedaGlobalQuery.isFetching}
            noOptionsText={
              esOrganizador && busquedaDebounced.trim().length < 2
                ? 'Escribe al menos 2 letras'
                : 'Sin resultados'
            }
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <Stack spacing={0}>
                  <span>
                    {option.nombre} {option.categoriaNombre ? `(${option.categoriaNombre})` : ''}
                  </span>
                  {esOrganizador && option.gimnasioNombre && (
                    <Typography variant="caption" color="text.secondary">
                      {option.gimnasioNombre}
                    </Typography>
                  )}
                </Stack>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Boxeador"
                placeholder="Busca por nombre"
                helperText={
                  !esOrganizador &&
                  gimnasioSeleccionado &&
                  boxeadoresDeMiGimnasioQuery.data?.content.length === 0
                    ? 'Este gimnasio no tiene boxeadores registrados'
                    : undefined
                }
              />
            )}
          />

          {torneosQuery.data && torneosQuery.data.length > 0 && (
            <TextField select fullWidth label="Torneo (opcional)" value={torneoId} onChange={(e) => setTorneoId(e.target.value)}>
              <MenuItem value="">Sin asignar todavía</MenuItem>
              {torneosQuery.data.map((torneo) => (
                <MenuItem key={torneo.id} value={torneo.id}>
                  {torneo.nombre}
                </MenuItem>
              ))}
            </TextField>
          )}

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
