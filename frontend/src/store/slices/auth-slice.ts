import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '@/services/api/axios'

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user, access_token, refresh_token } = response.data
      return { user, accessToken: access_token, refreshToken: refresh_token }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Login failed')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    role?: string
  }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Registration failed')
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    await api.post('/auth/logout')
  } catch {
    // Ignore logout errors
  }
})

export type UserRole = 'customer' | 'vendor' | 'admin'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: UserRole
  avatar?: string
  isVerified: boolean
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  accessToken: string | null
  refreshToken: string | null
}

const getStoredAuth = (): Partial<AuthState> => {
  try {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null
    return { accessToken, refreshToken, user, isAuthenticated: !!accessToken && !!user }
  } catch {
    return {}
  }
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
  ...getStoredAuth(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User
        accessToken: string
        refreshToken: string
      }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload
      state.user = user
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      state.isAuthenticated = true
      state.error = null
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(user))
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      localStorage.setItem('user', JSON.stringify(action.payload))
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
      localStorage.setItem('accessToken', action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
      
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem('user', JSON.stringify(state.user))
      }
    },
  },
})

export const { 
  setCredentials, 
  setUser, 
  setAccessToken, 
  setLoading, 
  setError, 
  logout,
  updateProfile 
} = authSlice.actions

export default authSlice.reducer
