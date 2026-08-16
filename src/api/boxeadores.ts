import { apiClient } from './client'
import type {
  BoxeadorFiltros,
  BoxeadorPerfilResponse,
  BoxeadorResumenResponse,
  BoxeadorUpdateRequest,
  CampeonatoResponse,
  CompatibilidadResponse,
  CopaResponse,
  EstadisticasResponse,
  MedallaResponse,
  MultimediaResponse,
  Page,
  PatrocinioResponse,
  PeleaResumenResponse,
  PesoPactadoRequest,
  PesoPactadoResponse,
  TipoMultimediaEnum,
} from './types'

export async function listar(
  filtros: BoxeadorFiltros,
  page: number,
): Promise<Page<BoxeadorResumenResponse>> {
  const { data } = await apiClient.get<Page<BoxeadorResumenResponse>>('/api/boxeadores', {
    params: { ...filtros, page },
  })
  return data
}

export async function obtenerPerfil(id: string): Promise<BoxeadorPerfilResponse> {
  const { data } = await apiClient.get<BoxeadorPerfilResponse>(`/api/boxeadores/${id}`)
  return data
}

export async function comparar(aId: string, bId: string): Promise<CompatibilidadResponse> {
  const { data } = await apiClient.get<CompatibilidadResponse>('/api/boxeadores/comparar', {
    params: { aId, bId },
  })
  return data
}

export async function actualizar(
  id: string,
  request: BoxeadorUpdateRequest,
): Promise<BoxeadorPerfilResponse> {
  const { data } = await apiClient.put<BoxeadorPerfilResponse>(`/api/boxeadores/${id}`, request)
  return data
}

export async function obtenerEstadisticas(id: string): Promise<EstadisticasResponse> {
  const { data } = await apiClient.get<EstadisticasResponse>(`/api/boxeadores/${id}/estadisticas`)
  return data
}

export async function obtenerHistorial(id: string): Promise<PeleaResumenResponse[]> {
  const { data } = await apiClient.get<PeleaResumenResponse[]>(`/api/boxeadores/${id}/historial`)
  return data
}

export async function obtenerProximasPeleas(id: string): Promise<PeleaResumenResponse[]> {
  const { data } = await apiClient.get<PeleaResumenResponse[]>(
    `/api/boxeadores/${id}/proximas-peleas`,
  )
  return data
}

export async function obtenerMedallas(id: string): Promise<MedallaResponse[]> {
  const { data } = await apiClient.get<MedallaResponse[]>(`/api/boxeadores/${id}/medallas`)
  return data
}

export async function obtenerCopas(id: string): Promise<CopaResponse[]> {
  const { data } = await apiClient.get<CopaResponse[]>(`/api/boxeadores/${id}/copas`)
  return data
}

export async function obtenerCampeonatos(id: string): Promise<CampeonatoResponse[]> {
  const { data } = await apiClient.get<CampeonatoResponse[]>(`/api/boxeadores/${id}/campeonatos`)
  return data
}

export async function obtenerPatrocinios(id: string): Promise<PatrocinioResponse[]> {
  const { data } = await apiClient.get<PatrocinioResponse[]>(`/api/boxeadores/${id}/patrocinios`)
  return data
}

export async function obtenerPesosPactados(id: string): Promise<PesoPactadoResponse[]> {
  const { data } = await apiClient.get<PesoPactadoResponse[]>(
    `/api/boxeadores/${id}/pesos-pactados`,
  )
  return data
}

export async function obtenerMultimedia(id: string): Promise<MultimediaResponse[]> {
  const { data } = await apiClient.get<MultimediaResponse[]>(`/api/boxeadores/${id}/multimedia`)
  return data
}

export async function subirFoto(id: string, archivo: File): Promise<BoxeadorPerfilResponse> {
  const formData = new FormData()
  formData.append('archivo', archivo)
  const { data } = await apiClient.post<BoxeadorPerfilResponse>(
    `/api/boxeadores/${id}/foto`,
    formData,
  )
  return data
}

export async function agregarMultimedia(
  id: string,
  archivo: File,
  tipo: TipoMultimediaEnum,
): Promise<MultimediaResponse> {
  const formData = new FormData()
  formData.append('archivo', archivo)
  const { data } = await apiClient.post<MultimediaResponse>(
    `/api/boxeadores/${id}/multimedia`,
    formData,
    { params: { tipo } },
  )
  return data
}

export async function registrarPesoPactado(
  id: string,
  request: PesoPactadoRequest,
): Promise<PesoPactadoResponse> {
  const { data } = await apiClient.post<PesoPactadoResponse>(
    `/api/boxeadores/${id}/pesos-pactados`,
    request,
  )
  return data
}
