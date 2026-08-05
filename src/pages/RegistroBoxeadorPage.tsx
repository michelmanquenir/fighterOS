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
import { registrarBoxeador } from '../api/auth'
import { listarCategoriasPeso, listarGimnasios, listarRegiones } from '../api/catalogos'
import { extraerMensajeError } from '../api/errors'
import { useAuth } from '../auth/useAuth'

const schema = z.object({
  nombre: z.string().min(1, 'Requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  rut: z.string().min(1, 'Requerido'),
  fechaNacimiento: z.string().min(1, 'Requerido'),
  sexo: z.enum(['M', 'F']),
  pesoActual: z.string().optional(),
  pesoHabitual: z.string().optional(),
  categoriaId: z.string().optional(),
  gimnasioId: z.string().optional(),
  regionId: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function RegistroBoxeadorPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const regionesQuery = useQuery({ queryKey: ['catalogos', 'regiones'], queryFn: listarRegiones })
  const categoriasQuery = useQuery({
    queryKey: ['catalogos', 'categorias-peso'],
    queryFn: listarCategoriasPeso,
  })
  const gimnasiosQuery = useQuery({
    queryKey: ['catalogos', 'gimnasios'],
    queryFn: listarGimnasios,
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { sexo: 'M', categoriaId: '', gimnasioId: '', regionId: '' },
  })

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      registrarBoxeador({
        nombre: values.nombre,
        email: values.email,
        password: values.password,
        rut: values.rut,
        fechaNacimiento: values.fechaNacimiento,
        sexo: values.sexo,
        pesoActual: values.pesoActual ? Number(values.pesoActual) : undefined,
        pesoHabitual: values.pesoHabitual ? Number(values.pesoHabitual) : undefined,
        categoriaId: values.categoriaId || undefined,
        gimnasioId: values.gimnasioId || undefined,
        regionId: values.regionId ? Number(values.regionId) : undefined,
      }),
    onSuccess: (response) => {
      login(response)
      navigate(`/boxeadores/${response.usuarioId}`)
    },
  })

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Card>
        <CardContent>
          <Typography variant="h2" gutterBottom>
            Registro Nacional de Boxeadores
          </Typography>
          <Stack
            component="form"
            spacing={3}
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
          >
            {isSubmitted && Object.keys(errors).length > 0 && (
              <Alert severity="warning">Revisa los campos marcados en rojo antes de continuar.</Alert>
            )}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Nombre completo"
                  {...register('nombre')}
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="RUT"
                  placeholder="12345678-9"
                  {...register('rut')}
                  error={!!errors.rut}
                  helperText={errors.rut?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  type="password"
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message ?? 'Mínimo 8 caracteres'}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Fecha de nacimiento"
                  type="date"
                  slotProps={{ inputLabel: { shrink: true } }}
                  {...register('fechaNacimiento')}
                  error={!!errors.fechaNacimiento}
                  helperText={errors.fechaNacimiento?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="sexo"
                  control={control}
                  render={({ field }) => (
                    <TextField select fullWidth label="Sexo" {...field}>
                      <MenuItem value="M">Masculino</MenuItem>
                      <MenuItem value="F">Femenino</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Peso actual (kg)"
                  type="number"
                  slotProps={{ htmlInput: { step: '0.1' } }}
                  {...register('pesoActual')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Peso habitual (kg)"
                  type="number"
                  slotProps={{ htmlInput: { step: '0.1' } }}
                  {...register('pesoHabitual')}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Controller
                  name="categoriaId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      select
                      fullWidth
                      label="Categoría"
                      helperText="Se asigna automático si no la eliges"
                      {...field}
                    >
                      <MenuItem value="">Auto-asignar</MenuItem>
                      {categoriasQuery.data?.map((categoria) => (
                        <MenuItem key={categoria.id} value={categoria.id}>
                          {categoria.nombre} ({categoria.sexo})
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Controller
                  name="gimnasioId"
                  control={control}
                  render={({ field }) => (
                    <TextField select fullWidth label="Gimnasio" {...field}>
                      <MenuItem value="">Sin gimnasio</MenuItem>
                      {gimnasiosQuery.data?.map((gimnasio) => (
                        <MenuItem key={gimnasio.id} value={gimnasio.id}>
                          {gimnasio.nombre}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
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
            </Grid>
            {mutation.isError && (
              <Alert severity="error">
                {extraerMensajeError(mutation.error, 'No se pudo completar el registro. Revisa los datos.')}
              </Alert>
            )}
            <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
              {mutation.isPending ? 'Registrando...' : 'Registrarme'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
