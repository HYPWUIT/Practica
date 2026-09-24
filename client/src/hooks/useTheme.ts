import { useContext } from 'react'
import type { ThemeContextValue } from '../context/theme-context'
import { ThemeContext } from '../context/theme-context'

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used inside <ThemeProvider>')
  }
  return context
}
