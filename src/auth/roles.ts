import type { StoredAuth } from './authStorage'

export function hasRole(auth: StoredAuth | null, rol: string): boolean {
  return auth?.roles.includes(rol) ?? false
}
