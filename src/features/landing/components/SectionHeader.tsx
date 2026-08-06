import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'

export function SectionHeader({
  title,
  actionLabel,
  actionTo,
}: {
  title: string
  actionLabel?: string
  actionTo?: string
}) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}
    >
      <Typography variant="h3">{title}</Typography>
      {actionLabel && actionTo && (
        <Stack
          component={RouterLink}
          to={actionTo}
          direction="row"
          spacing={0.5}
          sx={{ alignItems: 'center', textDecoration: 'none', color: 'primary.main', flexShrink: 0 }}
        >
          <Typography variant="button" color="primary" sx={{ fontWeight: 700 }}>
            {actionLabel}
          </Typography>
          <ArrowForwardIcon fontSize="small" color="primary" />
        </Stack>
      )}
    </Stack>
  )
}
