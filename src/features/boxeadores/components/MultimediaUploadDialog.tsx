import { useState, type ChangeEvent } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { agregarMultimedia } from '../../../api/boxeadores'
import type { TipoMultimediaEnum } from '../../../api/types'

interface Props {
  boxeadorId: string
  open: boolean
  onClose: () => void
}

export function MultimediaUploadDialog({ boxeadorId, open, onClose }: Props) {
  const [tipo, setTipo] = useState<TipoMultimediaEnum>('foto')
  const [archivo, setArchivo] = useState<File | null>(null)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => {
      if (!archivo) {
        throw new Error('Selecciona un archivo')
      }
      return agregarMultimedia(boxeadorId, archivo, tipo)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boxeador', boxeadorId, 'multimedia'] })
      setArchivo(null)
      onClose()
    },
  })

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setArchivo(event.target.files?.[0] ?? null)
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Subir foto o video</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        <TextField
          select
          label="Tipo"
          value={tipo}
          onChange={(event) => setTipo(event.target.value as TipoMultimediaEnum)}
        >
          <MenuItem value="foto">Foto</MenuItem>
          <MenuItem value="video">Video</MenuItem>
        </TextField>
        <Button component="label" variant="outlined">
          {archivo ? archivo.name : 'Elegir archivo'}
          <input
            type="file"
            hidden
            accept={tipo === 'foto' ? 'image/*' : 'video/*'}
            onChange={handleFileChange}
          />
        </Button>
        {mutation.isError && (
          <Typography color="error" variant="body2">
            No se pudo subir el archivo.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          disabled={!archivo || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          Subir
        </Button>
      </DialogActions>
    </Dialog>
  )
}
