import { useState } from 'react'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import MenuIcon from '@mui/icons-material/Menu'
import SportsMmaIcon from '@mui/icons-material/SportsMma'
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
  { to: '/', label: 'Inicio' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/boxeadores', label: 'Boxeadores' },
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

  return (
    <AppBar position="sticky" color="transparent" sx={{ top: 0 }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
        <Toolbar disableGutters sx={{ gap: { xs: 1, md: 4 }, py: 1 }}>
          <Stack
            component={RouterLink}
            to="/"
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', textDecoration: 'none', color: 'text.primary', mr: 1 }}
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

          <Stack
            direction="row"
            spacing={1}
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}
          >
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.to
              return (
                <Button
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  color="inherit"
                  sx={{
                    color: active ? 'primary.main' : 'text.primary',
                    fontWeight: 700,
                  }}
                >
                  {link.label}
                </Button>
              )
            })}
            {hasRole(auth, 'gimnasio_admin') && (
              <Button component={RouterLink} to="/eventos/mios" color="inherit">
                Mis eventos
              </Button>
            )}
          </Stack>

          <Box sx={{ flexGrow: { xs: 1, sm: 0 } }} />

          <Tooltip title={mode === 'dark' ? 'Tema claro' : 'Tema oscuro'}>
            <IconButton onClick={toggleMode} sx={{ display: { xs: 'none', sm: 'inline-flex' } }} aria-label="Cambiar tema">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', display: { xs: 'none', sm: 'flex' } }}>
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
                <Button component={RouterLink} to="/gimnasios/crear" color="inherit">
                  {hasRole(auth, 'gimnasio_admin') ? 'Crear otro gimnasio' : 'Crear gimnasio'}
                </Button>
                <Button onClick={handleLogout} variant="outlined" color="primary">
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button component={RouterLink} to="/login" variant="outlined" color="primary">
                  Entrar
                </Button>
                <Button component={RouterLink} to="/registro" variant="contained" color="primary">
                  Registrarse
                </Button>
              </>
            )}
          </Stack>

          <IconButton
            onClick={toggleMode}
            sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
            aria-label="Cambiar tema"
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <IconButton
            onClick={() => setMenuOpen(true)}
            sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
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
        </Stack>
      </Drawer>
    </AppBar>
  )
}
