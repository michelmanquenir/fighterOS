import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listarCategoriasPeso } from '../../../api/catalogos'
import { extraerMensajeError } from '../../../api/errors'
import { crearTorneo, eliminarTorneo, listarInscripciones, listarTorneos } from '../../../api/eventos'
import type { EventoTorneoResponse } from '../../../api/types'
import { LlaveTorneoDialog } from './LlaveTorneoDialog'

function CrearTorneoDialog({ eventoId, open, onClose }: { eventoId: string; open: boolean; onClose: () => void }) {
  const [nombre, setNombre] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const queryClient = useQueryClient()
  const categoriasQuery = useQuery({ queryKey: ['catalogos', 'categorias-peso'], queryFn: listarCategoriasPeso })

  const mutation = useMutation({
    mutationFn: () => crearTorneo(eventoId, { nombre, categoriaId: categoriaId || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos', eventoId, 'torneos'] })
      setNombre('')
      setCategoriaId('')
      onClose()
    },
  })

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Crear torneo</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Nombre"
            placeholder="Ej: Torneo 1 - Pluma Amateur"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <TextField
            select
            fullWidth
            label="Categoría de peso"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
          >
            <MenuItem value="">Sin categoría</MenuItem>
            {categoriasQuery.data?.map((categoria) => (
              <MenuItem key={categoria.id} value={categoria.id}>
                {categoria.nombre} ({categoria.sexo})
              </MenuItem>
            ))}
          </TextField>
          {mutation.isError && (
            <Alert severity="error">{extraerMensajeError(mutation.error, 'No se pudo crear el torneo.')}</Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" disabled={!nombre || mutation.isPending} onClick={() => mutation.mutate()}>
          {mutation.isPending ? 'Creando...' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function TorneosEventoCard({ eventoId }: { eventoId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [torneoLlave, setTorneoLlave] = useState<EventoTorneoResponse | null>(null)
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['eventos', eventoId, 'torneos'],
    queryFn: () => listarTorneos(eventoId),
  })
  const inscripcionesQuery = useQuery({
    queryKey: ['eventos', eventoId, 'inscripciones'],
    queryFn: () => listarInscripciones(eventoId),
  })

  const eliminarMutation = useMutation({
    mutationFn: (torneoId: string) => eliminarTorneo(eventoId, torneoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos', eventoId, 'torneos'] })
      queryClient.invalidateQueries({ queryKey: ['eventos', eventoId, 'inscripciones'] })
    },
  })

  const torneos = query.data ?? []

  return (
    <Card>
      <CardContent>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">Torneos del evento</Typography>
          <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
            Crear torneo
          </Button>
        </Stack>

        {torneos.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            Todavía no has creado torneos para este evento.
          </Typography>
        ) : (
          <List disablePadding>
            {torneos.map((torneo) => (
              <ListItem
                key={torneo.id}
                divider
                sx={{ px: 0 }}
                secondaryAction={
                  <Stack direction="row" spacing={0.5}>
                    <IconButton size="small" onClick={() => setTorneoLlave(torneo)} aria-label="Ver llave">
                      <AccountTreeIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      edge="end"
                      size="small"
                      disabled={eliminarMutation.isPending}
                      onClick={() => eliminarMutation.mutate(torneo.id)}
                      aria-label="Eliminar torneo"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'secondary.main' }}>
                  <EmojiEventsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={torneo.nombre}
                  secondary={[
                    torneo.categoriaNombre,
                    `${torneo.cantidadInscritos} ${torneo.cantidadInscritos === 1 ? 'inscrito' : 'inscritos'}`,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>

      <CrearTorneoDialog eventoId={eventoId} open={dialogOpen} onClose={() => setDialogOpen(false)} />

      {torneoLlave && (
        <LlaveTorneoDialog
          eventoId={eventoId}
          torneo={torneoLlave}
          inscritosDelTorneo={(inscripcionesQuery.data ?? []).filter((i) => i.torneoId === torneoLlave.id)}
          open={!!torneoLlave}
          onClose={() => setTorneoLlave(null)}
        />
      )}
    </Card>
  )
}
