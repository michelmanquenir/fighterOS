import FacebookIcon from '@mui/icons-material/Facebook'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import XIcon from '@mui/icons-material/X'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'

export function CompartirEventoButtons({ nombre }: { nombre: string }) {
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const texto = `${nombre} - FighterOS`

  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="Compartir en WhatsApp">
        <IconButton
          size="small"
          href={`https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`}
          target="_blank"
          rel="noopener"
        >
          <WhatsAppIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Compartir en Facebook">
        <IconButton
          size="small"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener"
        >
          <FacebookIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Compartir en X">
        <IconButton
          size="small"
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(texto)}`}
          target="_blank"
          rel="noopener"
        >
          <XIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  )
}
