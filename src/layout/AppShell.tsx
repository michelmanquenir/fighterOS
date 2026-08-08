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
        <Container
          component="main"
          maxWidth={false}
          sx={{
            flexGrow: 1,
            py: 4,
            px: { xs: 2, md: 4 },
            maxWidth: { xs: '100%', lg: 1440, xl: 1720 },
            mx: 'auto',
          }}
        >
          <Outlet />
        </Container>
      )}
      <Footer />
    </Box>
  )
}
