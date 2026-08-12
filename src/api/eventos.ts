import { apiClient } from './client'
import type {
  EventoCreateRequest,
  EventoFiltros,
  EventoInscripcionCreateRequest,
  EventoInscripcionResponse,
  EventoResponse,
  EventoUpdateRequest,
  Page,
} from './types'

export async function listar(filtros: EventoFiltros, page: number): Promise<Page<EventoResponse>> {
  const { data } = await apiClient.get<Page<EventoResponse>>('/api/eventos', {
    params: { ...filtros, page },
  })
  return data
}

export async function misEventos(page: number): Promise<Page<EventoResponse>> {
  const { data } = await apiClient.get<Page<EventoResponse>>('/api/eventos/mios', {
    params: { page },
  })
  return data
}

export async function obtener(id: string): Promise<EventoResponse> {
  const { data } = await apiClient.get<EventoResponse>(`/api/eventos/${id}`)
  return data
}

export async function crear(request: EventoCreateRequest): Promise<EventoResponse> {
  const { data } = await apiClient.post<EventoResponse>('/api/eventos', request)
  return data
}

export async function actualizar(id: string, request: EventoUpdateRequest): Promise<EventoResponse> {
  const { data } = await apiClient.put<EventoResponse>(`/api/eventos/${id}`, request)
  return data
}

export async function subirArchivo(archivo: File): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append('archivo', archivo)
  const { data } = await apiClient.post<{ url: string }>('/api/eventos/archivos', formData)
  return data
}

export async function listarInscripciones(eventoId: string): Promise<EventoInscripcionResponse[]> {
  const { data } = await apiClient.get<EventoInscripcionResponse[]>(`/api/eventos/${eventoId}/inscripciones`)
  return data
}

export async function inscribirBoxeador(
  eventoId: string,
  request: EventoInscripcionCreateRequest,
): Promise<EventoInscripcionResponse> {
  const { data } = await apiClient.post<EventoInscripcionResponse>(
    `/api/eventos/${eventoId}/inscripciones`,
    request,
  )
  return data
}

export async function retirarInscripcion(eventoId: string, boxeadorId: string): Promise<void> {
  await apiClient.delete(`/api/eventos/${eventoId}/inscripciones/${boxeadorId}`)
}
