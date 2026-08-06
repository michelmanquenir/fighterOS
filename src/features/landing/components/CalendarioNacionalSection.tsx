import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { SectionHeader } from './SectionHeader'

const MESES = [
  { mes: 'Junio 2026', eventos: 8 },
  { mes: 'Julio 2026', eventos: 10 },
  { mes: 'Agosto 2026', eventos: 12 },
  { mes: 'Septiembre 2026', eventos: 9 },
  { mes: 'Octubre 2026', eventos: 11 },
]

export function CalendarioNacionalSection() {
  return (
    <Box>
      <SectionHeader title="Calendario nacional" actionLabel="Ver eventos" actionTo="/eventos" />
      <Stack spacing={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        {MESES.map((m) => (
          <Stack
            key={m.mes}
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: 'center',
              px: 2,
              py: 1.5,
              '&:not(:last-of-type)': { borderBottom: '1px solid', borderColor: 'divider' },
            }}
          >
            <CalendarMonthIcon color="primary" fontSize="small" />
            <Typography variant="body2" sx={{ flex: 1 }}>
              {m.mes}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {m.eventos} eventos
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
