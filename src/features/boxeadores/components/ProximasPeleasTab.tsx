import CircularProgress from '@mui/material/CircularProgress'
import { useQuery } from '@tanstack/react-query'
import { obtenerProximasPeleas } from '../../../api/boxeadores'
import { PeleaList } from './PeleaList'

export function ProximasPeleasTab({ boxeadorId }: { boxeadorId: string }) {
  const query = useQuery({
    queryKey: ['boxeador', boxeadorId, 'proximas-peleas'],
    queryFn: () => obtenerProximasPeleas(boxeadorId),
  })

  if (query.isLoading) return <CircularProgress />
  return <PeleaList peleas={query.data ?? []} />
}
