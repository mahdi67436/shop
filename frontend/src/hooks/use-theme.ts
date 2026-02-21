import { useEffect } from 'react'
import { useAppSelector } from '@/store'

export function useTheme() {
  const theme = useAppSelector((state) => state.ui.theme)

  useEffect(() => {
    const root = window.document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      const currentTheme = localStorage.getItem('theme')
      if (!currentTheme || currentTheme === 'system') {
        if (e.matches) {
          window.document.documentElement.classList.add('dark')
        } else {
          window.document.documentElement.classList.remove('dark')
        }
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])
}
