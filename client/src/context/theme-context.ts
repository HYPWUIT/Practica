import { createContext } from 'react'

/** What the user chose. "system" defers to the OS setting. */
export type ThemePreference = 'light' | 'dark' | 'system'

/** What is actually on screen once "system" has been resolved. */
export type ResolvedTheme = 'light' | 'dark'

export type ThemeContextValue = {
  preference: ThemePreference
  resolved: ResolvedTheme
  setPreference: (preference: ThemePreference) => void
  /** Flips to the opposite of what is currently showing. */
  toggle: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export const THEME_STORAGE_KEY = 'sage-oak-theme'
