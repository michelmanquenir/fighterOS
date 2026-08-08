import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import {
  obtenerCampeonatos,
  obtenerMedallas,
  obtenerPatrocinios,
  obtenerPesosPactados,
} from '../../../api/boxeadores'
import { CardHeading } from './CardHeading'
import { PesoPactadoDialog } from './PesoPactadoDialog'

const MEDALLA_COLOR: Record<string, string> = {
  oro: '#C9A227',
  plata: '#C0C0C0',
  bronce: '#CD7F32',
}

function ResumenTile({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <Stack spacing={0.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
      <Stack sx={{ color: 'text.secondary' }}>{icon}</Stack>
      <Typography variant="h6" color="primary">
        {value}
      </Typography>
      <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
        {label}
      </Typography>
    </Stack>
  )
}

export function PalmaresResumenCard({ boxeadorId, esPropio }: { boxeadorId: string; esPropio: boolean }) {
  const [pesoDialogOpen, setPesoDialogOpen] = useState(false)

  const campeonatosQuery = useQuery({
    queryKey: ['boxeador', boxeadorId, 'campeonatos'],
    queryFn: () => obtenerCampeonatos(boxeadorId),
  })
  const medallasQuery = useQuery({
    queryKey: ['boxeador', boxeadorId, 'medallas'],
    queryFn: () => obtenerMedallas(boxeadorId),
  })
  const patrociniosQuery = useQuery({
    queryKey: ['boxeador', boxeadorId, 'patrocinios'],
    queryFn: () => obtenerPatrocinios(boxeadorId),
  })
  const pesosPactadosQuery = useQuery({
    queryKey: ['boxeador', boxeadorId, 'pesos-pactados'],
    queryFn: () => obtenerPesosPactados(boxeadorId),
  })

  const cargando = campeonatosQuery.isLoading || medallasQuery.isLoading
  const campeonatos = campeonatosQuery.data ?? []
  const medallas = medallasQuery.data ?? []
  const patrocinios = patrociniosQuery.data ?? []
  const pesosPactados = pesosPactadosQuery.data ?? []

  return (
    <Card>
      <CardContent>
        <CardHeading>Palmarés</CardHeading>

        {cargando ? (
          <CircularProgress size={20} />
        ) : campeonatos.length === 0 && medallas.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            Sin logros registrados todavía.
          </Typography>
        ) : (
          <Stack spacing={2}>
            <Grid container spacing={1}>
              <Grid size={6}>
                <ResumenTile icon={<EmojiEventsIcon fontSize="small" />} value={campeonatos.length} label="Campeonatos" />
              </Grid>
              <Grid size={6}>
                <ResumenTile icon={<MilitaryTechIcon fontSize="small" />} value={medallas.length} label="Medallas" />
              </Grid>
            </Grid>

            {campeonatos.length > 0 && (
              <List disablePadding>
                {campeonatos.map((campeonato) => (
                  <ListItem key={campeonato.id} divider sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36, color: 'secondary.main' }}>
                      <WorkspacePremiumIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={campeonato.titulo}
                      secondary={[campeonato.categoriaNombre, campeonato.ligaNombre].filter(Boolean).join(' · ')}
                    />
                    {campeonato.vigente && <Chip size="small" label="Vigente" color="secondary" />}
                  </ListItem>
                ))}
              </List>
            )}

            {medallas.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {medallas.map((medalla) => (
                  <Chip
                    key={medalla.id}
                    label={medalla.nombre}
                    sx={{ bgcolor: MEDALLA_COLOR[medalla.tipo], color: '#0B0B0D', fontWeight: 700 }}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        )}

        {patrocinios.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="overline" color="text.secondary">
              Patrocinios
            </Typography>
            <List disablePadding>
              {patrocinios.map((patrocinio) => (
                <ListItem key={patrocinio.id} divider sx={{ px: 0 }}>
                  <ListItemText primary={patrocinio.patrocinadorNombre} secondary={patrocinio.descripcion} />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {(pesosPactados.length > 0 || esPropio) && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="overline" color="text.secondary">
              Pesos pactados
            </Typography>
            {pesosPactados.length > 0 ? (
              <List disablePadding>
                {pesosPactados.map((peso) => (
                  <ListItem key={peso.id} divider sx={{ px: 0 }}>
                    <ListItemText
                      primary={`${peso.pesoPactado} kg`}
                      secondary={new Date(peso.createdAt).toLocaleDateString('es-CL')}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary" variant="body2">
                Sin pesos pactados registrados.
              </Typography>
            )}
            {esPropio && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setPesoDialogOpen(true)}
                sx={{ mt: 1 }}
              >
                Registrar peso pactado
              </Button>
            )}
          </>
        )}

        <PesoPactadoDialog boxeadorId={boxeadorId} open={pesoDialogOpen} onClose={() => setPesoDialogOpen(false)} />
      </CardContent>
    </Card>
  )
}
