import Chip from '@mui/material/Chip'
import type { EstadoDeportivoEnum } from '../../../api/types'

const CONFIG: Record<
  EstadoDeportivoEnum,
  { label: string; color: 'success' | 'default' | 'warning' | 'error' }
> = {
  activo: { label: 'Activo', color: 'success' },
  retirado: { label: 'Retirado', color: 'default' },
  suspendido: { label: 'Suspendido', color: 'warning' },
  lesionado: { label: 'Lesionado', color: 'error' },
}

export function EstadoChip({ estado }: { estado: EstadoDeportivoEnum }) {
  const { label, color } = CONFIG[estado]
  return <Chip label={label} color={color} size="small" />
}
