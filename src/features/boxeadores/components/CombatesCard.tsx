import { useState } from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useQuery } from '@tanstack/react-query'
import { obtenerHistorial, obtenerProximasPeleas } from '../../../api/boxeadores'
import { CardHeading } from './CardHeading'
import { PeleaList } from './PeleaList'

type Vista = 'recientes' | 'proximas'
const LIMITE_RECIENTES = 3

export function CombatesCard({ boxeadorId }: { boxeadorId: string }) {
  const [vista, setVista] = useState<Vista>('recientes')
  const [verTodas, setVerTodas] = useState(false)

  const historialQuery = useQuery({
    queryKey: ['boxeador', boxeadorId, 'historial'],
    queryFn: () => obtenerHistorial(boxeadorId),
    enabled: vista === 'recientes',
  })
  const proximasQuery = useQuery({
    queryKey: ['boxeador', boxeadorId, 'proximas-peleas'],
    queryFn: () => obtenerProximasPeleas(boxeadorId),
    enabled: vista === 'proximas',
  })

  const query = vista === 'recientes' ? historialQuery : proximasQuery
  const peleas = query.data ?? []
  const mostrar = vista === 'recientes' && !verTodas ? peleas.slice(0, LIMITE_RECIENTES) : peleas

  return (
    <Card>
      <CardContent>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <CardHeading>Combates</CardHeading>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={vista}
            onChange={(_event, value: Vista | null) => {
              if (value) {
                setVista(value)
                setVerTodas(false)
              }
            }}
          >
            <ToggleButton value="recientes">Recientes</ToggleButton>
            <ToggleButton value="proximas">Próximas</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {query.isLoading ? (
          <CircularProgress size={20} />
        ) : (
          <>
            <PeleaList peleas={mostrar} />
            {vista === 'recientes' && peleas.length > LIMITE_RECIENTES && (
              <Button size="small" fullWidth onClick={() => setVerTodas((v) => !v)} sx={{ mt: 1 }}>
                {verTodas ? 'Ver menos' : 'Ver historial completo'}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
