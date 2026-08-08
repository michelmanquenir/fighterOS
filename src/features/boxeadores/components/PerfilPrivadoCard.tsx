import LockIcon from '@mui/icons-material/Lock'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { CardHeading } from './CardHeading'

export function PerfilPrivadoCard({ nombre }: { nombre: string }) {
  return (
    <Card>
      <CardContent>
        <CardHeading>Información del boxeador</CardHeading>
        <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center', py: 5 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LockIcon sx={{ fontSize: 28, color: 'text.secondary' }} />
          </Box>
          <Typography variant="h5">Este perfil es privado.</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380 }}>
            Sigue a {nombre} para acceder a más información sobre su trayectoria deportiva cuando tu
            solicitud sea aceptada.
          </Typography>
          <Tooltip title="Función en desarrollo">
            <span>
              <Button variant="contained" startIcon={<PersonAddAlt1Icon />} disabled>
                Seguir
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  )
}
