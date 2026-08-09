import { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { useQuery } from '@tanstack/react-query'
import { listarCategoriasPeso, listarGimnasios, listarRegiones } from '../../../api/catalogos'
import type { BoxeadorFiltros as Filtros, EstadoDeportivoEnum } from '../../../api/types'

interface Props {
  filtros: Filtros
  onChange: (filtros: Filtros) => void
}

export function BoxeadorFiltros({ filtros, onChange }: Props) {
  const regionesQuery = useQuery({ queryKey: ['catalogos', 'regiones'], queryFn: listarRegiones })
  const categoriasQuery = useQuery({
    queryKey: ['catalogos', 'categorias-peso'],
    queryFn: listarCategoriasPeso,
  })
  const gimnasiosQuery = useQuery({
    queryKey: ['catalogos', 'gimnasios'],
    queryFn: listarGimnasios,
  })

  const [nombre, setNombre] = useState(filtros.nombre ?? '')

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nombreFiltro = nombre.trim() || undefined
      if (nombreFiltro !== filtros.nombre) {
        onChange({ ...filtros, nombre: nombreFiltro })
      }
    }, 400)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo re-dispara al tipear, no en cada cambio de filtros/onChange
  }, [nombre])

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Buscar por nombre"
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 3 }}>
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
      <Grid size={{ xs: 12, sm: 3 }}>
        <TextField
          select
          fullWidth
          label="Categoría"
          value={filtros.categoriaId ?? ''}
          onChange={(event) =>
            onChange({ ...filtros, categoriaId: event.target.value || undefined })
          }
        >
          <MenuItem value="">Todas</MenuItem>
          {categoriasQuery.data?.map((categoria) => (
            <MenuItem key={categoria.id} value={categoria.id}>
              {categoria.nombre} ({categoria.sexo})
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 3 }}>
        <TextField
          select
          fullWidth
          label="Gimnasio"
          value={filtros.gimnasioId ?? ''}
          onChange={(event) =>
            onChange({ ...filtros, gimnasioId: event.target.value || undefined })
          }
        >
          <MenuItem value="">Todos</MenuItem>
          {gimnasiosQuery.data?.map((gimnasio) => (
            <MenuItem key={gimnasio.id} value={gimnasio.id}>
              {gimnasio.nombre}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 3 }}>
        <TextField
          select
          fullWidth
          label="Estado"
          value={filtros.estado ?? ''}
          onChange={(event) =>
            onChange({
              ...filtros,
              estado: (event.target.value || undefined) as EstadoDeportivoEnum | undefined,
            })
          }
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="activo">Activo</MenuItem>
          <MenuItem value="retirado">Retirado</MenuItem>
          <MenuItem value="suspendido">Suspendido</MenuItem>
          <MenuItem value="lesionado">Lesionado</MenuItem>
        </TextField>
      </Grid>
    </Grid>
  )
}
