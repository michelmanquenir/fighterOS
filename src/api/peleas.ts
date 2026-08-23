import { apiClient } from './client'
import type { PeleaPendienteResponse } from './types'

export async function misPeleasPendientes(): Promise<PeleaPendienteResponse[]> {
  const { data } = await apiClient.get<PeleaPendienteResponse[]>('/api/peleas/mias-pendientes')
  return data
}
