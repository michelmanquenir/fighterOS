import axios, { isAxiosError } from 'axios'
import { clearStoredAuth, getStoredAuth } from '../auth/authStorage'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

apiClient.interceptors.request.use((config) => {
  const auth = getStoredAuth()
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

// Un 403 sin cuerpo JSON viene del filtro de seguridad (token vencido/ inválido),
// no de una regla de negocio - esas siempre responden con { error: '...' }.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const sesionExpirada =
      isAxiosError(error) && error.response?.status === 403 && !error.response.data
    if (sesionExpirada && getStoredAuth()) {
      clearStoredAuth()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expirada=1'
      }
    }
    return Promise.reject(error)
  },
)
