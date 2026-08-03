import CircularProgress from '@mui/material/CircularProgress'
import { useQuery } from '@tanstack/react-query'
import { obtenerHistorial } from '../../../api/boxeadores'
import { PeleaList } from './PeleaList'

export function HistorialTab({ boxeadorId }: { boxeadorId: string }) {
  const query = useQuery({
    queryKey: ['boxeador', boxeadorId, 'historial'],
    queryFn: () => obtenerHistorial(boxeadorId),
  })

  if (query.isLoading) return <CircularProgress />
  return <PeleaList peleas={query.data ?? []} />
}
