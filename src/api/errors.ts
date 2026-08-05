import { isAxiosError } from 'axios'

export function extraerMensajeError(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { error?: string } | undefined
    if (data?.error) {
      return data.error
    }
    if (error.code === 'ERR_NETWORK') {
      return 'No se pudo conectar con el servidor. Intenta de nuevo en un momento.'
    }
  }
  return fallback
}
