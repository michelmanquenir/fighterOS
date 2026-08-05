import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PlaceIcon from '@mui/icons-material/Place'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import type { EventoResponse } from '../../../api/types'
import { EstadoEventoChip } from './EstadoEventoChip'

const TIPO_LABEL: Record<string, string> = {
  torneo: 'Torneo',
  velada: 'Velada',
  exhibicion: 'Exhibición',
  campeonato: 'Campeonato',
}

export function EventoCard({ evento }: { evento: EventoResponse }) {
  const navigate = useNavigate()

  return (
    <Card>
      <CardActionArea onClick={() => navigate(`/eventos/${evento.id}`)}>
        {evento.afichePosterUrl && (
          <CardMedia
            component="img"
            image={evento.afichePosterUrl}
            alt=""
            sx={{ aspectRatio: '3 / 4', objectFit: 'cover' }}
          />
        )}
        <CardContent>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
              <EstadoEventoChip estado={evento.estado} />
              <Typography variant="caption" color="text.secondary">
                {TIPO_LABEL[evento.tipo] ?? evento.tipo}
              </Typography>
            </Stack>
            <Typography variant="h5" noWrap>
              {evento.nombre}
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <CalendarMonthIcon fontSize="small" color="disabled" />
              <Typography variant="body2" color="text.secondary">
                {new Date(evento.fecha).toLocaleDateString('es-CL')}
              </Typography>
            </Stack>
            {evento.lugar && (
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <PlaceIcon fontSize="small" color="disabled" />
                <Typography variant="body2" color="text.secondary" noWrap>
                  {evento.lugar}
                </Typography>
              </Stack>
            )}
            {evento.gimnasioNombre && (
              <Typography variant="body2" color="text.secondary" noWrap>
                Organiza: {evento.gimnasioNombre}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
