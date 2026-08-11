import { apiClient } from './client'
import type { GimnasioCreateRequest, GimnasioMioResponse } from './types'

export async function crearGimnasio(request: GimnasioCreateRequest): Promise<GimnasioMioResponse> {
  const { data } = await apiClient.post<GimnasioMioResponse>('/api/gimnasios', request)
  return data
}

export async function obtenerMisGimnasios(): Promise<GimnasioMioResponse[]> {
  const { data } = await apiClient.get<GimnasioMioResponse[]>('/api/gimnasios/mios')
  return data
}
