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
import { extraerMensajeError } from '../api/errors'
import { listarRegiones } from '../api/catalogos'
import { crearGimnasio } from '../api/gimnasios'
import { useAuth } from '../auth/useAuth'

const schema = z.object({
  nombre: z.string().min(1, 'Requerido'),
  direccion: z.string().optional(),
  regionId: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  descripcion: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function CrearGimnasioPage() {
  const { actualizarRoles } = useAuth()
  const navigate = useNavigate()
  const regionesQuery = useQuery({ queryKey: ['catalogos', 'regiones'], queryFn: listarRegiones })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { regionId: '' } })

  function enfocarPrimerError(fieldErrors: typeof errors) {
    const primerCampo = Object.keys(fieldErrors)[0]
    if (!primerCampo) return
    const el = document.querySelector<HTMLElement>(`[name="${primerCampo}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el?.focus()
  }

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      crearGimnasio({
        nombre: values.nombre,
        direccion: values.direccion || undefined,
        regionId: values.regionId ? Number(values.regionId) : undefined,
        telefono: values.telefono || undefined,
        email: values.email || undefined,
        descripcion: values.descripcion || undefined,
      }),
    onSuccess: (response) => {
      actualizarRoles(response.roles)
      navigate('/eventos/mios')
    },
  })

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      <Card>
        <CardContent>
          <Typography variant="h2" gutterBottom>
            Crear mi gimnasio
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Tu cuenta se mantiene igual - solo se agrega el rol de dueño de gimnasio, además del que
            ya tienes.
          </Typography>
          <Stack
            component="form"
            spacing={3}
            onSubmit={handleSubmit((values) => mutation.mutate(values), enfocarPrimerError)}
          >
            {isSubmitted && Object.keys(errors).length > 0 && (
              <Alert severity="warning">Revisa los campos marcados en rojo antes de continuar.</Alert>
            )}
            <TextField
              label="Nombre del gimnasio"
              {...register('nombre')}
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Dirección" {...register('direccion')} />
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
                <TextField fullWidth label="Teléfono" {...register('telefono')} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email del gimnasio"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid size={12}>
                <TextField fullWidth multiline minRows={2} label="Descripción" {...register('descripcion')} />
              </Grid>
            </Grid>

            {mutation.isError && (
              <Alert severity="error">
                {extraerMensajeError(mutation.error, 'No se pudo crear el gimnasio.')}
              </Alert>
            )}
            <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creando...' : 'Crear gimnasio'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
