'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function NavBar() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()
  const detailsRef = useRef<HTMLDetailsElement | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user ?? null
      setUserEmail(user?.email ?? null)
    
      if (user) {
        await loadAvatar(user.id)
      } else {
        setAvatarUrl(null)
      }
    })


    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
      // close menu on auth changes
      if (detailsRef.current) detailsRef.current.open = false
    })

    return () => sub.subscription.unsubscribe()
  }, [])

    const loadAvatar = async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('user_id', userId)
        .maybeSingle()
    
      if (!error) {
        setAvatarUrl(data?.avatar_url ?? null)
      }
    }

  const initials = useMemo(() => {
    const email = (userEmail ?? '').trim()
    if (!email) return '?'
    const handle = email.split('@')[0] || email
    const parts = handle.split(/[\s._-]+/).filter(Boolean)
    const a = parts[0]?.[0] ?? handle[0] ?? '?'
    const b = parts[1]?.[0] ?? handle[1] ?? ''
    return (a + b).toUpperCase()
  }, [userEmail])

  const closeMenu = () => {
    if (detailsRef.current) detailsRef.current.open = false
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('signOut error:', error.message)
      return
    }
