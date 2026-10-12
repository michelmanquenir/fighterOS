import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import SportsMmaIcon from '@mui/icons-material/SportsMma'
import YouTubeIcon from '@mui/icons-material/YouTube'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import { AccentBar } from '../features/landing/components/AccentBar'

const NAVEGACION = [
  { to: '/eventos', label: 'Eventos' },
  { to: '/rankings', label: 'Rankings' },
  { to: '/boxeadores', label: 'Peleadores' },
  { to: '/clubes', label: 'Clubes' },
  { to: '/entrenadores', label: 'Entrenadores' },
  { to: '/contenido-destacado', label: 'Contenido destacado' },
]

const SOPORTE = [
  { to: '/contacto', label: 'Contacto' },
  { to: '/ayuda', label: 'Ayuda' },
  { to: '/terminos', label: 'Términos de uso' },
  { to: '/privacidad', label: 'Privacidad' },
]

// TODO: reemplazar por las redes sociales reales de la página.
const REDES_SOCIALES = [
  { href: '#', label: 'Instagram', Icon: InstagramIcon },
  { href: '#', label: 'Facebook', Icon: FacebookIcon },
  { href: '#', label: 'YouTube', Icon: YouTubeIcon },
]

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <Typography
      component={RouterLink}
      to={to}
      variant="body2"
      sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
    >
      {label}
    </Typography>
  )
}

export function Footer() {
  const anio = new Date().getFullYear()

  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 8 }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <SportsMmaIcon color="primary" />
                <Typography variant="h6">Fighteros</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                La comunidad del boxeo chileno.
              </Typography>
              <AccentBar width={32} />
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="overline" color="text.secondary">
                Navegación
              </Typography>
              <Stack spacing={1}>
                {NAVEGACION.map((link) => (
                  <FooterLink key={link.to} {...link} />
                ))}
              </Stack>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="overline" color="text.secondary">
                Soporte
              </Typography>
              <Stack spacing={1}>
                {SOPORTE.map((link) => (
                  <FooterLink key={link.to} {...link} />
                ))}
              </Stack>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="overline" color="text.secondary">
                Síguenos
              </Typography>
              <Stack direction="row" spacing={0.5}>
                {REDES_SOCIALES.map(({ href, label, Icon }) => (
                  <IconButton key={label} component="a" href={href} target="_blank" rel="noopener" aria-label={label}>
                    <Icon fontSize="small" />
                  </IconButton>
                ))}
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Más que pelea
                <br />
                somos <Box component="span" sx={{ color: 'primary.main' }}>comunidad</Box>
              </Typography>
              <AccentBar width={32} />
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            © {anio} Fighteros. Todos los derechos reservados.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Hecho en Chile 🇨🇱 Para el boxeo chileno.
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}
