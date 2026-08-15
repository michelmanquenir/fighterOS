import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import { listarMisSeguidores, listarMisSeguidos } from '../../../api/seguidores'

interface Props {
  tipo: 'seguidores' | 'seguidos'
  open: boolean
  onClose: () => void
}

export function SeguidoresListDialog({ tipo, open, onClose }: Props) {
  const query = useQuery({
    queryKey: ['seguidores', tipo === 'seguidores' ? 'mis-seguidores' : 'mis-seguidos'],
    queryFn: tipo === 'seguidores' ? listarMisSeguidores : listarMisSeguidos,
    enabled: open,
  })

  const personas = query.data ?? []

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{tipo === 'seguidores' ? 'Seguidores' : 'Seguidos'}</DialogTitle>
      <DialogContent>
        {personas.length === 0 ? (
          <Typography color="text.secondary" variant="body2" sx={{ py: 2 }}>
            {tipo === 'seguidores' ? 'Todavía no tienes seguidores.' : 'Todavía no sigues a nadie.'}
          </Typography>
        ) : (
          <List disablePadding>
            {personas.map((persona) => (
              <ListItem
                key={persona.usuarioId}
                divider
                sx={{ px: 0 }}
                component={persona.esBoxeador ? RouterLink : 'div'}
                to={persona.esBoxeador ? `/boxeadores/${persona.usuarioId}` : undefined}
                onClick={persona.esBoxeador ? onClose : undefined}
              >
                <ListItemAvatar>
                  <Avatar src={persona.avatarUrl ?? undefined}>{persona.nombre.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={persona.nombre} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  )
}
