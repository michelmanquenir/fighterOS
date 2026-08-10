// Tipos espejo de los DTOs del backend (fighteros-app).
// Los enums son union types en minúscula porque calzan con el .name()
// de los enums Java al serializarse a JSON.

export type SexoEnum = 'M' | 'F'

export type EstadoDeportivoEnum = 'activo' | 'retirado' | 'suspendido' | 'lesionado'

export type NivelProgresionEnum =
  | 'debutante'
  | 'novato'
  | 'intermedio'
  | 'avanzado'
  | 'elite_amateur'

export type EstadoPeleaEnum = 'programada' | 'realizada' | 'cancelada'

export type ResultadoPeleaEnum =
  | 'victoria_a'
  | 'victoria_b'
  | 'empate'
  | 'no_contest'
  | 'cancelada'

export type MetodoVictoriaEnum =
  | 'ko'
  | 'tko_rsc'
  | 'decision_unanime'
  | 'decision_dividida'
  | 'wo'
  | 'descalificacion'
  | 'no_contest'

export type TipoMedallaEnum = 'oro' | 'plata' | 'bronce'

export type TipoMultimediaEnum = 'foto' | 'video'

export type TipoEventoEnum = 'torneo' | 'velada' | 'exhibicion' | 'campeonato'

export type EstadoEventoEnum =
  | 'planificado'
  | 'inscripciones_abiertas'
  | 'en_curso'
  | 'finalizado'
  | 'cancelado'

// ---------------------------------------------------------------------
// Catálogos
// ---------------------------------------------------------------------

export interface RegionResponse {
  id: number
  nombre: string
}

export interface CategoriaPesoResponse {
  id: string
  nombre: string
  sexo: SexoEnum
  pesoMin: number
  pesoMax: number
}

export interface GimnasioResponse {
  id: string
  nombre: string
}

// ---------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------

export interface LoginRequest {
  email: string
  password: string
}

export interface RegistroBoxeadorRequest {
  nombre: string
  email: string
  password: string
  rut: string
  fechaNacimiento: string
  sexo: SexoEnum
  pesoActual?: number
  pesoHabitual?: number
  categoriaId?: string
  gimnasioId?: string
  regionId?: number
}

export interface RegistroUsuarioRequest {
  nombre: string
  email: string
  password: string
  regionId?: number
}

export interface RegistroGimnasioRequest {
  nombreAdmin: string
  email: string
  password: string
  nombreGimnasio: string
  direccion?: string
  regionId?: number
  telefono?: string
  emailGimnasio?: string
  descripcion?: string
}

export interface GimnasioCreateRequest {
  nombre: string
  direccion?: string
  regionId?: number
  telefono?: string
  email?: string
  descripcion?: string
}

export interface GimnasioMioResponse {
  id: string
  nombre: string
  direccion: string | null
  regionId: number | null
  regionNombre: string | null
  telefono: string | null
  email: string | null
  descripcion: string | null
  roles: string[]
}

export interface AuthResponse {
  token: string
  usuarioId: string
  nombre: string
  email: string
  roles: string[]
}

export interface UsuarioResponse {
  id: string
  nombre: string
  email: string
  avatarUrl: string | null
  roles: string[]
}

// ---------------------------------------------------------------------
// Boxeador
// ---------------------------------------------------------------------

export interface BoxeadorPerfilResponse {
  id: string
  nombre: string
  email: string
  fotoUrl: string | null
  rut: string
  fechaNacimiento: string
  edad: number
  sexo: SexoEnum
  pesoActual: number | null
  pesoHabitual: number | null
  categoriaId: string | null
  categoriaNombre: string | null
  gimnasioId: string | null
  gimnasioNombre: string | null
  entrenadorId: string | null
  entrenadorNombre: string | null
  regionId: number | null
  regionNombre: string | null
  estadoDeportivo: EstadoDeportivoEnum
  nivelProgresion: NivelProgresionEnum
  perfilPublico: boolean
}

