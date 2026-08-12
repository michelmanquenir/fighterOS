import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { actualizar } from '../../../api/eventos'
import { listarRegiones } from '../../../api/catalogos'
import type { EstadoEventoEnum, EventoResponse } from '../../../api/types'
import { AficheUploadField } from './AficheUploadField'
import { ReglamentoUploadField } from './ReglamentoUploadField'

interface Props {
  evento: EventoResponse
  open: boolean
  onClose: () => void
}

export function EditarEventoDialog({ evento, open, onClose }: Props) {
  const [nombre, setNombre] = useState(evento.nombre)
  const [fecha, setFecha] = useState(evento.fecha)
  const [lugar, setLugar] = useState(evento.lugar ?? '')
  const [regionId, setRegionId] = useState(evento.regionId?.toString() ?? '')
  const [cuposTotales, setCuposTotales] = useState(evento.cuposTotales?.toString() ?? '')
  const [estado, setEstado] = useState<EstadoEventoEnum>(evento.estado)
  const [reglamentoUrl, setReglamentoUrl] = useState(evento.reglamentoUrl ?? '')
  const [afichePosterUrl, setAfichePosterUrl] = useState(evento.afichePosterUrl ?? '')

  const queryClient = useQueryClient()
  const regionesQuery = useQuery({ queryKey: ['catalogos', 'regiones'], queryFn: listarRegiones })

  const mutation = useMutation({
    mutationFn: () =>
      actualizar(evento.id, {
        nombre,
        fecha,
        lugar: lugar || undefined,
        regionId: regionId ? Number(regionId) : undefined,
        cuposTotales: cuposTotales ? Number(cuposTotales) : undefined,
        estado,
        reglamentoUrl: reglamentoUrl || undefined,
        afichePosterUrl: afichePosterUrl || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evento', evento.id] })
      queryClient.invalidateQueries({ queryKey: ['eventos'] })
      onClose()
    },
  })

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar evento</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid size={12}>
            <TextField fullWidth label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Lugar" value={lugar} onChange={(e) => setLugar(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select fullWidth label="Región" value={regionId} onChange={(e) => setRegionId(e.target.value)}>
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
              fullWidth
              label="Cupos totales"
              type="number"
              value={cuposTotales}
              onChange={(e) => setCuposTotales(e.target.value)}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              select
              fullWidth
              label="Estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value as EstadoEventoEnum)}
            >
              <MenuItem value="planificado">Planificado</MenuItem>
              <MenuItem value="inscripciones_abiertas">Inscripciones abiertas</MenuItem>
              <MenuItem value="en_curso">En curso</MenuItem>
              <MenuItem value="finalizado">Finalizado</MenuItem>
              <MenuItem value="cancelado">Cancelado</MenuItem>
            </TextField>
          </Grid>
          <Grid size={12}>
            <AficheUploadField value={afichePosterUrl} onChange={setAfichePosterUrl} />
          </Grid>
          <Grid size={12}>
            <ReglamentoUploadField value={reglamentoUrl} onChange={setReglamentoUrl} />
          </Grid>
        </Grid>
        {mutation.isError && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            No se pudo guardar el evento.
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
