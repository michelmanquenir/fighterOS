import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { registrarPesoPactado } from '../../../api/boxeadores'

interface Props {
  boxeadorId: string
  open: boolean
  onClose: () => void
}

export function PesoPactadoDialog({ boxeadorId, open, onClose }: Props) {
  const [peso, setPeso] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => registrarPesoPactado(boxeadorId, { pesoPactado: Number(peso) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boxeador', boxeadorId, 'pesos-pactados'] })
      setPeso('')
      onClose()
    },
  })

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Registrar peso pactado</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          label="Peso pactado (kg)"
          type="number"
          fullWidth
          value={peso}
          onChange={(event) => setPeso(event.target.value)}
          slotProps={{ htmlInput: { step: '0.1', min: 0 } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          disabled={!peso || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
