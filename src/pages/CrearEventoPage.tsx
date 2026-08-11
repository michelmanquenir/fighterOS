import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { crear } from '../api/eventos'
import { listarRegiones } from '../api/catalogos'
import { extraerMensajeError } from '../api/errors'
import { obtenerMisGimnasios } from '../api/gimnasios'

const schema = z.object({
  nombre: z.string().min(1, 'Requerido'),
  tipo: z.enum(['torneo', 'velada', 'exhibicion', 'campeonato']),
  fecha: z.string().min(1, 'Requerido'),
  lugar: z.string().optional(),
  regionId: z.string().optional(),
  gimnasioId: z.string().optional(),
  cuposTotales: z.string().optional(),
  reglamentoUrl: z.string().optional(),
  afichePosterUrl: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function CrearEventoPage() {
  const navigate = useNavigate()
  const regionesQuery = useQuery({ queryKey: ['catalogos', 'regiones'], queryFn: listarRegiones })
  const gimnasiosQuery = useQuery({ queryKey: ['gimnasios', 'mios'], queryFn: obtenerMisGimnasios })

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { tipo: 'velada', regionId: '', gimnasioId: '' },
  })

  useEffect(() => {
    if (gimnasiosQuery.data?.length === 1 && !getValues('gimnasioId')) {
      setValue('gimnasioId', gimnasiosQuery.data[0].id)
    }
  }, [gimnasiosQuery.data, getValues, setValue])

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      crear({
        nombre: values.nombre,
        tipo: values.tipo,
        fecha: values.fecha,
        lugar: values.lugar || undefined,
        regionId: values.regionId ? Number(values.regionId) : undefined,
        gimnasioId: values.gimnasioId || undefined,
        cuposTotales: values.cuposTotales ? Number(values.cuposTotales) : undefined,
        reglamentoUrl: values.reglamentoUrl || undefined,
        afichePosterUrl: values.afichePosterUrl || undefined,
      }),
    onSuccess: (evento) => {
      navigate(`/eventos/${evento.id}`)
    },
  })

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      <Card>
        <CardContent>
          <Typography variant="h2" gutterBottom>
            Crear evento
          </Typography>
          <Stack
            component="form"
            spacing={3}
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
          >
            {isSubmitted && Object.keys(errors).length > 0 && (
              <Alert severity="warning">Revisa los campos marcados en rojo antes de continuar.</Alert>
            )}
            <TextField
              label="Nombre del evento"
              {...register('nombre')}
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="tipo"
                  control={control}
                  render={({ field }) => (
                    <TextField select fullWidth label="Tipo" {...field}>
                      <MenuItem value="torneo">Torneo</MenuItem>
                      <MenuItem value="velada">Velada</MenuItem>
                      <MenuItem value="exhibicion">Exhibición</MenuItem>
                      <MenuItem value="campeonato">Campeonato</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Fecha"
                  type="date"
                  slotProps={{ inputLabel: { shrink: true } }}
                  {...register('fecha')}
                  error={!!errors.fecha}
                  helperText={errors.fecha?.message}
                />
              </Grid>
              {gimnasiosQuery.data && gimnasiosQuery.data.length > 1 && (
                <Grid size={12}>
                  <Controller
                    name="gimnasioId"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        select
                        fullWidth
                        label="Gimnasio organizador"
                        helperText="Tienes más de un gimnasio, elige cuál organiza este evento"
                        {...field}
                      >
                        <MenuItem value="">Selecciona un gimnasio</MenuItem>
                        {gimnasiosQuery.data.map((gimnasio) => (
                          <MenuItem key={gimnasio.id} value={gimnasio.id}>
                            {gimnasio.nombre}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              )}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Lugar" {...register('lugar')} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="regionId"
                  control={control}
                  render={({ field }) => (
                    <TextField select fullWidth label="Región" {...field}>
                      <MenuItem value="">Sin región</MenuItem>
                      {regionesQuery.data?.map((region) => (
                        <MenuItem key={region.id} value={String(region.id)}>
                          {region.nombre}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Cupos totales"
                  type="number"
                  {...register('cuposTotales')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="URL del afiche" {...register('afichePosterUrl')} />
              </Grid>
              <Grid size={12}>
                <TextField fullWidth label="URL del reglamento" {...register('reglamentoUrl')} />
              </Grid>
            </Grid>
            {mutation.isError && (
              <Alert severity="error">
                {extraerMensajeError(
                  mutation.error,
                  'No se pudo crear el evento. Verifica que tengas un gimnasio registrado.',
                )}
              </Alert>
            )}
            <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creando...' : 'Crear evento'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
