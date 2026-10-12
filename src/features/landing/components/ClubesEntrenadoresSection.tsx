import GroupsIcon from '@mui/icons-material/Groups'
import PlaceIcon from '@mui/icons-material/Place'
import SportsMmaIcon from '@mui/icons-material/SportsMma'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import { obtenerGimnasiosDestacados } from '../../../api/gimnasios'
import { Section } from './Section'
import { SectionHeader } from './SectionHeader'

export function ClubesEntrenadoresSection() {
  const query = useQuery({
    queryKey: ['gimnasios', 'destacados'],
    queryFn: obtenerGimnasiosDestacados,
  })

  const clubes = query.data ?? []

  return (
    <Section sx={{ pt: 0 }}>
      <SectionHeader title="Clubes destacados" actionLabel="Ver todos los clubes" actionTo="/clubes" />

      {query.isLoading && (
        <Stack sx={{ alignItems: 'center', py: 4 }}>
          <CircularProgress />
        </Stack>
      )}
      {query.data && clubes.length === 0 && (
        <Typography color="text.secondary">Todavía no hay gimnasios registrados.</Typography>
      )}
      {clubes.length > 0 && (
        <Grid container spacing={2}>
          {clubes.map((club) => (
            <Grid key={club.id} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <Card>
                <CardActionArea component={RouterLink} to="/clubes">
                  <Box
                    sx={{
                      aspectRatio: '4 / 3',
                      bgcolor: 'grey.900',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 1,
                    }}
                  >
                    <SportsMmaIcon sx={{ fontSize: 32, color: 'grey.600' }} />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {club.nombre}
                    </Typography>
                    {club.regionNombre && (
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                        <PlaceIcon fontSize="small" color="disabled" />
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {club.regionNombre}
                        </Typography>
                      </Stack>
                    )}
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mt: 0.5 }}>
                      <GroupsIcon fontSize="small" color="disabled" />
                      <Typography variant="caption" color="text.secondary">
                        {club.cantidadAlumnos} {club.cantidadAlumnos === 1 ? 'alumno' : 'alumnos'}
                      </Typography>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 5 }}>
        <SectionHeader title="Entrenadores destacados" actionLabel="Ver todos los entrenadores" actionTo="/entrenadores" />
        <Stack
          spacing={1}
          sx={{ p: 4, border: '1px solid', borderColor: 'divider', alignItems: 'center', textAlign: 'center' }}
        >
          <Avatar sx={{ bgcolor: 'action.hover', color: 'text.secondary', width: 48, height: 48 }}>
            <GroupsIcon />
          </Avatar>
          <Typography color="text.secondary">
            Muy pronto podrás conocer a los entrenadores de la comunidad Fighteros.
          </Typography>
        </Stack>
      </Box>
    </Section>
  )
}
