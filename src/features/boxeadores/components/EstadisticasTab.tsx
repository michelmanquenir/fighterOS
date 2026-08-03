import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { obtenerEstadisticas } from '../../../api/boxeadores'
import { StatCard } from './StatCard'

export function EstadisticasTab({ boxeadorId }: { boxeadorId: string }) {
  const query = useQuery({
    queryKey: ['boxeador', boxeadorId, 'estadisticas'],
    queryFn: () => obtenerEstadisticas(boxeadorId),
  })

  if (query.isLoading) return <CircularProgress />
  if (!query.data) return null

  const stats = query.data

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 6, sm: 4, md: 2 }}>
        <StatCard label="Peleas" value={stats.peleasTotales} />
      </Grid>
      <Grid size={{ xs: 6, sm: 4, md: 2 }}>
        <StatCard label="Victorias" value={stats.victorias} />
      </Grid>
      <Grid size={{ xs: 6, sm: 4, md: 2 }}>
        <StatCard label="Derrotas" value={stats.derrotas} />
      </Grid>
      <Grid size={{ xs: 6, sm: 4, md: 2 }}>
        <StatCard label="Empates" value={stats.empates} />
      </Grid>
      <Grid size={{ xs: 6, sm: 4, md: 2 }}>
        <StatCard label="KOs" value={stats.victoriasKo} />
      </Grid>
      <Grid size={{ xs: 6, sm: 4, md: 2 }}>
        <StatCard label="Por decisión" value={stats.victoriasDecision} />
      </Grid>
      {stats.ultimaPelea && (
        <Grid size={12}>
          <Typography color="text.secondary">
            Última pelea: {new Date(stats.ultimaPelea).toLocaleDateString('es-CL')}
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}
