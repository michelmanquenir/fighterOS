import { useRef, type ChangeEvent } from 'react'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { subirAvatar } from '../api/usuarios'

interface AvatarUploadButtonProps {
  avatarUrl: string | null | undefined
  nombre: string
  size?: number
}

export function AvatarUploadButton({ avatarUrl, nombre, size = 40 }: AvatarUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (file: File) => subirAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios', 'me'] })
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
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <IconButton
            size="small"
            onClick={() => inputRef.current?.click()}
            disabled={mutation.isPending}
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              width: 22,
              height: 22,
              '&:hover': { bgcolor: 'background.paper' },
            }}
            aria-label="Cambiar foto de perfil"
          >
            {mutation.isPending ? (
              <CircularProgress size={12} />
            ) : (
              <PhotoCameraIcon sx={{ fontSize: 12 }} />
            )}
          </IconButton>
        }
      >
        <Avatar src={avatarUrl ?? undefined} sx={{ width: size, height: size }}>
          {nombre.charAt(0).toUpperCase()}
        </Avatar>
      </Badge>
    </>
  )
}
