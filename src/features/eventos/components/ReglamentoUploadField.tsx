import { useRef, type ChangeEvent } from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import { useMutation } from '@tanstack/react-query'
import { subirArchivo } from '../../../api/eventos'

interface Props {
  value: string
  onChange: (url: string) => void
}

export function ReglamentoUploadField({ value, onChange }: Props) {
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
      <input ref={inputRef} type="file" accept="application/pdf" hidden onChange={handleChange} />
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={mutation.isPending ? <CircularProgress size={16} /> : <UploadFileIcon />}
          onClick={() => inputRef.current?.click()}
          disabled={mutation.isPending}
        >
          {value ? 'Cambiar reglamento' : 'Subir reglamento'}
        </Button>
        {value && (
          <Button component="a" href={value} target="_blank" rel="noopener" size="small">
            Ver reglamento actual
          </Button>
        )}
      </Stack>
      {mutation.isError && <Alert severity="error">No se pudo subir el archivo. Debe ser un PDF.</Alert>}
    </Stack>
  )
}
