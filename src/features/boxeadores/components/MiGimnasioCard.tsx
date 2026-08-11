import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import PlaceIcon from '@mui/icons-material/Place'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import { obtenerMisGimnasios } from '../../../api/gimnasios'
import { CardHeading } from './CardHeading'

export function MiGimnasioCard() {
  const query = useQuery({
    queryKey: ['gimnasios', 'mios'],
    queryFn: obtenerMisGimnasios,
  })

  if (query.isLoading || !query.data || query.data.length === 0) return null
  const gimnasios = query.data

  return (
    <Card>
      <CardContent>
        <CardHeading>{gimnasios.length > 1 ? 'Mis gimnasios' : 'Mi gimnasio'}</CardHeading>
        <Stack spacing={2}>
          {gimnasios.map((gimnasio, index) => (
            <Stack key={gimnasio.id} spacing={1.5}>
              {index > 0 && <Divider />}
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
            </Stack>
          ))}
          <Button component={RouterLink} to="/eventos/mios" variant="outlined" size="small" sx={{ alignSelf: 'flex-start' }}>
            Ver mis eventos
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
