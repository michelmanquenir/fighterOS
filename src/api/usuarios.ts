import { apiClient } from './client'
import type { UsuarioResponse } from './types'

export async function obtenerMe(): Promise<UsuarioResponse> {
  const { data } = await apiClient.get<UsuarioResponse>('/api/usuarios/me')
  return data
}

export async function subirAvatar(archivo: File): Promise<UsuarioResponse> {
  const formData = new FormData()
  formData.append('archivo', archivo)
  const { data } = await apiClient.post<UsuarioResponse>('/api/usuarios/me/avatar', formData)
  return data
}
