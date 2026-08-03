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
    }
    setStoredAuth(stored)
    setAuth(stored)
  }

  function logout() {
    clearStoredAuth()
    setAuth(null)
  }

  return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>
}
