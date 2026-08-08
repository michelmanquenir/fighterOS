import { useState } from 'react'
import LockIcon from '@mui/icons-material/Lock'
import PublicIcon from '@mui/icons-material/Public'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { actualizar } from '../../../api/boxeadores'
import { listarCategoriasPeso, listarGimnasios, listarRegiones } from '../../../api/catalogos'
import type { BoxeadorPerfilResponse, EstadoDeportivoEnum } from '../../../api/types'

interface Props {
  boxeador: BoxeadorPerfilResponse
  open: boolean
  onClose: () => void
}

export function EditarPerfilDialog({ boxeador, open, onClose }: Props) {
  const [pesoActual, setPesoActual] = useState(boxeador.pesoActual?.toString() ?? '')
  const [pesoHabitual, setPesoHabitual] = useState(boxeador.pesoHabitual?.toString() ?? '')
  const [categoriaId, setCategoriaId] = useState(boxeador.categoriaId ?? '')
  const [gimnasioId, setGimnasioId] = useState(boxeador.gimnasioId ?? '')
  const [regionId, setRegionId] = useState(boxeador.regionId?.toString() ?? '')
  const [estadoDeportivo, setEstadoDeportivo] = useState<EstadoDeportivoEnum>(
    boxeador.estadoDeportivo,
  )
  const [perfilPublico, setPerfilPublico] = useState(boxeador.perfilPublico)

  const queryClient = useQueryClient()
  const regionesQuery = useQuery({ queryKey: ['catalogos', 'regiones'], queryFn: listarRegiones })
  const categoriasQuery = useQuery({
    queryKey: ['catalogos', 'categorias-peso'],
    queryFn: listarCategoriasPeso,
  })
  const gimnasiosQuery = useQuery({
    queryKey: ['catalogos', 'gimnasios'],
    queryFn: listarGimnasios,
  })

  const mutation = useMutation({
    mutationFn: () =>
      actualizar(boxeador.id, {
        pesoActual: pesoActual ? Number(pesoActual) : undefined,
        pesoHabitual: pesoHabitual ? Number(pesoHabitual) : undefined,
        categoriaId: categoriaId || undefined,
        gimnasioId: gimnasioId || undefined,
        regionId: regionId ? Number(regionId) : undefined,
        estadoDeportivo,
        perfilPublico,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boxeador', boxeador.id] })
      onClose()
    },
  })

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar perfil</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Peso actual (kg)"
              type="number"
              value={pesoActual}
              onChange={(event) => setPesoActual(event.target.value)}
              slotProps={{ htmlInput: { step: '0.1' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Peso habitual (kg)"
              type="number"
              value={pesoHabitual}
              onChange={(event) => setPesoHabitual(event.target.value)}
              slotProps={{ htmlInput: { step: '0.1' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              label="Categoría"
              value={categoriaId}
              onChange={(event) => setCategoriaId(event.target.value)}
            >
              <MenuItem value="">Sin categoría</MenuItem>
              {categoriasQuery.data?.map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.id}>
                  {categoria.nombre} ({categoria.sexo})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              label="Gimnasio"
              value={gimnasioId}
              onChange={(event) => setGimnasioId(event.target.value)}
            >
              <MenuItem value="">Sin gimnasio</MenuItem>
              {gimnasiosQuery.data?.map((gimnasio) => (
                <MenuItem key={gimnasio.id} value={gimnasio.id}>
                  {gimnasio.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              label="Región"
              value={regionId}
              onChange={(event) => setRegionId(event.target.value)}
            >
              <MenuItem value="">Sin región</MenuItem>
              {regionesQuery.data?.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              label="Estado deportivo"
              value={estadoDeportivo}
              onChange={(event) => setEstadoDeportivo(event.target.value as EstadoDeportivoEnum)}
            >
              <MenuItem value="activo">Activo</MenuItem>
              <MenuItem value="retirado">Retirado</MenuItem>
              <MenuItem value="suspendido">Suspendido</MenuItem>
              <MenuItem value="lesionado">Lesionado</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <FormControlLabel
          control={
            <Switch
              checked={perfilPublico}
              onChange={(event) => setPerfilPublico(event.target.checked)}
            />
          }
          label={
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              {perfilPublico ? <PublicIcon fontSize="small" /> : <LockIcon fontSize="small" />}
              <Stack spacing={0}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Perfil público
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {perfilPublico
                    ? 'Cualquiera puede ver tu perfil completo.'
                    : 'Solo tú ves tu perfil completo. El resto ve una vista privada.'}
                </Typography>
              </Stack>
            </Stack>
          }
        />

        {mutation.isError && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            No se pudo guardar el perfil.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
