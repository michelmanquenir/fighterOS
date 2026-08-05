import Chip from '@mui/material/Chip'
import type { EstadoEventoEnum } from '../../../api/types'

const CONFIG: Record<
  EstadoEventoEnum,
  { label: string; color: 'default' | 'success' | 'warning' | 'error' | 'info' }
> = {
  planificado: { label: 'Planificado', color: 'default' },
  inscripciones_abiertas: { label: 'Inscripciones abiertas', color: 'success' },
  en_curso: { label: 'En curso', color: 'info' },
  finalizado: { label: 'Finalizado', color: 'default' },
  cancelado: { label: 'Cancelado', color: 'error' },
}

export function EstadoEventoChip({ estado }: { estado: EstadoEventoEnum }) {
  const { label, color } = CONFIG[estado]
  return <Chip label={label} color={color} size="small" />
}
