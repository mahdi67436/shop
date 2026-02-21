import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded'

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  variantName?: string
  price: number
  quantity: number
  vendorId: string
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  total: number
  status: OrderStatus
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  shippingAddress: ShippingAddress
  notes?: string
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
}

export interface ShippingAddress {
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  district: string
  division: string
  postalCode: string
  country: string
}

export interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  isLoading: boolean
  error: string | null
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
}

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: OrderStatus }>) => {
      const order = state.orders.find(o => o.id === action.payload.orderId)
      if (order) {
        order.status = action.payload.status
        order.updatedAt = new Date().toISOString()
      }
      if (state.currentOrder?.id === action.payload.orderId) {
        state.currentOrder.status = action.payload.status
        state.currentOrder.updatedAt = new Date().toISOString()
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
  },
})

export const {
  setOrders,
  setCurrentOrder,
  updateOrderStatus,
  setLoading,
  setError,
} = orderSlice.actions

export default orderSlice.reducer
