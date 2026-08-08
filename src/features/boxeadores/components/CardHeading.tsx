import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export function CardHeading({ children }: { children: string }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="overline" sx={{ letterSpacing: '0.08em' }}>
        {children}
      </Typography>
      <Box sx={{ width: 32, height: 2, bgcolor: 'primary.main', mt: 0.5 }} />
    </Box>
  )
}
