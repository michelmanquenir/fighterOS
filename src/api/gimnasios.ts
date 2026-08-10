import { isAxiosError } from 'axios'
import { apiClient } from './client'
import type { GimnasioCreateRequest, GimnasioMioResponse } from './types'

export async function crearGimnasio(request: GimnasioCreateRequest): Promise<GimnasioMioResponse> {
  const { data } = await apiClient.post<GimnasioMioResponse>('/api/gimnasios', request)
  return data
}

export async function obtenerMiGimnasio(): Promise<GimnasioMioResponse | null> {
  try {
    const { data } = await apiClient.get<GimnasioMioResponse>('/api/gimnasios/mio')
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}
