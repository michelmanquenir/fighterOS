import { apiClient } from './client'
import type { UsuarioResponse } from './types'

export async function obtenerMe(): Promise<UsuarioResponse> {
  const { data } = await apiClient.get<UsuarioResponse>('/api/usuarios/me')
  return data
}
