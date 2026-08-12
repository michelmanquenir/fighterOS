import { useRef, type ChangeEvent } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import { useMutation } from '@tanstack/react-query'
import { subirArchivo } from '../../../api/eventos'

interface Props {
  value: string
  onChange: (url: string) => void
}

export function AficheUploadField({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const mutation = useMutation({
    mutationFn: (archivo: File) => subirArchivo(archivo),
    onSuccess: (data) => onChange(data.url),
  })

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const archivo = event.target.files?.[0]
    if (archivo) {
      mutation.mutate(archivo)
    }
    event.target.value = ''
  }

  return (
    <Stack spacing={1}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={handleChange}
      />
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        {value && (
          <Box
            component="img"
            src={value}
            alt="Afiche"
            sx={{
              width: 56,
              height: 56,
              objectFit: 'cover',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
        )}
        <Button
          variant="outlined"
          startIcon={mutation.isPending ? <CircularProgress size={16} /> : <AddPhotoAlternateIcon />}
          onClick={() => inputRef.current?.click()}
          disabled={mutation.isPending}
        >
          {value ? 'Cambiar afiche' : 'Subir afiche'}
        </Button>
      </Stack>
      {mutation.isError && <Alert severity="error">No se pudo subir la imagen.</Alert>}
    </Stack>
  )
}
