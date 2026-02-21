import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { store } from '@/store'
import { setAccessToken, logout as authLogout, setError } from '@/store/slices/auth-slice'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.accessToken
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle 401 errors - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = store.getState().auth.refreshToken
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          })

          const { access_token } = response.data
          store.dispatch(setAccessToken(access_token))

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`
          }
          return api(originalRequest)
        }
      } catch (refreshError) {
        store.dispatch(authLogout())
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    if (error.response) {
      const message = (error.response.data as { detail?: string })?.detail || 'An error occurred'
      store.dispatch(setError(message))
    } else if (error.request) {
      store.dispatch(setError('Network error. Please check your connection.'))
    } else {
      store.dispatch(setError(error.message))
    }

    return Promise.reject(error)
  }
)

export default api
