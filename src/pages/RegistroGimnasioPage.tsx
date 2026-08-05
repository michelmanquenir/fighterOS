import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { registrarGimnasio } from '../api/auth'
import { listarRegiones } from '../api/catalogos'
import { useAuth } from '../auth/useAuth'

const schema = z.object({
  nombreAdmin: z.string().min(1, 'Requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  nombreGimnasio: z.string().min(1, 'Requerido'),
  direccion: z.string().optional(),
  regionId: z.string().optional(),
  telefono: z.string().optional(),
  emailGimnasio: z.string().email('Email inválido').optional().or(z.literal('')),
  descripcion: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function RegistroGimnasioPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const regionesQuery = useQuery({ queryKey: ['catalogos', 'regiones'], queryFn: listarRegiones })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      registrarGimnasio({
        nombreAdmin: values.nombreAdmin,
        email: values.email,
        password: values.password,
        nombreGimnasio: values.nombreGimnasio,
        direccion: values.direccion || undefined,
        regionId: values.regionId ? Number(values.regionId) : undefined,
        telefono: values.telefono || undefined,
        emailGimnasio: values.emailGimnasio || undefined,
        descripcion: values.descripcion || undefined,
      }),
    onSuccess: (response) => {
      login(response)
      navigate('/eventos/mios')
    },
  })

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      <Card>
        <CardContent>
          <Typography variant="h2" gutterBottom>
            Registro de gimnasio
          </Typography>
          <Stack
            component="form"
            spacing={3}
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
          >
            <Stack spacing={2}>
              <Typography variant="h5">Tu cuenta</Typography>
              <TextField
                label="Nombre completo"
                {...register('nombreAdmin')}
                error={!!errors.nombreAdmin}
                helperText={errors.nombreAdmin?.message}
              />
              <TextField
                label="Email"
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                label="Contraseña"
                type="password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message ?? 'Mínimo 8 caracteres'}
              />
            </Stack>

            <Divider />

            <Stack spacing={2}>
              <Typography variant="h5">Tu gimnasio</Typography>
              <TextField
                label="Nombre del gimnasio"
                {...register('nombreGimnasio')}
                error={!!errors.nombreGimnasio}
                helperText={errors.nombreGimnasio?.message}
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
                          <MenuItem key={region.id} value={region.id}>
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
                    {...register('emailGimnasio')}
                    error={!!errors.emailGimnasio}
                    helperText={errors.emailGimnasio?.message}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    label="Descripción"
                    {...register('descripcion')}
                  />
                </Grid>
              </Grid>
            </Stack>

            {mutation.isError && (
              <Alert severity="error">No se pudo completar el registro. Revisa los datos.</Alert>
            )}
            <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
              {mutation.isPending ? 'Registrando...' : 'Registrar gimnasio'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
