import { useState, type ReactNode } from 'react'
import type { AuthResponse } from '../api/types'
import { AuthContext } from './authContext'
import { clearStoredAuth, getStoredAuth, setStoredAuth, type StoredAuth } from './authStorage'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(() => getStoredAuth())

  function login(response: AuthResponse) {
    const stored: StoredAuth = {
      token: response.token,
      usuarioId: response.usuarioId,
      nombre: response.nombre,
      email: response.email,
      roles: response.roles,
    }
    setStoredAuth(stored)
    setAuth(stored)
  }

  function logout() {
    clearStoredAuth()
    setAuth(null)
  }

  function actualizarRoles(roles: string[]) {
    setAuth((current) => {
      if (!current) return current
      const stored: StoredAuth = { ...current, roles }
      setStoredAuth(stored)
      return stored
    })
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout, actualizarRoles }}>{children}</AuthContext.Provider>
  )
}
