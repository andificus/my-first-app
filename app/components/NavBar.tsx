'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function NavBar() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const router = useRouter()
  const detailsRef = useRef<HTMLDetailsElement | null>(null)

  function closeMenu() {
    if (detailsRef.current) detailsRef.current.open = false
  }

  async function loadAvatar(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('avatar load error:', error.message)
      setAvatarUrl(null)
      return
    }

    setAvatarUrl(data?.avatar_url ?? null)
  }

  // debug heartbeat
  useEffect(() => {
    console.log('NavBar mounted (hydrated)')
  }, [])

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) console.error('getSession error:', error.message)

        const user = data.session?.user ?? null
        if (cancelled) return

        setUserEmail(user?.email ?? null)

        if (user) await loadAvatar(user.id)
        else setAvatarUrl(null)
      } catch (e) {
        console.error('navbar init crash:', e)
        if (cancelled) return
        setUserEmail(null)
        setAvatarUrl(null)
      }
    }

    init()

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null
      if (cancelled) return

      setUserEmail(user?.email ?? null)
      closeMenu()

      if (user) await loadAvatar(user.id)
      else setAvatarUrl(null)
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  const initials = useMemo(() => {
    const email = (userEmail ?? '').trim()
    if (!email) return '?'
    const handle = email.split('@')[0] || email
    const parts = handle.split(/[\s._-]+/).filter(Boolean)
    const a = parts[0]?.[0] ?? handle[0] ?? '?'
    const b = parts[1]?.[0] ?? handle[1] ?? ''
    return (a + b).toUpperCase()
  }, [userEmail])

  const logout = async () => {
    closeMenu()
    console.log('logout clicked')

    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('signOut error:', error.message)
      return
    }

    setUserEmail(null)
    setAvatarUrl(null)

    router.push('/')
    router.refresh()
  }

  return (
    <header className="navbar">
      <nav className="navbarInner">
        <Link href="/" className="brandLink" aria-label="Andificus home">
          <Image
            src="/andificus-logo.png"
            alt="Andificus"
            width={180}
            height={42}
            priority
            className="brandLogo"
          />
        </Link>

        {userEmail && (
          <div className="navbarLinks">
            <Link href="/dashboard" className="navLink">
              Dashboard
            </Link>
            <Link href="/profile" className="navLink">
              Profile
            </Link>
          </div>
        )}

        <div className="navbarRight">
          {userEmail ? (
            <details ref={detailsRef} className="userDropdown">
              <summary className="avatarButton" aria-label="Open user menu">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="avatarImg" width={32} height={32} />
                ) : (
                  <span className="avatarInitials">{initials}</span>
                )}
              </summary>

              <div className="userMenu card" role="menu" aria-label="User menu">
                <div className="userMenuHeader">
                  <div className="userMenuName">Signed in</div>
                  <div className="userMenuEmail">{userEmail}</div>
                </div>

                <div className="userMenuDivider" />

                <Link href="/dashboard" className="userMenuItem" role="menuitem" onClick={closeMenu}>
                  Dashboard
                </Link>
                <Link href="/profile" className="userMenuItem" role="menuitem" onClick={closeMenu}>
                  Profile
                </Link>

                <div className="userMenuDivider" />

                <button type="button" className="userMenuItem" role="menuitem" onClick={logout}>
                  Log out
                </button>
              </div>
            </details>
          ) : (
            <Link href="/login" className="btn btnPrimary">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
