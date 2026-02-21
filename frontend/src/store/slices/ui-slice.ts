import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Theme = 'light' | 'dark' | 'system'
export type Currency = 'BDT' | 'USD'
export type Language = 'en' | 'bn'

export interface UIState {
  theme: Theme
  currency: Currency
  language: Language
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  searchOpen: boolean
  cartDrawerOpen: boolean
  wishlistDrawerOpen: boolean
  comparisonList: string[]
}

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) return stored
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  }
  return 'light'
}

const initialState: UIState = {
  theme: getInitialTheme(),
  currency: 'BDT',
  language: 'en',
  sidebarOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  cartDrawerOpen: false,
  wishlistDrawerOpen: false,
  comparisonList: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
      
      // Apply theme to document
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (action.payload === 'light') {
        document.documentElement.classList.remove('dark')
      } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    },
    setCurrency: (state, action: PayloadAction<Currency>) => {
      state.currency = action.payload
      localStorage.setItem('currency', action.payload)
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload
      localStorage.setItem('language', action.payload)
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen
    },
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.searchOpen = action.payload
    },
    toggleCartDrawer: (state) => {
      state.cartDrawerOpen = !state.cartDrawerOpen
    },
    setCartDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.cartDrawerOpen = action.payload
    },
    toggleWishlistDrawer: (state) => {
      state.wishlistDrawerOpen = !state.wishlistDrawerOpen
    },
    setWishlistDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.wishlistDrawerOpen = action.payload
    },
    addToComparison: (state, action: PayloadAction<string>) => {
      if (!state.comparisonList.includes(action.payload) && state.comparisonList.length < 4) {
        state.comparisonList.push(action.payload)
      }
    },
    removeFromComparison: (state, action: PayloadAction<string>) => {
      state.comparisonList = state.comparisonList.filter(id => id !== action.payload)
    },
    clearComparison: (state) => {
      state.comparisonList = []
    },
  },
})

export const {
  setTheme,
  setCurrency,
  setLanguage,
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleSearch,
  setSearchOpen,
  toggleCartDrawer,
  setCartDrawerOpen,
  toggleWishlistDrawer,
  setWishlistDrawerOpen,
  addToComparison,
  removeFromComparison,
  clearComparison,
} = uiSlice.actions

export default uiSlice.reducer
