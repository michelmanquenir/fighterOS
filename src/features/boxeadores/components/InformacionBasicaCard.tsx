import type { ReactNode } from 'react'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import PlaceIcon from '@mui/icons-material/Place'
import ScaleIcon from '@mui/icons-material/Scale'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { CardHeading } from './CardHeading'

interface InformacionBasicaCardProps {
  pesoActual: number | null
  categoriaNombre: string | null
  gimnasioNombre: string | null
  regionNombre: string | null
}

function Tile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <Stack spacing={0.75} sx={{ alignItems: 'center', textAlign: 'center' }}>
      <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', color: 'text.secondary' }}>
        {icon}
        <Typography variant="overline" sx={{ lineHeight: 1 }}>
          {label}
        </Typography>
      </Stack>
      <Typography variant="h6" color={value === '—' ? 'text.secondary' : 'primary'}>
        {value}
      </Typography>
    </Stack>
  )
}

export function InformacionBasicaCard({
  pesoActual,
  categoriaNombre,
  gimnasioNombre,
  regionNombre,
}: InformacionBasicaCardProps) {
  return (
    <Card>
      <CardContent>
        <CardHeading>Información básica</CardHeading>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Tile
              icon={<ScaleIcon fontSize="small" />}
              label="Peso"
              value={pesoActual != null ? `${pesoActual} kg` : '—'}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Tile
              icon={<WorkspacePremiumIcon fontSize="small" />}
              label="Categoría"
              value={categoriaNombre ?? '—'}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Tile
              icon={<FitnessCenterIcon fontSize="small" />}
              label="Gimnasio"
              value={gimnasioNombre ?? '—'}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Tile icon={<PlaceIcon fontSize="small" />} label="Ubicación" value={regionNombre ?? '—'} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
