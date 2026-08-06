import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'

export function Section({
  children,
  sx,
}: {
  children: ReactNode
  sx?: SxProps<Theme>
}) {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, ...sx }}>
      <Container maxWidth="lg">{children}</Container>
    </Box>
  )
}
