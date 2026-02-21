import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface WishlistItem {
  id: string
  productId: string
  productName: string
  productImage: string
  price: number
  originalPrice?: number
  vendorId: string
  vendorName: string
  addedAt: string
}

export interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
}

const getStoredWishlist = (): WishlistItem[] => {
  try {
    const wishlistStr = localStorage.getItem('wishlist')
    return wishlistStr ? JSON.parse(wishlistStr) : []
  } catch {
    return []
  }
}

const initialState: WishlistState = {
  items: getStoredWishlist(),
  isLoading: false,
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Omit<WishlistItem, 'id' | 'addedAt'>>) => {
      const exists = state.items.some(item => item.productId === action.payload.productId)
      if (!exists) {
        state.items.push({
          ...action.payload,
          id: `${action.payload.productId}-${Date.now()}`,
          addedAt: new Date().toISOString(),
        })
        localStorage.setItem('wishlist', JSON.stringify(state.items))
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload)
      localStorage.setItem('wishlist', JSON.stringify(state.items))
    },
    clearWishlist: (state) => {
      state.items = []
      localStorage.removeItem('wishlist')
    },
    setWishlistItems: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload
      localStorage.setItem('wishlist', JSON.stringify(action.payload))
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlistItems,
  setLoading,
} = wishlistSlice.actions

export default wishlistSlice.reducer
