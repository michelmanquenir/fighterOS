import { apiClient } from './client'
import type { CategoriaPesoResponse, GimnasioResponse, RegionResponse } from './types'

export async function listarRegiones(): Promise<RegionResponse[]> {
  const { data } = await apiClient.get<RegionResponse[]>('/api/catalogos/regiones')
  return data
}

export async function listarCategoriasPeso(): Promise<CategoriaPesoResponse[]> {
  const { data } = await apiClient.get<CategoriaPesoResponse[]>('/api/catalogos/categorias-peso')
  return data
}

export async function listarGimnasios(): Promise<GimnasioResponse[]> {
  const { data } = await apiClient.get<GimnasioResponse[]>('/api/catalogos/gimnasios')
  return data
}
