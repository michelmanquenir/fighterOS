import type { ChangeEvent } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listarCategoriasPeso, listarRegiones } from '../../../api/catalogos'
import { extraerMensajeError } from '../../../api/errors'
import { crearAlumno } from '../../../api/gimnasios'
import { encontrarCategoriaPorPeso } from '../../boxeadores/utils/categoriaPeso'

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
  regionId: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  gimnasioId: string
  open: boolean
  onClose: () => void
}

export function CrearAlumnoDialog({ gimnasioId, open, onClose }: Props) {
  const queryClient = useQueryClient()
  const regionesQuery = useQuery({ queryKey: ['catalogos', 'regiones'], queryFn: listarRegiones })
  const categoriasQuery = useQuery({ queryKey: ['catalogos', 'categorias-peso'], queryFn: listarCategoriasPeso })

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { sexo: 'M', categoriaId: '', regionId: '' },
  })

  function handlePesoHabitualChange(valor: string) {
    const peso = Number(valor)
    if (!valor || Number.isNaN(peso)) return
    const categoria = encontrarCategoriaPorPeso(categoriasQuery.data, peso, getValues('sexo'))
    if (categoria) {
      setValue('categoriaId', categoria.id)
    }
  }

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      crearAlumno(gimnasioId, {
        nombre: values.nombre,
        email: values.email,
        password: values.password,
        rut: values.rut,
        fechaNacimiento: values.fechaNacimiento,
        sexo: values.sexo,
        pesoActual: values.pesoActual ? Number(values.pesoActual) : undefined,
        pesoHabitual: values.pesoHabitual ? Number(values.pesoHabitual) : undefined,
        categoriaId: values.categoriaId || undefined,
        regionId: values.regionId ? Number(values.regionId) : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boxeadores', 'gimnasio', gimnasioId] })
      reset()
      onClose()
    },
  })

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear alumno</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Crea una cuenta nueva para tu alumno. Quedará registrado en la plataforma con este correo y
            contraseña, y ya asignado a tu gimnasio.
          </Typography>
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
                {...register('pesoHabitual', {
                  onChange: (event: ChangeEvent<HTMLInputElement>) =>
                    handlePesoHabitualChange(event.target.value),
                })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="categoriaId"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Categoría"
                    helperText="Se sugiere según el peso habitual, puedes cambiarla"
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
          </Grid>
          {mutation.isError && (
            <Alert severity="error">
              {extraerMensajeError(mutation.error, 'No se pudo crear el alumno. Revisa los datos.')}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          disabled={mutation.isPending}
          onClick={handleSubmit((values) => mutation.mutate(values))}
        >
          {mutation.isPending ? 'Creando...' : 'Crear alumno'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
