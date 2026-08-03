import { apiClient } from './client'
import type { AuthResponse, LoginRequest, RegistroBoxeadorRequest } from './types'

export async function login(request: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/login', request)
  return data
}

export async function registrarBoxeador(request: RegistroBoxeadorRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/api/auth/registro/boxeador', request)
  return data
}
