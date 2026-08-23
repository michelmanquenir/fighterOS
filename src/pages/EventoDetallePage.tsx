import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { obtener, publicarCartelera } from '../api/eventos'
import { useAuth } from '../auth/useAuth'
import { CarteleraOficialCard } from '../features/eventos/components/CarteleraOficialCard'
import { CompartirEventoButtons } from '../features/eventos/components/CompartirEventoButtons'
import { EditarEventoDialog } from '../features/eventos/components/EditarEventoDialog'
import { EstadoEventoChip } from '../features/eventos/components/EstadoEventoChip'
import { InscripcionesEventoCard } from '../features/eventos/components/InscripcionesEventoCard'
import { InvitacionesEventoCard } from '../features/eventos/components/InvitacionesEventoCard'
import { TorneosEventoCard } from '../features/eventos/components/TorneosEventoCard'

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
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['evento', id],
    queryFn: () => obtener(id!),
    enabled: !!id,
  })

  const publicarMutation = useMutation({
    mutationFn: () => publicarCartelera(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evento', id] })
    },
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
            {evento.modalidad === 'cerrada' && (
              <Chip size="small" variant="outlined" label="Inscripción cerrada (por invitación)" />
            )}
            {evento.inscripcionesCerradas && (
              <Chip size="small" variant="outlined" color="warning" label="Inscripciones cerradas" />
            )}
          </Stack>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="h1">{evento.nombre}</Typography>
            <CompartirEventoButtons nombre={evento.nombre} />
          </Stack>
          <Typography variant="body1">
            {new Date(evento.fecha).toLocaleDateString('es-CL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            {evento.hora && ` · ${evento.hora.slice(0, 5)}`}
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
          <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
            {evento.linkEntradas && (
              <Button href={evento.linkEntradas} target="_blank" rel="noopener" variant="contained">
                Comprar entradas
              </Button>
            )}
            {evento.reglamentoUrl && (
              <Button href={evento.reglamentoUrl} target="_blank" rel="noopener" variant="outlined">
                Ver reglamento
              </Button>
            )}
            {esOrganizador && (
              <Button variant="outlined" onClick={() => setEditOpen(true)}>
                Editar evento
              </Button>
            )}
            {esOrganizador && !evento.carteleraPublicada && (
              <Button
                variant="outlined"
                color="secondary"
                disabled={publicarMutation.isPending}
                onClick={() => publicarMutation.mutate()}
              >
                {publicarMutation.isPending ? 'Publicando...' : 'Publicar cartelera'}
              </Button>
            )}
          </Stack>
        </Stack>
      </Grid>

      {evento.carteleraPublicada && (
        <Grid size={12}>
          <CarteleraOficialCard eventoId={evento.id} />
        </Grid>
      )}

      {esOrganizador && evento.modalidad === 'cerrada' && (
        <Grid size={12}>
          <InvitacionesEventoCard eventoId={evento.id} />
        </Grid>
      )}

      {esOrganizador && (
        <Grid size={12}>
          <TorneosEventoCard eventoId={evento.id} />
        </Grid>
      )}

      <Grid size={12}>
        <InscripcionesEventoCard eventoId={evento.id} esOrganizador={esOrganizador} />
      </Grid>

      {esOrganizador && (
        <EditarEventoDialog evento={evento} open={editOpen} onClose={() => setEditOpen(false)} />
      )}
    </Grid>
  )
}
