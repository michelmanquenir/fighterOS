import { useRef, type ChangeEvent } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { subirFoto } from '../../../api/boxeadores'

export function FotoUploadButton({ boxeadorId }: { boxeadorId: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (file: File) => subirFoto(boxeadorId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boxeador', boxeadorId] })
    },
  })

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      mutation.mutate(file)
    }
    event.target.value = ''
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={handleChange}
      />
      <IconButton
        onClick={() => inputRef.current?.click()}
        disabled={mutation.isPending}
        color="primary"
        sx={{ border: '1px solid', borderColor: 'divider' }}
        aria-label="Cambiar foto"
      >
        {mutation.isPending ? <CircularProgress size={20} /> : <PhotoCameraIcon />}
      </IconButton>
    </>
  )
}
