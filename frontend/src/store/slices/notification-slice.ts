import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface NotificationState {
  notifications: Notification[]
  unreadCount: number
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      state.notifications.push({ ...action.payload, id })
      if (action.payload.type === 'error' || action.payload.type === 'warning') {
        state.unreadCount += 1
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    clearAllNotifications: (state) => {
      state.notifications = []
      state.unreadCount = 0
    },
    markAsRead: (state) => {
      state.unreadCount = 0
    },
  },
})

export const {
  addNotification,
  removeNotification,
  clearAllNotifications,
  markAsRead,
} = notificationSlice.actions

export default notificationSlice.reducer
