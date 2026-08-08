import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { CardHeading } from './CardHeading'

interface EquipoCardProps {
  entrenadorNombre: string | null
  gimnasioNombre: string | null
}

export function EquipoCard({ entrenadorNombre, gimnasioNombre }: EquipoCardProps) {
  if (!entrenadorNombre && !gimnasioNombre) return null

  return (
    <Card>
      <CardContent>
        <CardHeading>Equipo</CardHeading>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {entrenadorNombre && (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Avatar sx={{ width: 44, height: 44 }}>{entrenadorNombre.charAt(0)}</Avatar>
              <Stack spacing={0}>
                <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                  Entrenador
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {entrenadorNombre}
                </Typography>
              </Stack>
            </Stack>
          )}

          {entrenadorNombre && gimnasioNombre && <Divider />}

          {gimnasioNombre && (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Avatar variant="rounded" sx={{ width: 44, height: 44, bgcolor: 'background.default' }}>
                <FitnessCenterIcon fontSize="small" />
              </Avatar>
              <Stack spacing={0}>
                <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                  Gimnasio
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {gimnasioNombre}
                </Typography>
              </Stack>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
