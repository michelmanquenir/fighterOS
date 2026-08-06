import ApartmentIcon from '@mui/icons-material/Apartment'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import EventIcon from '@mui/icons-material/Event'
import GavelIcon from '@mui/icons-material/Gavel'
import PersonIcon from '@mui/icons-material/Person'
import SportsMmaIcon from '@mui/icons-material/SportsMma'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

const STATS = [
  { icon: PersonIcon, value: '4.238', label: 'Boxeadores registrados' },
  { icon: ApartmentIcon, value: '152', label: 'Gimnasios registrados' },
  { icon: EventIcon, value: '318', label: 'Eventos realizados' },
  { icon: SportsMmaIcon, value: '5.962', label: 'Peleas registradas' },
  { icon: EmojiEventsIcon, value: '12', label: 'Ligas activas' },
  { icon: GavelIcon, value: '94', label: 'Árbitros registrados' },
]

export function StatsBar() {
  return (
    <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {STATS.map(({ icon: Icon, value, label }) => (
            <Grid key={label} size={{ xs: 6, sm: 4, md: 2 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    bgcolor: 'rgba(214,40,40,0.12)',
                    color: 'primary.main',
                  }}
                >
                  <Icon fontSize="small" />
                </Box>
                <Stack spacing={0} sx={{ minWidth: 0 }}>
                  <Typography variant="h5" sx={{ lineHeight: 1.1 }}>
                    {value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {label}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
