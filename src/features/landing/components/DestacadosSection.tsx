import VerifiedIcon from '@mui/icons-material/Verified'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import { Section } from './Section'

export function DestacadosSection() {
  return (
    <Section>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Box
              sx={{
                aspectRatio: '16 / 9',
                background: 'linear-gradient(135deg, #1a1a1f, #0B0B0D)',
              }}
            />
            <Stack spacing={2} sx={{ p: 3 }}>
              <Typography variant="overline" color="text.secondary">
                Gimnasio destacado
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography variant="h4">Club Santiago</Typography>
                <VerifiedIcon color="primary" fontSize="small" />
              </Stack>
              <Stack direction="row" spacing={4}>
                <Stack spacing={0}>
                  <Typography variant="h5">42</Typography>
                  <Typography variant="caption" color="text.secondary">Boxeadores</Typography>
                </Stack>
                <Stack spacing={0}>
                  <Typography variant="h5">7</Typography>
                  <Typography variant="caption" color="text.secondary">Campeones</Typography>
                </Stack>
                <Stack spacing={0}>
                  <Typography variant="h5">18</Typography>
                  <Typography variant="caption" color="text.secondary">Eventos</Typography>
                </Stack>
              </Stack>
              <Button component={RouterLink} to="/boxeadores" variant="outlined" color="primary" sx={{ alignSelf: 'flex-start' }}>
                Ver boxeadores
              </Button>
            </Stack>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Box
              sx={{
                aspectRatio: '16 / 9',
                background: 'linear-gradient(135deg, #1c0f0f, #0B0B0D)',
              }}
            />
            <Stack spacing={2} sx={{ p: 3 }}>
              <Typography variant="overline" color="text.secondary">
                Peleador destacado
              </Typography>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Avatar sx={{ width: 56, height: 56 }}>C</Avatar>
                <Stack spacing={0}>
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                    <Typography variant="h5">Carlos Herrera</Typography>
                    <VerifiedIcon color="primary" fontSize="small" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Club Renca · 71 kg
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={4}>
                <Stack spacing={0}>
                  <Typography variant="h5">14-2-0</Typography>
                  <Typography variant="caption" color="text.secondary">Récord</Typography>
                </Stack>
                <Stack spacing={0}>
                  <Typography variant="h5">KO R2</Typography>
                  <Typography variant="caption" color="text.secondary">Última victoria</Typography>
                </Stack>
              </Stack>
              <Button component={RouterLink} to="/boxeadores" variant="outlined" color="primary" sx={{ alignSelf: 'flex-start' }}>
                Ver boxeadores
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Section>
  )
}
