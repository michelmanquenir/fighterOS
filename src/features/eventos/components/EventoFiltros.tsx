import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { useQuery } from '@tanstack/react-query'
import { listarRegiones } from '../../../api/catalogos'
import type { EstadoEventoEnum, EventoFiltros as Filtros, TipoEventoEnum } from '../../../api/types'

interface Props {
  filtros: Filtros
  onChange: (filtros: Filtros) => void
}

export function EventoFiltros({ filtros, onChange }: Props) {
  const regionesQuery = useQuery({ queryKey: ['catalogos', 'regiones'], queryFn: listarRegiones })

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          select
          fullWidth
          label="Región"
          value={filtros.regionId ?? ''}
          onChange={(event) =>
            onChange({
              ...filtros,
              regionId: event.target.value ? Number(event.target.value) : undefined,
            })
          }
        >
          <MenuItem value="">Todas</MenuItem>
          {regionesQuery.data?.map((region) => (
            <MenuItem key={region.id} value={region.id}>
              {region.nombre}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          select
          fullWidth
          label="Tipo"
          value={filtros.tipo ?? ''}
          onChange={(event) =>
            onChange({ ...filtros, tipo: (event.target.value || undefined) as TipoEventoEnum | undefined })
          }
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="torneo">Torneo</MenuItem>
          <MenuItem value="velada">Velada</MenuItem>
          <MenuItem value="exhibicion">Exhibición</MenuItem>
          <MenuItem value="campeonato">Campeonato</MenuItem>
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          select
          fullWidth
          label="Estado"
          value={filtros.estado ?? ''}
          onChange={(event) =>
            onChange({
              ...filtros,
              estado: (event.target.value || undefined) as EstadoEventoEnum | undefined,
            })
          }
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="planificado">Planificado</MenuItem>
          <MenuItem value="inscripciones_abiertas">Inscripciones abiertas</MenuItem>
          <MenuItem value="en_curso">En curso</MenuItem>
          <MenuItem value="finalizado">Finalizado</MenuItem>
          <MenuItem value="cancelado">Cancelado</MenuItem>
        </TextField>
      </Grid>
    </Grid>
  )
}
