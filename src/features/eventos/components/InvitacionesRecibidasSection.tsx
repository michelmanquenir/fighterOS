import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import { misInvitaciones, responderInvitacion } from '../../../api/invitaciones'

export function InvitacionesRecibidasSection() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['invitaciones', 'mias'],
    queryFn: misInvitaciones,
  })

  const responderMutation = useMutation({
    mutationFn: ({ id, aceptar }: { id: string; aceptar: boolean }) => responderInvitacion(id, aceptar),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitaciones', 'mias'] })
    },
  })

  const pendientes = (query.data ?? []).filter((i) => i.estado === 'pendiente')
  const respondidas = (query.data ?? []).filter((i) => i.estado !== 'pendiente')

  if (!query.data || query.data.length === 0) {
    return null
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Invitaciones a eventos
        </Typography>

        {pendientes.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No tienes invitaciones pendientes.
          </Typography>
        ) : (
          <List disablePadding>
            {pendientes.map((invitacion) => (
              <ListItem
                key={invitacion.id}
                divider
                sx={{ px: 0, flexWrap: 'wrap', gap: 1 }}
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      startIcon={<CheckIcon />}
                      disabled={responderMutation.isPending}
                      onClick={() => responderMutation.mutate({ id: invitacion.id, aceptar: true })}
                    >
                      Aceptar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<CloseIcon />}
                      disabled={responderMutation.isPending}
                      onClick={() => responderMutation.mutate({ id: invitacion.id, aceptar: false })}
                    >
                      Rechazar
                    </Button>
                  </Stack>
                }
              >
                <ListItemText
                  primary={
                    <Typography
                      component={RouterLink}
                      to={`/eventos/${invitacion.eventoId}`}
                      sx={{ color: 'text.primary', textDecoration: 'none', fontWeight: 700 }}
                    >
                      {invitacion.eventoNombre}
                    </Typography>
                  }
                  secondary={`Invitación para ${invitacion.gimnasioNombre}`}
                  sx={{ pr: { xs: 0, sm: 24 } }}
                />
              </ListItem>
            ))}
          </List>
        )}

        {respondidas.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {respondidas.map((invitacion) => (
              <Chip
                key={invitacion.id}
                size="small"
                variant="outlined"
                color={invitacion.estado === 'aceptada' ? 'success' : 'default'}
                label={`${invitacion.eventoNombre}: ${invitacion.estado === 'aceptada' ? 'aceptada' : 'rechazada'}`}
              />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}
