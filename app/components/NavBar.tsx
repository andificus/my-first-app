'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function NavBar() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)

  const initials = useMemo(() => {
    const email = (userEmail ?? '').trim()
    if (!email) return '?'
    const handle = email.split('@')[0] || email
    const parts = handle.split(/[\s._-]+/).filter(Boolean)
    const a = parts[0]?.[0] ?? handle[0] ?? '?'
    const b = parts[1]?.[0] ?? handle[1] ?? ''
    return (a + b).toUpperCase()
  }, [userEmail])

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

  function clearUserUI() {
    setUserEmail(null)
    setAvatarUrl(null)
    setMenuOpen(false)
  }

  // ✅ refresh-safe init + subscription
  useEffect(() => {
    let cancelled = false

    const init = async () => {
      try {
        // More reliable on refresh than getSession()
        const { data, error } = await supabase.auth.getUser()
        if (error) console.error('getUser error:', error.message)

        if (cancelled) return

        const user = data.user
        if (!user) {
          clearUserUI()
          return
        }

        setUserEmail(user.email ?? null)
        await loadAvatar(user.id)
      } catch (e) {
        console.error('NavBar init crash:', e)
        if (!cancelled) clearUserUI()
      }
    }

    init()

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cancelled) return

      const user = session?.user ?? null
      setMenuOpen(false)

      if (!user) {
        clearUserUI()
        return
      }

      setUserEmail(user.email ?? null)
      await loadAvatar(user.id)
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  // close dropdown on outside click + Escape
  useEffect(() => {
    if (!menuOpen) return

    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (menuRef.current?.contains(t)) return
      if (btnRef.current?.contains(t)) return
      setMenuOpen(false)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const logout = async () => {
    setMenuOpen(false)
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('signOut error:', error.message)
      return
    }
    // ✅ most reliable
    window.location.href = '/'
  }

  const loggedIn = !!userEmail

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

        {loggedIn && (
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
          {loggedIn ? (
            <div className="avatarMenuWrap">
              <button
                ref={btnRef}
                type="button"
                className="avatarButton"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Open user menu"
                onClick={() => setMenuOpen((v) => !v)}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="avatarImg" width={32} height={32} />
                ) : (
                  <span className="avatarInitials">{initials}</span>
                )}
              </button>

              {menuOpen && (
                <div ref={menuRef} className="userMenu card" role="menu" aria-label="User menu">
                  <div className="userMenuHeader">
                    <div className="userMenuName">Signed in</div>
                    <div className="userMenuEmail">{userEmail}</div>
                  </div>

                  <div className="userMenuDivider" />

                  <Link href="/dashboard" className="userMenuItem" role="menuitem" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/profile" className="userMenuItem" role="menuitem" onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>

                  <div className="userMenuDivider" />

                  <button type="button" className="userMenuItem" role="menuitem" onClick={logout}>
                    Log out
                  </button>
                </div>
              )}
            </div>
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
