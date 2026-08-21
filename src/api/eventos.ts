import { apiClient } from './client'
import type {
  EventoCreateRequest,
  EventoFiltros,
  EventoInscripcionCreateRequest,
  EventoInscripcionResponse,
  EventoPeleaCreateRequest,
  EventoPeleaResponse,
  EventoPeleaResultadoRequest,
  EventoResponse,
  EventoTorneoCreateRequest,
  EventoTorneoResponse,
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

export async function asignarTorneo(
  eventoId: string,
  boxeadorId: string,
  torneoId: string | null,
): Promise<EventoInscripcionResponse> {
  const { data } = await apiClient.put<EventoInscripcionResponse>(
    `/api/eventos/${eventoId}/inscripciones/${boxeadorId}/torneo`,
    { torneoId },
  )
  return data
}

export async function listarTorneos(eventoId: string): Promise<EventoTorneoResponse[]> {
  const { data } = await apiClient.get<EventoTorneoResponse[]>(`/api/eventos/${eventoId}/torneos`)
  return data
}

export async function crearTorneo(
  eventoId: string,
  request: EventoTorneoCreateRequest,
): Promise<EventoTorneoResponse> {
  const { data } = await apiClient.post<EventoTorneoResponse>(`/api/eventos/${eventoId}/torneos`, request)
  return data
}

export async function eliminarTorneo(eventoId: string, torneoId: string): Promise<void> {
  await apiClient.delete(`/api/eventos/${eventoId}/torneos/${torneoId}`)
}

export async function listarPeleas(eventoId: string): Promise<EventoPeleaResponse[]> {
  const { data } = await apiClient.get<EventoPeleaResponse[]>(`/api/eventos/${eventoId}/peleas`)
  return data
}

export async function pactarPelea(
  eventoId: string,
  request: EventoPeleaCreateRequest,
): Promise<EventoPeleaResponse> {
  const { data } = await apiClient.post<EventoPeleaResponse>(`/api/eventos/${eventoId}/peleas`, request)
  return data
}

export async function eliminarPelea(eventoId: string, peleaId: string): Promise<void> {
  await apiClient.delete(`/api/eventos/${eventoId}/peleas/${peleaId}`)
}

export async function registrarResultadoPelea(
  eventoId: string,
  peleaId: string,
  request: EventoPeleaResultadoRequest,
): Promise<EventoPeleaResponse> {
  const { data } = await apiClient.put<EventoPeleaResponse>(
    `/api/eventos/${eventoId}/peleas/${peleaId}/resultado`,
    request,
  )
  return data
}
