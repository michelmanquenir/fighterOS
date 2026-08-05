import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom'
import { hasRole } from '../auth/roles'
import { useAuth } from '../auth/useAuth'

export function AppShell() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <Typography
            variant="h5"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'text.primary' }}
          >
            FighterOS
          </Typography>
          <Button component={RouterLink} to="/" color="inherit">
            Eventos
          </Button>
          <Button component={RouterLink} to="/boxeadores" color="inherit">
            Boxeadores
          </Button>
          {hasRole(auth, 'gimnasio_admin') && (
            <Button component={RouterLink} to="/eventos/mios" color="inherit">
              Mis eventos
            </Button>
          )}
          {auth ? (
            <>
              {hasRole(auth, 'boxeador') && (
                <Button component={RouterLink} to={`/boxeadores/${auth.usuarioId}`} color="inherit">
                  Mi perfil
                </Button>
              )}
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
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
