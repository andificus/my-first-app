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
    const load = async () => {
      // logged-out default
      applyTheme('system')

      const { data } = await supabase.auth.getSession()
      const user = data.session?.user
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('theme')
        .eq('user_id', user.id)
        .maybeSingle()

      applyTheme((profile?.theme as Theme) ?? 'system')
    }

    load()
  }, [])

  return null
}
