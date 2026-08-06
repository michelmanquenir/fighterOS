import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { registrarUsuario } from '../api/auth'
import { listarRegiones } from '../api/catalogos'
import { extraerMensajeError } from '../api/errors'
import { useAuth } from '../auth/useAuth'

const schema = z.object({
  nombre: z.string().min(1, 'Requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  regionId: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function RegistroEspectadorPage() {
  const { login } = useAuth()
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
      registrarUsuario({
        nombre: values.nombre,
        email: values.email,
        password: values.password,
        regionId: values.regionId ? Number(values.regionId) : undefined,
      }),
    onSuccess: (response) => {
      login(response)
      navigate('/')
    },
  })

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto' }}>
      <Card>
        <CardContent>
          <Typography variant="h2" gutterBottom>
            Registro de espectador
          </Typography>
          <Stack
            component="form"
            spacing={2}
            onSubmit={handleSubmit((values) => mutation.mutate(values), enfocarPrimerError)}
          >
            {isSubmitted && Object.keys(errors).length > 0 && (
              <Alert severity="warning">Revisa los campos marcados en rojo antes de continuar.</Alert>
            )}
            <TextField
              label="Nombre completo"
              {...register('nombre')}
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
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
            <Controller
              name="regionId"
              control={control}
              render={({ field }) => (
                <TextField select label="Región" {...field}>
                  <MenuItem value="">Sin región</MenuItem>
                  {regionesQuery.data?.map((region) => (
                    <MenuItem key={region.id} value={region.id}>
                      {region.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
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
