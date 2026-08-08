import LockIcon from '@mui/icons-material/Lock'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
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
        </Stack>
      </CardContent>
    </Card>
  )
}
