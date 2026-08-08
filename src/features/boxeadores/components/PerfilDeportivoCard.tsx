import CakeIcon from '@mui/icons-material/Cake'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HandshakeIcon from '@mui/icons-material/Handshake'
import ScaleIcon from '@mui/icons-material/Scale'
import SportsMmaIcon from '@mui/icons-material/SportsMma'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { obtenerEstadisticas } from '../../../api/boxeadores'
import type { NivelProgresionEnum } from '../../../api/types'
import { CardHeading } from './CardHeading'

const NIVEL_LABEL: Record<NivelProgresionEnum, string> = {
  debutante: 'Debutante',
  novato: 'Novato',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
  elite_amateur: 'Élite amateur',
}

interface Tile {
  icon: React.ReactNode
  label: string
  value: string | number
  color?: 'primary' | 'text.secondary'
}

function StatTile({ icon, label, value, color = 'primary' }: Tile) {
  return (
    <Stack spacing={0.5} sx={{ alignItems: 'center', textAlign: 'center', py: 1 }}>
      <Stack sx={{ color: 'text.secondary' }}>{icon}</Stack>
      <Typography variant="h6" color={color}>
        {value}
      </Typography>
      <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
        {label}
      </Typography>
    </Stack>
  )
}

interface PerfilDeportivoCardProps {
  boxeadorId: string
  edad: number
  pesoActual: number | null
  categoriaNombre: string | null
  nivelProgresion: NivelProgresionEnum
}

export function PerfilDeportivoCard({
  boxeadorId,
  edad,
  pesoActual,
  categoriaNombre,
  nivelProgresion,
}: PerfilDeportivoCardProps) {
  const query = useQuery({
    queryKey: ['boxeador', boxeadorId, 'estadisticas'],
    queryFn: () => obtenerEstadisticas(boxeadorId),
  })

  return (
    <Card>
      <CardContent>
        <CardHeading>Perfil deportivo</CardHeading>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid size={{ xs: 6, sm: 4 }}>
            <StatTile icon={<CakeIcon fontSize="small" />} label="Edad" value={`${edad} años`} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <StatTile
              icon={<ScaleIcon fontSize="small" />}
              label="Peso actual"
              value={pesoActual != null ? `${pesoActual} kg` : '—'}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <StatTile
              icon={<WorkspacePremiumIcon fontSize="small" />}
              label="Categoría"
              value={categoriaNombre ?? '—'}
            />
          </Grid>
          <Grid size={12}>
            <StatTile
              icon={<TrendingUpIcon fontSize="small" />}
              label="Nivel deportivo"
              value={NIVEL_LABEL[nivelProgresion]}
            />
          </Grid>
        </Grid>

        {query.isLoading ? (
          <CircularProgress size={20} sx={{ mt: 2 }} />
        ) : query.data ? (
          <Grid container spacing={1} sx={{ mt: 1, borderTop: '1px solid', borderColor: 'divider', pt: 1 }}>
            <Grid size={3}>
              <StatTile icon={<SportsMmaIcon fontSize="small" />} label="Peleas" value={query.data.peleasTotales} />
            </Grid>
            <Grid size={3}>
              <StatTile icon={<CheckCircleIcon fontSize="small" />} label="Victorias" value={query.data.victorias} />
            </Grid>
            <Grid size={3}>
              <StatTile icon={<CancelIcon fontSize="small" />} label="Derrotas" value={query.data.derrotas} />
            </Grid>
            <Grid size={3}>
              <StatTile icon={<HandshakeIcon fontSize="small" />} label="Empates" value={query.data.empates} />
            </Grid>
          </Grid>
        ) : null}
      </CardContent>
    </Card>
  )
}
