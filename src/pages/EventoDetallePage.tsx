import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { obtener } from '../api/eventos'
import { useAuth } from '../auth/useAuth'
import { EditarEventoDialog } from '../features/eventos/components/EditarEventoDialog'
import { EstadoEventoChip } from '../features/eventos/components/EstadoEventoChip'
import { InscripcionesEventoCard } from '../features/eventos/components/InscripcionesEventoCard'

const TIPO_LABEL: Record<string, string> = {
  torneo: 'Torneo',
  velada: 'Velada',
  exhibicion: 'Exhibición',
  campeonato: 'Campeonato',
}

export function EventoDetallePage() {
  const { id } = useParams<{ id: string }>()
  const { auth } = useAuth()
  const [editOpen, setEditOpen] = useState(false)

  const query = useQuery({
    queryKey: ['evento', id],
    queryFn: () => obtener(id!),
    enabled: !!id,
  })

  if (!id) return null
  if (query.isLoading) return <CircularProgress />
  if (query.isError || !query.data) {
    return <Typography color="error">No se encontró el evento.</Typography>
  }

  const evento = query.data
  const esOrganizador = auth?.usuarioId === evento.organizadorId

  return (
    <Grid container spacing={4}>
      {evento.afichePosterUrl && (
        <Grid size={{ xs: 12, sm: 4 }}>
          <Box
            component="img"
            src={evento.afichePosterUrl}
            alt=""
            sx={{ width: '100%', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
          />
        </Grid>
      )}
      <Grid size={{ xs: 12, sm: evento.afichePosterUrl ? 8 : 12 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <EstadoEventoChip estado={evento.estado} />
            <Typography variant="body2" color="text.secondary">
              {TIPO_LABEL[evento.tipo] ?? evento.tipo}
            </Typography>
          </Stack>
          <Typography variant="h1">{evento.nombre}</Typography>
          <Typography variant="body1">
            {new Date(evento.fecha).toLocaleDateString('es-CL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
          {evento.lugar && <Typography variant="body1">{evento.lugar}</Typography>}
          {evento.regionNombre && (
            <Typography variant="body2" color="text.secondary">
              {evento.regionNombre}
            </Typography>
          )}
          {evento.cuposTotales != null && (
            <Typography variant="body2" color="text.secondary">
              Cupos totales: {evento.cuposTotales}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Organiza: {evento.gimnasioNombre ?? evento.organizadorNombre}
          </Typography>
          {evento.reglamentoUrl && (
            <Button href={evento.reglamentoUrl} target="_blank" rel="noopener" variant="outlined" sx={{ alignSelf: 'flex-start' }}>
              Ver reglamento
            </Button>
          )}
          {esOrganizador && (
            <Button variant="outlined" onClick={() => setEditOpen(true)} sx={{ alignSelf: 'flex-start' }}>
              Editar evento
            </Button>
          )}
        </Stack>
      </Grid>

      <Grid size={12}>
        <InscripcionesEventoCard eventoId={evento.id} esOrganizador={esOrganizador} />
      </Grid>

      {esOrganizador && (
        <EditarEventoDialog evento={evento} open={editOpen} onClose={() => setEditOpen(false)} />
      )}
    </Grid>
  )
}
