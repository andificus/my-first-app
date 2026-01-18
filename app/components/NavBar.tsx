'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

type NavProfile = {
  full_name: string | null
  username: string | null
  avatar_url: string | null
}

export default function NavBar() {
  const router = useRouter()

  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const initials = useMemo(() => {
    const base = (displayName || userEmail || '').trim()
    if (!base) return '?'

    const handle = base.includes('@') ? base.split('@')[0] : base
    const parts = handle.split(/[\s._-]+/).filter(Boolean)
    const a = parts[0]?.[0] ?? handle[0] ?? '?'
    const b = parts[1]?.[0] ?? handle[1] ?? ''
    return (a + b).toUpperCase()
  }, [displayName, userEmail])

  const loadProfileForUser = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, username, avatar_url')
      .eq('user_id', userId)
      .maybeSingle<NavProfile>()

    setDisplayName(data?.full_name || data?.username || null)
    setAvatarUrl(data?.avatar_url || null)
  }

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user ?? null

      setUserEmail(user?.email ?? null)
      setMenuOpen(false)

      if (!user) {
        setDisplayName(null)
        setAvatarUrl(null)
        return
      }

      await loadProfileForUser(user.id)
    }

    load()

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null
      setUserEmail(user?.email ?? null)
