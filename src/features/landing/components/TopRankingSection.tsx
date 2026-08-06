import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { SectionHeader } from './SectionHeader'

interface RankingEntry {
  posicion: number
  nombre: string
  gimnasio: string
  peso: string
  puntos: string
}

const RANKING: RankingEntry[] = [
  { posicion: 1, nombre: 'Juan Pérez', gimnasio: 'Club Santiago', peso: '63,5 kg', puntos: '1.250 pts' },
  { posicion: 2, nombre: 'Diego Soto', gimnasio: 'Club Renca', peso: '69 kg', puntos: '1.180 pts' },
  { posicion: 3, nombre: 'Matías Flores', gimnasio: 'Boxeo Sur', peso: '63,5 kg', puntos: '1.050 pts' },
  { posicion: 4, nombre: 'Cristian Muñoz', gimnasio: 'Club Maipú', peso: '71 kg', puntos: '980 pts' },
  { posicion: 5, nombre: 'Sebastián Díaz', gimnasio: 'Boxeo Centro', peso: '75 kg', puntos: '920 pts' },
]

export function TopRankingSection() {
  return (
    <Box>
      <SectionHeader title="Top ranking" actionLabel="Ver todos" actionTo="/boxeadores" />
      <Stack spacing={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        {RANKING.map((entry) => (
          <Stack
            key={entry.posicion}
            direction="row"
            spacing={2}
            sx={{
              alignItems: 'center',
              px: 2,
              py: 1.5,
              '&:not(:last-of-type)': { borderBottom: '1px solid', borderColor: 'divider' },
            }}
          >
            <Typography
              variant="h6"
              color={entry.posicion === 1 ? 'primary' : 'text.secondary'}
              sx={{ width: 28, flexShrink: 0 }}
            >
              {entry.posicion}
            </Typography>
            <Stack spacing={0} sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                {entry.nombre}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {entry.gimnasio} · {entry.peso}
              </Typography>
            </Stack>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 700, flexShrink: 0 }}>
              {entry.puntos}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
