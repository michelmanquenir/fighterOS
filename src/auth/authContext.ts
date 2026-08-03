import { createContext } from 'react'
import type { AuthResponse } from '../api/types'
import type { StoredAuth } from './authStorage'

export interface AuthContextValue {
  auth: StoredAuth | null
  login: (response: AuthResponse) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
