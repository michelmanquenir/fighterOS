import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import type { BoxeadorResumenResponse } from '../../../api/types'
import { CategoriaChip } from './CategoriaChip'
import { EstadoChip } from './EstadoChip'

export function BoxeadorCard({ boxeador }: { boxeador: BoxeadorResumenResponse }) {
  const navigate = useNavigate()

  return (
    <Card>
      <CardActionArea onClick={() => navigate(`/boxeadores/${boxeador.id}`)}>
        <CardContent>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Avatar src={boxeador.fotoUrl ?? undefined} sx={{ width: 56, height: 56 }}>
              {boxeador.nombre.charAt(0)}
            </Avatar>
            <Stack spacing={0.5} sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="h6" noWrap>
                {boxeador.nombre}
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                <CategoriaChip nombre={boxeador.categoriaNombre} />
                <EstadoChip estado={boxeador.estadoDeportivo} />
              </Stack>
              {boxeador.gimnasioNombre && (
                <Typography variant="body2" color="text.secondary" noWrap>
                  {boxeador.gimnasioNombre}
                </Typography>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
