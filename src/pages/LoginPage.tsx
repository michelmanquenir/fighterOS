import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation } from '@tanstack/react-query'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import { login as loginRequest } from '../api/auth'
import { useAuth } from '../auth/useAuth'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sesionExpirada = searchParams.get('expirada') === '1'
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (response) => {
      login(response)
      navigate('/boxeadores')
    },
  })

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto' }}>
      <Card>
        <CardContent>
          <Typography variant="h2" gutterBottom>
            Entrar
          </Typography>
          <Stack component="form" spacing={2} onSubmit={handleSubmit((values) => mutation.mutate(values))}>
            {sesionExpirada && (
              <Alert severity="info">Tu sesión expiró. Inicia sesión de nuevo.</Alert>
            )}
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
              helperText={errors.password?.message}
            />
            {mutation.isError && <Alert severity="error">Email o contraseña incorrectos.</Alert>}
            <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
              {mutation.isPending ? 'Entrando...' : 'Entrar'}
            </Button>
            <Typography variant="body2" color="text.secondary">
              ¿No tienes cuenta? <RouterLink to="/registro">Regístrate</RouterLink>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
