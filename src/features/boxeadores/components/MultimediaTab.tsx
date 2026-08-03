import { useState } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { obtenerMultimedia } from '../../../api/boxeadores'
import { MultimediaUploadDialog } from './MultimediaUploadDialog'

interface Props {
  boxeadorId: string
  esPropio: boolean
}

export function MultimediaTab({ boxeadorId, esPropio }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const query = useQuery({
    queryKey: ['boxeador', boxeadorId, 'multimedia'],
    queryFn: () => obtenerMultimedia(boxeadorId),
  })

  return (
    <Stack spacing={2}>
      {esPropio && (
        <Button
          variant="outlined"
          startIcon={<AddPhotoAlternateIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ alignSelf: 'flex-start' }}
        >
          Subir foto o video
        </Button>
      )}

      {query.data && query.data.length > 0 ? (
        <Grid container spacing={2}>
          {query.data.map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                {item.tipo === 'foto' ? (
                  <CardMedia component="img" image={item.url} alt="" sx={{ aspectRatio: '1 / 1', objectFit: 'cover' }} />
                ) : (
                  <CardMedia component="video" src={item.url} controls sx={{ aspectRatio: '16 / 9' }} />
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color="text.secondary">Sin fotos o videos todavía.</Typography>
      )}

      <MultimediaUploadDialog
        boxeadorId={boxeadorId}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </Stack>
  )
}
