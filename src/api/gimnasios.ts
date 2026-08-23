import { apiClient } from './client'
import type { GimnasioCreateRequest, GimnasioMioResponse, GimnasioResumenResponse } from './types'

export async function crearGimnasio(request: GimnasioCreateRequest): Promise<GimnasioMioResponse> {
  const { data } = await apiClient.post<GimnasioMioResponse>('/api/gimnasios', request)
  return data
}

export async function obtenerMisGimnasios(): Promise<GimnasioMioResponse[]> {
  const { data } = await apiClient.get<GimnasioMioResponse[]>('/api/gimnasios/mios')
  return data
}

export async function buscarGimnasios(q: string): Promise<GimnasioResumenResponse[]> {
  const { data } = await apiClient.get<GimnasioResumenResponse[]>('/api/gimnasios', { params: { q } })
  return data
}
