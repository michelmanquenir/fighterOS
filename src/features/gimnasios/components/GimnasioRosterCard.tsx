import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PlaceIcon from '@mui/icons-material/Place'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listar as listarBoxeadores } from '../../../api/boxeadores'
import { quitarAlumno } from '../../../api/gimnasios'
import type { GimnasioMioResponse } from '../../../api/types'
import { BoxeadorCard } from '../../boxeadores/components/BoxeadorCard'
import { AgregarAlumnoDialog } from './AgregarAlumnoDialog'
import { CrearAlumnoDialog } from './CrearAlumnoDialog'

export function GimnasioRosterCard({ gimnasio }: { gimnasio: GimnasioMioResponse }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [crearDialogOpen, setCrearDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const rosterQuery = useQuery({
    queryKey: ['boxeadores', 'gimnasio', gimnasio.id],
    queryFn: () => listarBoxeadores({ gimnasioId: gimnasio.id }, 0),
  })

  const quitarMutation = useMutation({
    mutationFn: (boxeadorId: string) => quitarAlumno(gimnasio.id, boxeadorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boxeadores', 'gimnasio', gimnasio.id] })
    },
  })

  const alumnos = rosterQuery.data?.content ?? []

  return (
    <Card>
      <CardContent>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
          <Stack spacing={0.5}>
            <Typography variant="h5">{gimnasio.nombre}</Typography>
            {(gimnasio.direccion || gimnasio.regionNombre) && (
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <PlaceIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {[gimnasio.direccion, gimnasio.regionNombre].filter(Boolean).join(' · ')}
                </Typography>
              </Stack>
            )}
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" startIcon={<PersonAddAlt1Icon />} onClick={() => setDialogOpen(true)}>
              Agregar existente
            </Button>
            <Button size="small" variant="contained" startIcon={<PersonAddIcon />} onClick={() => setCrearDialogOpen(true)}>
              Crear alumno
            </Button>
          </Stack>
        </Stack>

        {rosterQuery.isLoading && <CircularProgress size={24} />}

        {!rosterQuery.isLoading && alumnos.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Todavía no tienes alumnos en este gimnasio.
          </Typography>
        )}

        <Grid container spacing={2}>
          {alumnos.map((boxeador) => (
            <Grid key={boxeador.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box sx={{ position: 'relative' }}>
                <BoxeadorCard boxeador={boxeador} />
                <IconButton
                  size="small"
                  disabled={quitarMutation.isPending}
                  onClick={() => quitarMutation.mutate(boxeador.id)}
                  aria-label="Quitar del gimnasio"
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>

      <AgregarAlumnoDialog
        gimnasioId={gimnasio.id}
        alumnosActualesIds={alumnos.map((a) => a.id)}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
      <CrearAlumnoDialog gimnasioId={gimnasio.id} open={crearDialogOpen} onClose={() => setCrearDialogOpen(false)} />
    </Card>
  )
}