export interface BoxeadorResumenResponse {
  id: string
  nombre: string
  fotoUrl: string | null
  sexo: SexoEnum
  pesoActual: number | null
  categoriaNombre: string | null
  gimnasioNombre: string | null
  estadoDeportivo: EstadoDeportivoEnum
}

export interface BoxeadorUpdateRequest {
  pesoActual?: number
  pesoHabitual?: number
  categoriaId?: string
  gimnasioId?: string
  regionId?: number
  estadoDeportivo?: EstadoDeportivoEnum
  perfilPublico?: boolean
}

export interface EstadisticasResponse {
  peleasTotales: number
  victorias: number
  derrotas: number
  empates: number
  victoriasKo: number
  victoriasDecision: number
  ultimaPelea: string | null
}

export type ResultadoBoxeador = 'victoria' | 'derrota' | 'empate' | 'no_contest' | 'cancelada'

export interface PeleaResumenResponse {
  id: string
  eventoId: string
  eventoNombre: string
  rivalId: string
  rivalNombre: string
  estado: EstadoPeleaEnum
  resultado: ResultadoPeleaEnum | null
  resultadoBoxeador: ResultadoBoxeador | null
  metodoVictoria: MetodoVictoriaEnum | null
  fecha: string | null
}

export interface MedallaResponse {
  id: string
  tipo: TipoMedallaEnum
  nombre: string
  fecha: string
  descripcion: string | null
}

export interface CopaResponse {
  id: string
  nombre: string
  fecha: string
}

export interface CampeonatoResponse {
  id: string
  ligaNombre: string | null
  categoriaNombre: string | null
  titulo: string
  fechaObtenido: string
  vigente: boolean
}

export interface PatrocinioResponse {
  id: string
  patrocinadorNombre: string
  descripcion: string | null
  fechaInicio: string
  fechaFin: string | null
}

export interface MultimediaResponse {
  id: string
  tipo: TipoMultimediaEnum
  url: string
  esOficial: boolean
}

export interface PesoPactadoRequest {
  pesoPactado: number
}

export type EstadoSeguimiento = 'ninguno' | 'pendiente' | 'aceptado'

export interface EstadoSeguimientoResponse {
  estado: EstadoSeguimiento
}

export interface SolicitudSeguimientoResponse {
  seguidorId: string
  seguidorNombre: string
  seguidorAvatarUrl: string | null
  fecha: string
}

export interface PesoPactadoResponse {
  id: string
  pesoPactado: number
  createdAt: string
}

export interface BoxeadorFiltros {
  gimnasioId?: string
  regionId?: number
  categoriaId?: string
  estado?: EstadoDeportivoEnum
}

// Página estilo Spring Data
export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number
  size: number
}

// ---------------------------------------------------------------------
// Eventos
// ---------------------------------------------------------------------

export interface EventoResponse {
  id: string
  nombre: string
  tipo: TipoEventoEnum
  fecha: string
  lugar: string | null
  regionId: number | null
  regionNombre: string | null
  cuposTotales: number | null
  estado: EstadoEventoEnum
  afichePosterUrl: string | null
  reglamentoUrl: string | null
  organizadorId: string
  organizadorNombre: string
  gimnasioNombre: string | null
}

export interface EventoCreateRequest {
  nombre: string
  tipo: TipoEventoEnum
  fecha: string
  lugar?: string
  regionId?: number
  cuposTotales?: number
  reglamentoUrl?: string
  afichePosterUrl?: string
}

export interface EventoUpdateRequest {
  nombre?: string
  fecha?: string
  lugar?: string
  regionId?: number
  cuposTotales?: number
  estado?: EstadoEventoEnum
  reglamentoUrl?: string
  afichePosterUrl?: string
}

export interface EventoFiltros {
  regionId?: number
  tipo?: TipoEventoEnum
  estado?: EstadoEventoEnum
}
