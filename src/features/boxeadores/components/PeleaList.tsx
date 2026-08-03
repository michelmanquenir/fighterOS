import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { PeleaResumenResponse, ResultadoBoxeador } from '../../../api/types'

const RESULTADO_CONFIG: Record<
  ResultadoBoxeador,
  { label: string; color: 'success' | 'error' | 'default' | 'warning' }
> = {
  victoria: { label: 'Victoria', color: 'success' },
  derrota: { label: 'Derrota', color: 'error' },
  empate: { label: 'Empate', color: 'default' },
  no_contest: { label: 'No Contest', color: 'warning' },
  cancelada: { label: 'Cancelada', color: 'default' },
}

const METODO_LABEL: Record<string, string> = {
  ko: 'KO',
  tko_rsc: 'TKO/RSC',
  decision_unanime: 'Decisión unánime',
  decision_dividida: 'Decisión dividida',
  wo: 'WO',
  descalificacion: 'Descalificación',
  no_contest: 'No Contest',
}

export function PeleaList({ peleas }: { peleas: PeleaResumenResponse[] }) {
  if (peleas.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 2 }}>
        No hay peleas para mostrar.
      </Typography>
    )
  }

  return (
    <List disablePadding>
      {peleas.map((pelea) => (
        <ListItem
          key={pelea.id}
          divider
          secondaryAction={
            pelea.resultadoBoxeador ? (
              <Chip
                size="small"
                label={RESULTADO_CONFIG[pelea.resultadoBoxeador].label}
                color={RESULTADO_CONFIG[pelea.resultadoBoxeador].color}
              />
            ) : null
          }
        >
          <ListItemText
            primary={`vs. ${pelea.rivalNombre}`}
            secondary={
              <Stack component="span" direction="row" spacing={1}>
                <span>{pelea.eventoNombre}</span>
                {pelea.fecha && <span>· {new Date(pelea.fecha).toLocaleDateString('es-CL')}</span>}
                {pelea.metodoVictoria && (
                  <span>· {METODO_LABEL[pelea.metodoVictoria] ?? pelea.metodoVictoria}</span>
                )}
              </Stack>
            }
          />
        </ListItem>
      ))}
    </List>
  )
}
