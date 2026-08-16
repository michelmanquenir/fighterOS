import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import JoinFullIcon from '@mui/icons-material/JoinFull'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import {
  asignarTorneo,
  listarInscripciones,
  listarTorneos,
  retirarInscripcion,
} from '../../../api/eventos'
import { obtenerMisGimnasios } from '../../../api/gimnasios'
import type { EventoInscripcionResponse, EventoTorneoResponse } from '../../../api/types'
import { useAuth } from '../../../auth/useAuth'
import { EmparejamientoDialog } from './EmparejamientoDialog'
import { InscribirBoxeadorDialog } from './InscribirBoxeadorDialog'

interface FilaProps {
  inscripcion: EventoInscripcionResponse
  torneos: EventoTorneoResponse[]
  puedeGestionar: boolean
  eventoId: string
}

function InscritoRow({ inscripcion, torneos, puedeGestionar, eventoId }: FilaProps) {
  const queryClient = useQueryClient()

  const asignarMutation = useMutation({
    mutationFn: (torneoId: string) => asignarTorneo(eventoId, inscripcion.boxeadorId, torneoId || null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos', eventoId, 'inscripciones'] })
      queryClient.invalidateQueries({ queryKey: ['eventos', eventoId, 'torneos'] })
    },
  })

  const retirarMutation = useMutation({
    mutationFn: () => retirarInscripcion(eventoId, inscripcion.boxeadorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos', eventoId, 'inscripciones'] })
      queryClient.invalidateQueries({ queryKey: ['eventos', eventoId, 'torneos'] })
    },
  })

  return (
    <ListItem
      divider
      sx={{ px: 0, alignItems: 'center', gap: 1, flexWrap: 'wrap' }}
      secondaryAction={
        puedeGestionar && (
          <IconButton
            edge="end"
            size="small"
            disabled={retirarMutation.isPending}
            onClick={() => retirarMutation.mutate()}
            aria-label="Retirar inscripción"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )
      }
    >
      <ListItemAvatar>
        <Avatar component={RouterLink} to={`/boxeadores/${inscripcion.boxeadorId}`} src={inscripcion.boxeadorFotoUrl ?? undefined}>
          {inscripcion.boxeadorNombre.charAt(0)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        sx={{ flexBasis: 200 }}
        primary={
          <Typography
            component={RouterLink}
            to={`/boxeadores/${inscripcion.boxeadorId}`}
            sx={{ color: 'text.primary', textDecoration: 'none', fontWeight: 700 }}
          >
            {inscripcion.boxeadorNombre}
          </Typography>
        }
        secondary={[inscripcion.categoriaNombre, inscripcion.gimnasioNombre].filter(Boolean).join(' · ')}
      />
      {puedeGestionar && torneos.length > 0 && (
        <TextField
          select
          size="small"
          label="Torneo"
          value={inscripcion.torneoId ?? ''}
          onChange={(e) => asignarMutation.mutate(e.target.value)}
          disabled={asignarMutation.isPending}
          sx={{ minWidth: 180, mr: { xs: 0, sm: 5 } }}
        >
          <MenuItem value="">Sin asignar</MenuItem>
          {torneos.map((torneo) => (
            <MenuItem key={torneo.id} value={torneo.id}>
              {torneo.nombre}
            </MenuItem>
          ))}
        </TextField>
      )}
    </ListItem>
  )
}

interface Props {
  eventoId: string
  esOrganizador: boolean
}

export function InscripcionesEventoCard({ eventoId, esOrganizador }: Props) {
  const { auth } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [emparejamientoOpen, setEmparejamientoOpen] = useState(false)

  const inscripcionesQuery = useQuery({
    queryKey: ['eventos', eventoId, 'inscripciones'],
    queryFn: () => listarInscripciones(eventoId),
  })
  const torneosQuery = useQuery({
    queryKey: ['eventos', eventoId, 'torneos'],
    queryFn: () => listarTorneos(eventoId),
  })
  const misGimnasiosQuery = useQuery({
    queryKey: ['gimnasios', 'mios'],
    queryFn: obtenerMisGimnasios,
    enabled: !!auth,
  })
  const misGimnasioIds = new Set(misGimnasiosQuery.data?.map((g) => g.id))

  const inscripciones = inscripcionesQuery.data ?? []
  const torneos = torneosQuery.data ?? []

  const grupos: Array<{ id: string; nombre: string; items: EventoInscripcionResponse[] }> = [
    ...torneos.map((t) => ({
      id: t.id,
      nombre: t.nombre,
      items: inscripciones.filter((i) => i.torneoId === t.id),
    })),
    {
      id: 'sin-torneo',
      nombre: torneos.length > 0 ? 'Sin torneo asignado' : 'Todos',
      items: inscripciones.filter((i) => i.torneoId === null),
    },
  ].filter((g) => g.items.length > 0)

  return (
    <Card>
      <CardContent>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h5">Peleadores inscritos</Typography>
          <Stack direction="row" spacing={1}>
            {esOrganizador && inscripciones.length >= 2 && (
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                startIcon={<JoinFullIcon />}
                onClick={() => setEmparejamientoOpen(true)}
              >
                Emparejamientos
              </Button>
            )}
            {((misGimnasiosQuery.data && misGimnasiosQuery.data.length > 0) || esOrganizador) && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<PersonAddAlt1Icon />}
                onClick={() => setDialogOpen(true)}
              >
                Inscribir peleador
              </Button>
            )}
          </Stack>
        </Stack>

        {inscripciones.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            Todavía no hay peleadores inscritos en este evento.
          </Typography>
        ) : (
          <Stack spacing={3}>
            {grupos.map((grupo) => (
              <Stack key={grupo.id} spacing={1}>
                {torneos.length > 0 && (
                  <Typography variant="overline" color="text.secondary">
                    {grupo.nombre}
                  </Typography>
                )}
                <List disablePadding>
                  {grupo.items.map((inscripcion) => (
                    <InscritoRow
                      key={inscripcion.boxeadorId}
                      inscripcion={inscripcion}
                      torneos={torneos}
                      eventoId={eventoId}
                      puedeGestionar={esOrganizador || misGimnasioIds.has(inscripcion.gimnasioId)}
                    />
                  ))}
                </List>
              </Stack>
            ))}
          </Stack>
        )}
      </CardContent>

      <InscribirBoxeadorDialog
        eventoId={eventoId}
        esOrganizador={esOrganizador}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
      <EmparejamientoDialog
        inscritos={inscripciones}
        open={emparejamientoOpen}
        onClose={() => setEmparejamientoOpen(false)}
      />
    </Card>
  )
}
