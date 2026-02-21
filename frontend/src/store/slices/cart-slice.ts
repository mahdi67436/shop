import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartItem {
  id: string
  productId: string
  productName: string
  productImage: string
  variantId?: string
  variantName?: string
  price: number
  quantity: number
  vendorId: string
  maxQuantity: number
}

export interface CartState {
  items: CartItem[]
  isLoading: boolean
  error: string | null
}

const getStoredCart = (): CartItem[] => {
  try {
    const cartStr = localStorage.getItem('cart')
    return cartStr ? JSON.parse(cartStr) : []
  } catch {
    return []
  }
}

const initialState: CartState = {
  items: getStoredCart(),
  isLoading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'id'>>) => {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId
      )

      if (existingIndex >= 0) {
        const newQuantity = state.items[existingIndex].quantity + action.payload.quantity
        state.items[existingIndex].quantity = Math.min(newQuantity, action.payload.maxQuantity)
      } else {
        const id = `${action.payload.productId}-${action.payload.variantId || 'default'}-${Date.now()}`
        state.items.push({ ...action.payload, id })
      }
      
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id)
      if (item) {
        item.quantity = Math.min(Math.max(1, action.payload.quantity), item.maxQuantity)
        localStorage.setItem('cart', JSON.stringify(state.items))
      }
    },
    clearCart: (state) => {
      state.items = []
      localStorage.removeItem('cart')
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
      localStorage.setItem('cart', JSON.stringify(action.payload))
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartItems,
  setLoading,
  setError,
} = cartSlice.actions

export default cartSlice.reducer
