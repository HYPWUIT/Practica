import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import type {
  ResolvedTheme,
  ThemeContextValue,
  ThemePreference,
} from './theme-context'
import { THEME_STORAGE_KEY, ThemeContext } from './theme-context'

const DARK_QUERY = '(prefers-color-scheme: dark)'

/**
 * Reading localStorage can throw outright — private windows, browsers set to
 * block site data — so every access is guarded and falls back to "system".
 */
function readStoredPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored
    }
  } catch {
    // Ignore: an unreadable store just means we follow the OS.
  }
  return 'system'
}

/**
 * The OS colour preference is an external store, so it is read through
 * useSyncExternalStore rather than mirrored into state by an effect. Someone
 * whose machine switches at sunset sees the site switch with it.
 */
function subscribeToSystem(onChange: () => void) {
  const media = window.matchMedia(DARK_QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] =
    useState<ThemePreference>(readStoredPreference)

  const systemTheme = useSyncExternalStore(
    subscribeToSystem,
    getSystemTheme,
    () => 'light' as ResolvedTheme,
  )

  // Derived during render, not stored: there is nothing here an effect knows
  // that this line does not.
  const resolved: ResolvedTheme =
    preference === 'system' ? systemTheme : preference

  // The one genuine external sync — the <html> element, which React does not
  // own. CSS only ever looks for [data-theme="dark"], so "system" never
  // reaches the stylesheet.
  useEffect(() => {
    document.documentElement.dataset.theme = resolved
  }, [resolved])

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Ignore: the choice still applies for this session.
    }
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      resolved,
      setPreference,
      toggle: () => setPreference(resolved === 'dark' ? 'light' : 'dark'),
    }),
    [preference, resolved, setPreference],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}
