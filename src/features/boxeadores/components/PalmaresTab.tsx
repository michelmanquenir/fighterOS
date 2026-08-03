import { useState, type ReactNode } from 'react'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import {
  obtenerCampeonatos,
  obtenerCopas,
  obtenerMedallas,
  obtenerPatrocinios,
  obtenerPesosPactados,
} from '../../../api/boxeadores'
import { PesoPactadoDialog } from './PesoPactadoDialog'

const MEDALLA_COLOR: Record<string, string> = {
  oro: '#C9A227',
  plata: '#C0C0C0',
  bronce: '#CD7F32',
}

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <Stack spacing={1.5} sx={{ mb: 4 }}>
      <Typography variant="h5">{titulo}</Typography>
      {children}
    </Stack>
  )
}

interface Props {
  boxeadorId: string
  esPropio: boolean
}

export function PalmaresTab({ boxeadorId, esPropio }: Props) {
  const [pesoDialogOpen, setPesoDialogOpen] = useState(false)

  const medallasQuery = useQuery({
    queryKey: ['boxeador', boxeadorId, 'medallas'],
    queryFn: () => obtenerMedallas(boxeadorId),
  })
  const copasQuery = useQuery({
    queryKey: ['boxeador', boxeadorId, 'copas'],
    queryFn: () => obtenerCopas(boxeadorId),
  })
  const campeonatosQuery = useQuery({
    queryKey: ['boxeador', boxeadorId, 'campeonatos'],
    queryFn: () => obtenerCampeonatos(boxeadorId),
  })
  const patrociniosQuery = useQuery({
    queryKey: ['boxeador', boxeadorId, 'patrocinios'],
    queryFn: () => obtenerPatrocinios(boxeadorId),
  })
  const pesosPactadosQuery = useQuery({
    queryKey: ['boxeador', boxeadorId, 'pesos-pactados'],
    queryFn: () => obtenerPesosPactados(boxeadorId),
  })

  return (
    <>
      <Seccion titulo="Medallas">
        {medallasQuery.data && medallasQuery.data.length > 0 ? (
          <Grid container spacing={1}>
            {medallasQuery.data.map((medalla) => (
              <Grid key={medalla.id}>
                <Chip
                  label={`${medalla.nombre} · ${medalla.tipo}`}
                  sx={{ bgcolor: MEDALLA_COLOR[medalla.tipo], color: '#0B0B0D', fontWeight: 700 }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">Sin medallas registradas.</Typography>
        )}
      </Seccion>

      <Seccion titulo="Copas">
        {copasQuery.data && copasQuery.data.length > 0 ? (
          <List disablePadding>
            {copasQuery.data.map((copa) => (
              <ListItem key={copa.id} divider>
                <ListItemText
                  primary={copa.nombre}
                  secondary={new Date(copa.fecha).toLocaleDateString('es-CL')}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary">Sin copas registradas.</Typography>
        )}
      </Seccion>

      <Seccion titulo="Campeonatos">
        {campeonatosQuery.data && campeonatosQuery.data.length > 0 ? (
          <List disablePadding>
            {campeonatosQuery.data.map((campeonato) => (
              <ListItem
                key={campeonato.id}
                divider
                secondaryAction={
                  campeonato.vigente ? <Chip size="small" label="Vigente" color="secondary" /> : null
                }
              >
                <ListItemText
                  primary={campeonato.titulo}
                  secondary={[campeonato.ligaNombre, campeonato.categoriaNombre]
                    .filter(Boolean)
                    .join(' · ')}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary">Sin campeonatos registrados.</Typography>
        )}
      </Seccion>

      <Seccion titulo="Patrocinios">
        {patrociniosQuery.data && patrociniosQuery.data.length > 0 ? (
          <List disablePadding>
            {patrociniosQuery.data.map((patrocinio) => (
              <ListItem key={patrocinio.id} divider>
                <ListItemText
                  primary={patrocinio.patrocinadorNombre}
                  secondary={patrocinio.descripcion}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary">Sin patrocinios registrados.</Typography>
        )}
      </Seccion>

      <Seccion titulo="Pesos pactados">
        {pesosPactadosQuery.data && pesosPactadosQuery.data.length > 0 ? (
          <List disablePadding>
            {pesosPactadosQuery.data.map((peso) => (
              <ListItem key={peso.id} divider>
                <ListItemText
                  primary={`${peso.pesoPactado} kg`}
                  secondary={new Date(peso.createdAt).toLocaleDateString('es-CL')}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary" sx={{ mb: esPropio ? 1 : 0 }}>
            Sin pesos pactados registrados.
          </Typography>
        )}
        {esPropio && (
          <Button variant="outlined" size="small" onClick={() => setPesoDialogOpen(true)} sx={{ alignSelf: 'flex-start' }}>
            Registrar peso pactado
          </Button>
        )}
      </Seccion>

      <PesoPactadoDialog
        boxeadorId={boxeadorId}
        open={pesoDialogOpen}
        onClose={() => setPesoDialogOpen(false)}
      />
    </>
  )
}
