import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { CardHeading } from './CardHeading'
import { MultimediaTab } from './MultimediaTab'

export function MultimediaCard({ boxeadorId, esPropio }: { boxeadorId: string; esPropio: boolean }) {
  return (
    <Card>
      <CardContent>
        <CardHeading>Multimedia</CardHeading>
        <MultimediaTab boxeadorId={boxeadorId} esPropio={esPropio} />
      </CardContent>
    </Card>
  )
}
