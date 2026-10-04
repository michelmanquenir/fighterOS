import ConstructionIcon from '@mui/icons-material/Construction'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export function ProximamentePage({ titulo }: { titulo: string }) {
  return (
    <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center', py: 12 }}>
      <ConstructionIcon sx={{ fontSize: 48 }} color="disabled" />
      <Typography variant="h2">{titulo}</Typography>
      <Typography color="text.secondary">Esta sección está en construcción. Vuelve pronto.</Typography>
    </Stack>
  )
}
