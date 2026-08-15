import { apiClient } from './client'
import type { EstadoSeguimientoResponse, SeguidorPerfilResponse, SolicitudSeguimientoResponse } from './types'

export async function obtenerEstado(seguidoId: string): Promise<EstadoSeguimientoResponse> {
  const { data } = await apiClient.get<EstadoSeguimientoResponse>(`/api/seguidores/${seguidoId}/estado`)
  return data
}

export async function seguir(seguidoId: string): Promise<EstadoSeguimientoResponse> {
  const { data } = await apiClient.post<EstadoSeguimientoResponse>(`/api/seguidores/${seguidoId}`)
  return data
}

export async function dejarDeSeguir(seguidoId: string): Promise<void> {
  await apiClient.delete(`/api/seguidores/${seguidoId}`)
}

export async function listarSolicitudes(): Promise<SolicitudSeguimientoResponse[]> {
  const { data } = await apiClient.get<SolicitudSeguimientoResponse[]>('/api/seguidores/solicitudes')
  return data
}

export async function aceptarSolicitud(seguidorId: string): Promise<void> {
  await apiClient.post(`/api/seguidores/solicitudes/${seguidorId}/aceptar`)
}

export async function rechazarSolicitud(seguidorId: string): Promise<void> {
  await apiClient.post(`/api/seguidores/solicitudes/${seguidorId}/rechazar`)
}

export async function listarMisSeguidores(): Promise<SeguidorPerfilResponse[]> {
  const { data } = await apiClient.get<SeguidorPerfilResponse[]>('/api/seguidores/mis-seguidores')
  return data
}

export async function listarMisSeguidos(): Promise<SeguidorPerfilResponse[]> {
  const { data } = await apiClient.get<SeguidorPerfilResponse[]>('/api/seguidores/mis-seguidos')
  return data
}
