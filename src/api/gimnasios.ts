import { apiClient } from './client'
import type {
  AlumnoCreadoResponse,
  CrearAlumnoRequest,
  GimnasioCreateRequest,
  GimnasioMioResponse,
  GimnasioResumenResponse,
} from './types'

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

export async function agregarAlumno(gimnasioId: string, boxeadorId: string): Promise<void> {
  await apiClient.post(`/api/gimnasios/${gimnasioId}/alumnos`, { boxeadorId })
}

export async function quitarAlumno(gimnasioId: string, boxeadorId: string): Promise<void> {
  await apiClient.delete(`/api/gimnasios/${gimnasioId}/alumnos/${boxeadorId}`)
}

export async function crearAlumno(
  gimnasioId: string,
  request: CrearAlumnoRequest,
): Promise<AlumnoCreadoResponse> {
  const { data } = await apiClient.post<AlumnoCreadoResponse>(`/api/gimnasios/${gimnasioId}/alumnos/nuevos`, request)
  return data
}
