import type { CategoriaPesoResponse, SexoEnum } from '../../../api/types'

export function encontrarCategoriaPorPeso(
  categorias: CategoriaPesoResponse[] | undefined,
  peso: number,
  sexo: SexoEnum,
): CategoriaPesoResponse | undefined {
  return categorias?.find(
    (categoria) =>
      categoria.sexo === sexo && peso >= categoria.pesoMin && peso <= categoria.pesoMax,
  )
}
