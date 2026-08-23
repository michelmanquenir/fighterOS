import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import AvatarGroup from '@mui/material/AvatarGroup'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import { registrarConfirmacionPelea } from '../../../api/eventos'
import { misPeleasPendientes } from '../../../api/peleas'

export function PeleasPendientesSection() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['peleas', 'mias-pendientes'],
    queryFn: misPeleasPendientes,
  })

  const responderMutation = useMutation({
    mutationFn: ({ eventoId, peleaId, aceptar }: { eventoId: string; peleaId: string; aceptar: boolean }) =>
      registrarConfirmacionPelea(eventoId, peleaId, aceptar),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['peleas', 'mias-pendientes'] })
    },
  })

  if (!query.data || query.data.length === 0) {
    return null
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Peleas por confirmar
        </Typography>
        <List disablePadding>
          {query.data.map((pelea) => (
            <ListItem
              key={pelea.peleaId}
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
                    onClick={() =>
                      responderMutation.mutate({ eventoId: pelea.eventoId, peleaId: pelea.peleaId, aceptar: true })
                    }
                  >
                    Confirmar
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<CloseIcon />}
                    disabled={responderMutation.isPending}
                    onClick={() =>
                      responderMutation.mutate({ eventoId: pelea.eventoId, peleaId: pelea.peleaId, aceptar: false })
                    }
                  >
                    Rechazar
                  </Button>
                </Stack>
              }
            >
              <ListItemAvatar>
                <AvatarGroup max={2} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: '0.8rem' } }}>
                  <Avatar src={pelea.boxeadorAFotoUrl ?? undefined}>{pelea.boxeadorANombre.charAt(0)}</Avatar>
                  <Avatar src={pelea.boxeadorBFotoUrl ?? undefined}>{pelea.boxeadorBNombre.charAt(0)}</Avatar>
                </AvatarGroup>
              </ListItemAvatar>
              <ListItemText
                sx={{ pr: { xs: 0, sm: 24 } }}
                primary={`${pelea.boxeadorANombre} vs ${pelea.boxeadorBNombre}`}
                slotProps={{ secondary: { component: 'div' } }}
                secondary={
                  <Typography
                    component={RouterLink}
                    to={`/eventos/${pelea.eventoId}`}
                    variant="body2"
                    sx={{ color: 'text.secondary' }}
                  >
                    {pelea.eventoNombre}
                    {pelea.categoriaNombre ? ` · ${pelea.categoriaNombre}` : ''}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}
