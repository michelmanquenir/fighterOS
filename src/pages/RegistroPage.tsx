import PersonIcon from '@mui/icons-material/Person'
import SportsMmaIcon from '@mui/icons-material/SportsMma'
import StorefrontIcon from '@mui/icons-material/Storefront'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

const OPCIONES = [
  {
    to: '/registro/espectador',
    icon: PersonIcon,
    titulo: 'Espectador',
    descripcion: 'Sigue eventos y boxeadores, sin perfil deportivo.',
  },
  {
    to: '/registro/boxeador',
    icon: SportsMmaIcon,
    titulo: 'Boxeador',
    descripcion: 'Crea tu identidad deportiva y tu perfil de peleador.',
  },
  {
    to: '/registro/gimnasio',
    icon: StorefrontIcon,
    titulo: 'Dueño de gimnasio',
    descripcion: 'Registra tu gimnasio y organiza tus propias veladas.',
  },
]

export function RegistroPage() {
  const navigate = useNavigate()

  return (
    <Stack spacing={3} sx={{ maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h1" sx={{ textAlign: 'center' }}>
        ¿Cómo quieres registrarte?
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {OPCIONES.map(({ to, icon: Icon, titulo, descripcion }) => (
          <Card key={to} sx={{ flex: 1 }}>
            <CardActionArea onClick={() => navigate(to)} sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box sx={{ mb: 1 }}>
                  <Icon color="primary" sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h5" gutterBottom>
                  {titulo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {descripcion}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}
