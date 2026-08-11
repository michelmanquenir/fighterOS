import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import PlaceIcon from '@mui/icons-material/Place'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import { obtenerMiGimnasio } from '../../../api/gimnasios'
import { CardHeading } from './CardHeading'

export function MiGimnasioCard() {
  const query = useQuery({
    queryKey: ['gimnasios', 'mio'],
    queryFn: obtenerMiGimnasio,
  })

  if (query.isLoading || !query.data) return null
  const gimnasio = query.data

  return (
    <Card>
      <CardContent>
        <CardHeading>Mi gimnasio</CardHeading>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <FitnessCenterIcon fontSize="small" color="action" />
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {gimnasio.nombre}
            </Typography>
            <Chip size="small" label="Dueño" color="secondary" />
          </Stack>
          {(gimnasio.direccion || gimnasio.regionNombre) && (
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <PlaceIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {[gimnasio.direccion, gimnasio.regionNombre].filter(Boolean).join(' · ')}
              </Typography>
            </Stack>
          )}
          <Button component={RouterLink} to="/eventos/mios" variant="outlined" size="small" sx={{ alignSelf: 'flex-start' }}>
            Ver mis eventos
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
