import { useEffect, useState } from 'react'
import MailIcon from '@mui/icons-material/Mail'
import Alert from '@mui/material/Alert'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { buscarGimnasios } from '../../../api/gimnasios'
import { invitarGimnasio, listarInvitacionesDelEvento } from '../../../api/invitaciones'
import { extraerMensajeError } from '../../../api/errors'
import type { EstadoSolicitudEnum, GimnasioResumenResponse } from '../../../api/types'

function useDebounced<T>(valor: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(valor)
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(valor), delayMs)
    return () => clearTimeout(timeout)
  }, [valor, delayMs])
  return debounced
}

// Filtro por nombre siempre aplicado en el cliente encima de lo que haya
// devuelto el servidor - evita mostrar resultados de una búsqueda anterior
// mientras el debounce todavía no alcanza al texto actual.
function filtrarPorNombre(opciones: GimnasioResumenResponse[], texto: string): GimnasioResumenResponse[] {
  const buscado = texto.trim().toLowerCase()
  if (!buscado) return opciones
  return opciones.filter((o) => o.nombre.toLowerCase().includes(buscado))
}

const ESTADO_COLOR: Record<EstadoSolicitudEnum, 'warning' | 'success' | 'error' | 'default'> = {
  pendiente: 'warning',
  aceptada: 'success',
  rechazada: 'error',
  cancelada: 'default',
}

const ESTADO_LABEL: Record<EstadoSolicitudEnum, string> = {
  pendiente: 'Pendiente',
  aceptada: 'Aceptada',
  rechazada: 'Rechazada',
  cancelada: 'Cancelada',
}

export function InvitacionesEventoCard({ eventoId }: { eventoId: string }) {
  const [busqueda, setBusqueda] = useState('')
  const [gimnasio, setGimnasio] = useState<GimnasioResumenResponse | null>(null)
  const busquedaDebounced = useDebounced(busqueda, 300)
  const queryClient = useQueryClient()

  const invitacionesQuery = useQuery({
    queryKey: ['eventos', eventoId, 'invitaciones'],
    queryFn: () => listarInvitacionesDelEvento(eventoId),
  })

  const gimnasiosQuery = useQuery({
    queryKey: ['gimnasios', 'buscar', busquedaDebounced],
    queryFn: () => buscarGimnasios(busquedaDebounced),
    enabled: busquedaDebounced.trim().length >= 2,
  })

  const invitarMutation = useMutation({
    mutationFn: () => invitarGimnasio(eventoId, { gimnasioId: gimnasio!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos', eventoId, 'invitaciones'] })
      setGimnasio(null)
      setBusqueda('')
    },
  })

  const yaInvitados = new Set((invitacionesQuery.data ?? []).map((i) => i.gimnasioId))

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Invitaciones a gimnasios
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Este evento es de modalidad cerrada: solo los gimnasios que invites y acepten podrán inscribir peleadores.
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
          <Autocomplete
            sx={{ flexGrow: 1 }}
            options={gimnasiosQuery.data ?? []}
            value={gimnasio}
            onChange={(_event, value) => setGimnasio(value)}
            inputValue={busqueda}
            onInputChange={(_event, value) => setBusqueda(value)}
            getOptionLabel={(option) => option.nombre}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={(opts, state) => filtrarPorNombre(opts, state.inputValue)}
            loading={gimnasiosQuery.isFetching}
            getOptionDisabled={(option) => yaInvitados.has(option.id)}
            noOptionsText={busquedaDebounced.trim().length < 2 ? 'Escribe al menos 2 letras' : 'Sin resultados'}
            renderInput={(params) => (
              <TextField {...params} size="small" label="Buscar gimnasio" placeholder="Nombre del gimnasio" />
            )}
          />
          <Button
            variant="outlined"
            startIcon={<MailIcon />}
            disabled={!gimnasio || invitarMutation.isPending}
            onClick={() => invitarMutation.mutate()}
          >
            {invitarMutation.isPending ? 'Invitando...' : 'Invitar'}
          </Button>
        </Stack>
        {invitarMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {extraerMensajeError(invitarMutation.error, 'No se pudo invitar al gimnasio.')}
          </Alert>
        )}

        {invitacionesQuery.data && invitacionesQuery.data.length > 0 ? (
          <List disablePadding>
            {invitacionesQuery.data.map((invitacion) => (
              <ListItem key={invitacion.id} divider sx={{ px: 0 }}>
                <ListItemText primary={invitacion.gimnasioNombre} />
                <Chip
                  size="small"
                  label={ESTADO_LABEL[invitacion.estado]}
                  color={ESTADO_COLOR[invitacion.estado]}
                  variant="outlined"
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Todavía no has invitado a ningún gimnasio.
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
