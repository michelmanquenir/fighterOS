import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { comparar } from '../../../api/boxeadores'
import { listarPeleas } from '../../../api/eventos'
import type { EventoPeleaResponse } from '../../../api/types'

function colorPuntaje(puntaje: number): 'success' | 'warning' | 'error' {
  if (puntaje >= 70) return 'success'
  if (puntaje >= 40) return 'warning'
  return 'error'
}

function CarteleraFila({ pelea, numero }: { pelea: EventoPeleaResponse; numero: number }) {
  const compararQuery = useQuery({
    queryKey: ['boxeadores', 'comparar', pelea.boxeadorAId, pelea.boxeadorBId],
    queryFn: () => comparar(pelea.boxeadorAId, pelea.boxeadorBId),
  })

  return (
    <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Typography variant="h5" color="text.secondary" sx={{ minWidth: 28, textAlign: 'center' }}>
        {numero}
      </Typography>
      <Avatar src={pelea.boxeadorAFotoUrl ?? undefined}>{pelea.boxeadorANombre.charAt(0)}</Avatar>
      <Typography variant="body2" sx={{ fontWeight: 700, flexGrow: 1 }}>
        {pelea.boxeadorANombre}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        vs
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, flexGrow: 1, textAlign: 'right' }}>
        {pelea.boxeadorBNombre}
      </Typography>
      <Avatar src={pelea.boxeadorBFotoUrl ?? undefined}>{pelea.boxeadorBNombre.charAt(0)}</Avatar>
      {compararQuery.data && (
        <Chip
          size="small"
          label={`${compararQuery.data.puntajeGeneral}%`}
          color={colorPuntaje(compararQuery.data.puntajeGeneral)}
          variant="outlined"
        />
      )}
    </Paper>
  )
}

export function CarteleraOficialCard({ eventoId }: { eventoId: string }) {
  const query = useQuery({
    queryKey: ['eventos', eventoId, 'peleas'],
    queryFn: () => listarPeleas(eventoId),
  })

  const confirmadas = (query.data ?? []).filter((p) => p.estadoConfirmacion === 'aceptada')

  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
          <EmojiEventsIcon color="secondary" />
          <Typography variant="h5">Cartelera oficial</Typography>
        </Stack>
        {confirmadas.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            La cartelera está publicada, pero todavía ninguna pelea tiene la confirmación de{' '}
            <strong>ambos</strong> gimnasios. En cuanto una pelea quede confirmada por los dos lados, aparecerá
            aquí automáticamente.
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {confirmadas.map((pelea, index) => (
              <CarteleraFila key={pelea.id} pelea={pelea} numero={index + 1} />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}
