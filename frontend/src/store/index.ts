import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

// Reducers
import authReducer from './slices/auth-slice'
import cartReducer from './slices/cart-slice'
import wishlistReducer from './slices/wishlist-slice'
import productReducer from './slices/product-slice'
import orderReducer from './slices/order-slice'
import notificationReducer from './slices/notification-slice'
import uiReducer from './slices/ui-slice'

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  products: productReducer,
  orders: orderReducer,
  notifications: notificationReducer,
  ui: uiReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/setUser'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user'],
      },
    }),
  devTools: import.meta.env.DEV,
})

// Types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
