import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { aceptarSolicitud, listarSolicitudes, rechazarSolicitud } from '../../../api/seguidores'
import { CardHeading } from './CardHeading'

export function SolicitudesSeguimientoCard() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['seguidores', 'solicitudes'],
    queryFn: listarSolicitudes,
  })

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ['seguidores', 'solicitudes'] })

  const aceptarMutation = useMutation({
    mutationFn: aceptarSolicitud,
    onSuccess: invalidar,
  })
  const rechazarMutation = useMutation({
    mutationFn: rechazarSolicitud,
    onSuccess: invalidar,
  })

  if (!query.data || query.data.length === 0) return null

  return (
    <Card>
      <CardContent>
        <CardHeading>Solicitudes de seguimiento</CardHeading>
        <List disablePadding>
          {query.data.map((solicitud) => (
            <ListItem
              key={solicitud.seguidorId}
              divider
              sx={{ px: 0 }}
              secondaryAction={
                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    size="small"
                    color="secondary"
                    disabled={aceptarMutation.isPending || rechazarMutation.isPending}
                    onClick={() => aceptarMutation.mutate(solicitud.seguidorId)}
                    aria-label="Aceptar"
                  >
                    <CheckIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    disabled={aceptarMutation.isPending || rechazarMutation.isPending}
                    onClick={() => rechazarMutation.mutate(solicitud.seguidorId)}
                    aria-label="Rechazar"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Avatar src={solicitud.seguidorAvatarUrl ?? undefined}>
                  {solicitud.seguidorNombre.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={solicitud.seguidorNombre} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}
