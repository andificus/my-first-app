'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function NavBar() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  // ✅ add this
  const [authLoading, setAuthLoading] = useState(true)

  const router = useRouter()
  const detailsRef = useRef<HTMLDetailsElement | null>(null)

  const closeMenu = () => {
    if (detailsRef.current) detailsRef.current.open = false
  }

  const loadAvatar = async (userId: string) => {
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

  useEffect(() => {
    const init = async () => {
      setAuthLoading(true)

      // ✅ change getSession -> getUser (more reliable after refresh)
      const { data, error } = await supabase.auth.getUser()
      if (error) console.error('getUser error:', error.message)

      const user = data.user ?? null
      setUserEmail(user?.email ?? null)

      if (user) await loadAvatar(user.id)
      else setAvatarUrl(null)

      setAuthLoading(false)
    }

    init()

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null
      setUserEmail(user?.email ?? null)
      closeMenu()

      if (user) await loadAvatar(user.id)
      else setAvatarUrl(null)
    })

    return () => sub.subscription.unsubscribe()
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

        {/* ✅ only show logged-in nav after auth init finishes */}
        {!authLoading && userEmail && (
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
          {/* ✅ only show dropdown after auth init finishes */}
          {!authLoading && userEmail ? (
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
          ) : authLoading ? (
            // optional: tiny placeholder so layout doesn't jump
            <span className="navbarEmail">Loading…</span>
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
