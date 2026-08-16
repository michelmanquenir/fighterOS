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
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import { listarInscripciones, retirarInscripcion } from '../../../api/eventos'
import { obtenerMisGimnasios } from '../../../api/gimnasios'
import { useAuth } from '../../../auth/useAuth'
import { EmparejamientoDialog } from './EmparejamientoDialog'
import { InscribirBoxeadorDialog } from './InscribirBoxeadorDialog'

interface Props {
  eventoId: string
  esOrganizador: boolean
}

export function InscripcionesEventoCard({ eventoId, esOrganizador }: Props) {
  const { auth } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [emparejamientoOpen, setEmparejamientoOpen] = useState(false)
  const queryClient = useQueryClient()

  const inscripcionesQuery = useQuery({
    queryKey: ['eventos', eventoId, 'inscripciones'],
    queryFn: () => listarInscripciones(eventoId),
  })
  const misGimnasiosQuery = useQuery({
    queryKey: ['gimnasios', 'mios'],
    queryFn: obtenerMisGimnasios,
    enabled: !!auth,
  })
  const misGimnasioIds = new Set(misGimnasiosQuery.data?.map((g) => g.id))

  const retirarMutation = useMutation({
    mutationFn: (boxeadorId: string) => retirarInscripcion(eventoId, boxeadorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos', eventoId, 'inscripciones'] })
    },
  })

  const inscripciones = inscripcionesQuery.data ?? []

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
          <List disablePadding>
            {inscripciones.map((inscripcion) => (
              <ListItem
                key={inscripcion.boxeadorId}
                divider
                sx={{ px: 0 }}
                secondaryAction={
                  (esOrganizador || misGimnasioIds.has(inscripcion.gimnasioId)) && (
                    <IconButton
                      edge="end"
                      size="small"
                      disabled={retirarMutation.isPending}
                      onClick={() => retirarMutation.mutate(inscripcion.boxeadorId)}
                      aria-label="Retirar inscripción"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar
                    component={RouterLink}
                    to={`/boxeadores/${inscripcion.boxeadorId}`}
                    src={inscripcion.boxeadorFotoUrl ?? undefined}
                  >
                    {inscripcion.boxeadorNombre.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      component={RouterLink}
                      to={`/boxeadores/${inscripcion.boxeadorId}`}
                      sx={{ color: 'text.primary', textDecoration: 'none', fontWeight: 700 }}
                    >
                      {inscripcion.boxeadorNombre}
                    </Typography>
                  }
                  secondary={[inscripcion.categoriaNombre, inscripcion.gimnasioNombre]
                    .filter(Boolean)
                    .join(' · ')}
                />
              </ListItem>
            ))}
          </List>
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
