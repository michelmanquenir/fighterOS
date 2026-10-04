import { useState } from 'react'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LightModeIcon from '@mui/icons-material/LightMode'
import MenuIcon from '@mui/icons-material/Menu'
import SportsMmaIcon from '@mui/icons-material/SportsMma'
import XIcon from '@mui/icons-material/X'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { obtenerMe } from '../api/usuarios'
import { hasRole } from '../auth/roles'
import { useAuth } from '../auth/useAuth'
import { useColorMode } from '../theme/useColorMode'

const NAV_LINKS = [
  { to: '/rankings', label: 'Rankings' },
  { to: '/boxeadores', label: 'Peleadores' },
  { to: '/clubes', label: 'Clubes' },
  { to: '/entrenadores', label: 'Entrenadores' },
  { to: '/contenido-destacado', label: 'Contenido Destacado' },
]

// TODO: reemplazar por las redes sociales reales de la página.
const REDES_SOCIALES = [
  { href: '#', label: 'Instagram', Icon: InstagramIcon },
  { href: '#', label: 'Facebook', Icon: FacebookIcon },
  { href: '#', label: 'X', Icon: XIcon },
]

export function Header() {
  const { auth, logout } = useAuth()
  const { mode, toggleMode } = useColorMode()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const meQuery = useQuery({
    queryKey: ['usuarios', 'me'],
    queryFn: obtenerMe,
    enabled: !!auth,
  })

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/login')
  }

  function handleNavigate(to: string) {
    setMenuOpen(false)
    navigate(to)
  }

  const logo = (
    <Stack
      component={RouterLink}
      to="/"
      direction="row"
      spacing={1}
      sx={{ alignItems: 'center', textDecoration: 'none', color: 'text.primary' }}
    >
      <SportsMmaIcon color="primary" sx={{ fontSize: 30 }} />
      <Stack spacing={0}>
        <Typography variant="h5" sx={{ lineHeight: 1 }}>
          Fighteros
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: { xs: 'none', md: 'block' }, letterSpacing: '0.08em', fontSize: '0.6rem' }}
        >
          Tu comunidad. Tu historia. Tu legado.
        </Typography>
      </Stack>
    </Stack>
  )

  const redesSociales = (
    <Stack direction="row">
      {REDES_SOCIALES.map(({ href, label, Icon }) => (
        <Tooltip key={label} title={label}>
          <IconButton component="a" href={href} target="_blank" rel="noopener" size="small" aria-label={label}>
            <Icon fontSize="small" />
          </IconButton>
        </Tooltip>
      ))}
    </Stack>
  )

  return (
    <AppBar position="sticky" color="transparent" sx={{ top: 0 }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Izquierda: navegación (desktop) */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
          >
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.to
              return (
                <Button
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  color="inherit"
                  size="small"
                  sx={{
                    color: active ? 'primary.main' : 'text.primary',
                    fontWeight: 700,
                  }}
                >
                  {link.label}
                </Button>
              )
            })}
          </Stack>

          {/* Mobile: logo a la izquierda */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flex: 1 }}>{logo}</Box>

          {/* Centro: logo (desktop) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>{logo}</Box>

          {/* Derecha: redes sociales + sesión (desktop) */}
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'flex-end' }}
          >
            {redesSociales}
            <Divider orientation="vertical" flexItem sx={{ my: 1 }} />
            <Tooltip title={mode === 'dark' ? 'Tema claro' : 'Tema oscuro'}>
              <IconButton onClick={toggleMode} aria-label="Cambiar tema">
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            {auth ? (
              <>
                <Avatar src={meQuery.data?.avatarUrl ?? undefined} sx={{ width: 36, height: 36 }}>
                  {auth.nombre.charAt(0).toUpperCase()}
                </Avatar>
                {hasRole(auth, 'boxeador') && (
                  <Button component={RouterLink} to={`/boxeadores/${auth.usuarioId}`} color="inherit">
                    Mi perfil
                  </Button>
                )}
                {hasRole(auth, 'gimnasio_admin') && (
                  <Button component={RouterLink} to="/eventos/mios" color="inherit">
                    Mis eventos
                  </Button>
                )}
                {hasRole(auth, 'gimnasio_admin') && (
                  <Button component={RouterLink} to="/gimnasios/mios" color="inherit">
                    Mis gimnasios
                  </Button>
                )}
                <Button component={RouterLink} to="/gimnasios/crear" color="inherit">
                  {hasRole(auth, 'gimnasio_admin') ? 'Crear otro gimnasio' : 'Crear gimnasio'}
                </Button>
                <Button onClick={handleLogout} variant="outlined" color="primary">
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button component={RouterLink} to="/login" color="inherit">
                  Entrar
                </Button>
                <Button component={RouterLink} to="/registro" variant="contained" color="primary">
                  Registrarse
                </Button>
              </>
            )}
          </Stack>

          <Box sx={{ flexGrow: 1, display: { xs: 'block', md: 'none' } }} />

          <IconButton
            onClick={toggleMode}
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            aria-label="Cambiar tema"
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <IconButton
            onClick={() => setMenuOpen(true)}
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            aria-label="Abrir menú"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Stack spacing={0.5} sx={{ width: 260, p: 2 }}>
          {NAV_LINKS.map((link) => (
            <Button
              key={link.to}
              onClick={() => handleNavigate(link.to)}
              color="inherit"
              sx={{
                justifyContent: 'flex-start',
                color: location.pathname === link.to ? 'primary.main' : 'text.primary',
                fontWeight: 700,
              }}
            >
              {link.label}
            </Button>
          ))}
          {hasRole(auth, 'gimnasio_admin') && (
            <Button onClick={() => handleNavigate('/eventos/mios')} color="inherit" sx={{ justifyContent: 'flex-start' }}>
              Mis eventos
            </Button>
          )}
          {hasRole(auth, 'gimnasio_admin') && (
            <Button onClick={() => handleNavigate('/gimnasios/mios')} color="inherit" sx={{ justifyContent: 'flex-start' }}>
              Mis gimnasios
            </Button>
          )}

          <Divider sx={{ my: 1 }} />

          {auth ? (
            <>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', px: 1, py: 0.5 }}>
                <Avatar src={meQuery.data?.avatarUrl ?? undefined} sx={{ width: 36, height: 36 }}>
                  {auth.nombre.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="body2">{auth.nombre}</Typography>
              </Stack>
              {hasRole(auth, 'boxeador') && (
                <Button
                  onClick={() => handleNavigate(`/boxeadores/${auth.usuarioId}`)}
                  color="inherit"
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Mi perfil
                </Button>
              )}
              <Button
                onClick={() => handleNavigate('/gimnasios/crear')}
                color="inherit"
                sx={{ justifyContent: 'flex-start' }}
              >
                {hasRole(auth, 'gimnasio_admin') ? 'Crear otro gimnasio' : 'Crear gimnasio'}
              </Button>
              <Button onClick={handleLogout} variant="outlined" color="primary">
                Salir
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => handleNavigate('/login')} variant="outlined" color="primary">
                Entrar
              </Button>
              <Button onClick={() => handleNavigate('/registro')} variant="contained" color="primary">
                Registrarse
              </Button>
            </>
          )}

          <Divider sx={{ my: 1 }} />

          <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
            {redesSociales}
          </Stack>
        </Stack>
      </Drawer>
    </AppBar>
  )
}
