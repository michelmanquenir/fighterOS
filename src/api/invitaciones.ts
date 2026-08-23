import { apiClient } from './client'
import type { InvitacionCreateRequest, InvitacionResponse } from './types'

export async function listarInvitacionesDelEvento(eventoId: string): Promise<InvitacionResponse[]> {
  const { data } = await apiClient.get<InvitacionResponse[]>(`/api/eventos/${eventoId}/invitaciones`)
  return data
}

export async function invitarGimnasio(eventoId: string, request: InvitacionCreateRequest): Promise<InvitacionResponse> {
  const { data } = await apiClient.post<InvitacionResponse>(`/api/eventos/${eventoId}/invitaciones`, request)
  return data
}

export async function misInvitaciones(): Promise<InvitacionResponse[]> {
  const { data } = await apiClient.get<InvitacionResponse[]>('/api/invitaciones/mias')
  return data
}

export async function responderInvitacion(invitacionId: string, aceptar: boolean): Promise<InvitacionResponse> {
  const { data } = await apiClient.put<InvitacionResponse>(`/api/invitaciones/${invitacionId}/responder`, { aceptar })
  return data
}
