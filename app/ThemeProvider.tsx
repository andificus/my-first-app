'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Theme = 'system' | 'light' | 'dark'

function applyTheme(theme: Theme) {
  const root = document.documentElement

  if (theme === 'system') {
    const isDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    root.dataset.theme = isDark ? 'dark' : 'light'
  } else {
    root.dataset.theme = theme
  }
}

export default function ThemeProvider() {
  useEffect(() => {
    let unsub: { subscription: { unsubscribe: () => void } } | null = null

    const load = async () => {
      // default for logged-out users
      applyTheme('system')

      const { data } = await supabase.auth.getSession()
      const user = data.session?.user
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('theme')
        .eq('user_id', user.id)
        .maybeSingle()

      const t = (profile?.theme as Theme) ?? 'system'
      applyTheme(t)
    }

    load()

    // If user logs in/out in another tab, re-apply theme
    unsub = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        applyTheme('system')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('theme')
        .eq('user_id', session.user.id)
        .maybeSingle()

      const t = (profile?.theme as Theme) ?? 'system'
      applyTheme(t)
    }).data

    return () => {
      unsub?.subscription.unsubscribe()
    }
  }, [])

  return null
}
