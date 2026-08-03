import Chip from '@mui/material/Chip'

export function CategoriaChip({ nombre }: { nombre: string | null }) {
  if (!nombre) return null
  return <Chip label={nombre} color="secondary" size="small" variant="outlined" />
}
