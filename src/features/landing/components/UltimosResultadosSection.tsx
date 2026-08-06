import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { SectionHeader } from './SectionHeader'

interface ResultadoPlaceholder {
  id: string
  ganador: string
  ganadorGimnasio: string
  perdedor: string
  perdedorGimnasio: string
  metodo: string
  evento: string
  fecha: string
}

const RESULTADOS: ResultadoPlaceholder[] = [
  {
    id: '1',
    ganador: 'Juan Pérez',
    ganadorGimnasio: 'Club Santiago',
    perdedor: 'Pedro Soto',
    perdedorGimnasio: 'Club Renca',
    metodo: 'Decisión unánime',
    evento: 'Velada Metropolitana',
    fecha: '25-05-2026',
  },
  {
    id: '2',
    ganador: 'Diego Ruiz',
    ganadorGimnasio: 'Boxeo Centro',
    perdedor: 'Tomás Herrera',
    perdedorGimnasio: 'Club Maipú',
    metodo: 'RSC · R2',
    evento: 'Copa Valparaíso',
    fecha: '25-05-2026',
  },
  {
    id: '3',
    ganador: 'Matías Flores',
    ganadorGimnasio: 'Boxeo Sur',
    perdedor: 'Carlos Muñoz',
    perdedorGimnasio: 'Club Renca',
    metodo: 'Puntos',
    evento: 'Torneo Amistoso Centro',
    fecha: '24-05-2026',
  },
]

export function UltimosResultadosSection() {
  return (
    <Box>
      <SectionHeader title="Últimos resultados" />
      <Stack spacing={2}>
        {RESULTADOS.map((r) => (
          <Stack
            key={r.id}
            direction="row"
            spacing={2}
            sx={{ alignItems: 'center', p: 2, border: '1px solid', borderColor: 'divider' }}
          >
            <Avatar sx={{ width: 40, height: 40 }}>{r.ganador.charAt(0)}</Avatar>
            <Stack spacing={0} sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="body2" noWrap>
                {r.ganador} <Typography component="span" variant="caption" color="text.secondary">· {r.ganadorGimnasio}</Typography>
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Chip label="Ganó" color="success" size="small" />
                <Typography variant="caption" color="primary" sx={{ fontWeight: 700 }}>
                  {r.metodo}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" noWrap>
                {r.perdedor} · {r.perdedorGimnasio}
              </Typography>
            </Stack>
            <Stack spacing={0} sx={{ textAlign: 'right', flexShrink: 0 }}>
              <Typography variant="caption" color="text.secondary" noWrap>
                {r.evento}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {r.fecha}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
