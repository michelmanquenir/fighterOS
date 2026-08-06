import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GroupsIcon from '@mui/icons-material/Groups'
import HandshakeIcon from '@mui/icons-material/Handshake'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import { Section } from './Section'

const PASOS = [
  { icon: PersonAddIcon, titulo: 'Registra tu perfil', descripcion: 'Crea tu identidad deportiva oficial.' },
  { icon: HandshakeIcon, titulo: 'Conecta', descripcion: 'Con gimnasios, entrenadores y organizadores.' },
  { icon: GroupsIcon, titulo: 'Compite', descripcion: 'Participa en eventos en todo el país.' },
  { icon: EmojiEventsIcon, titulo: 'Construye tu historia', descripcion: 'Cada combate cuenta, cada logro queda.' },
]

export function JoinCtaSection() {
  return (
    <Section sx={{ py: { xs: 6, md: 8 } }}>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={4}
        sx={{ alignItems: { lg: 'center' }, justifyContent: 'space-between' }}
      >
        <Stack spacing={1}>
          <Typography variant="h3" color="primary">
            Únete a Fighteros
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
            Sé parte de la comunidad que impulsa y conecta el deporte de combate amateur.
          </Typography>
        </Stack>

        <Grid container spacing={3} sx={{ flex: 1, maxWidth: 640 }}>
          {PASOS.map(({ icon: Icon, titulo, descripcion }) => (
            <Grid key={titulo} size={{ xs: 6, sm: 3 }}>
              <Stack spacing={1}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    bgcolor: 'rgba(214,40,40,0.12)',
                    color: 'primary.main',
                  }}
                >
                  <Icon fontSize="small" />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {titulo}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {descripcion}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Stack spacing={1} sx={{ alignItems: { xs: 'stretch', lg: 'flex-end' } }}>
          <Button component={RouterLink} to="/registro" variant="contained" color="primary" size="large">
            Registrarse ahora
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: { lg: 'right' } }}>
            ¿Ya tengo cuenta?{' '}
            <Typography component={RouterLink} to="/login" variant="caption" color="primary" sx={{ fontWeight: 700 }}>
              Entrar
            </Typography>
          </Typography>
        </Stack>
      </Stack>
    </Section>
  )
}
