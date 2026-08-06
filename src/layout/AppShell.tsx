import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export function AppShell() {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      {isLanding ? (
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
      ) : (
        <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
          <Outlet />
        </Container>
      )}
      <Footer />
    </Box>
  )
}
