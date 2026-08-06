import SportsMmaIcon from '@mui/icons-material/SportsMma'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'

export function Footer() {
  const anio = new Date().getFullYear()

  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 8 }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={6} sx={{ justifyContent: 'space-between' }}>
          <Stack spacing={1.5} sx={{ maxWidth: 360 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <SportsMmaIcon color="primary" />
              <Typography variant="h6">Fighteros</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              La comunidad del deporte de combate amateur. Unimos a deportistas, entrenadores,
              gimnasios y organizadores en un solo lugar.
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="overline" color="text.secondary">
              Navegación
            </Typography>
            <Stack spacing={1}>
              <Typography component={RouterLink} to="/eventos" variant="body2" sx={{ color: 'text.primary', textDecoration: 'none' }}>
                Eventos
              </Typography>
              <Typography component={RouterLink} to="/boxeadores" variant="body2" sx={{ color: 'text.primary', textDecoration: 'none' }}>
                Boxeadores
              </Typography>
              <Typography component={RouterLink} to="/registro" variant="body2" sx={{ color: 'text.primary', textDecoration: 'none' }}>
                Registrarse
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Typography variant="caption" color="text.secondary">
          © {anio} Fighteros. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  )
}
