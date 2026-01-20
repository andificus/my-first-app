'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function NavBar() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const menuRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const avatarReqId = useRef(0)

  const initials = useMemo(() => {
    const email = (userEmail ?? '').trim()
    if (!email) return '?'
    const handle = email.split('@')[0] || email
    const parts = handle.split(/[\s._-]+/).filter(Boolean)
    const a = parts[0]?.[0] ?? handle[0] ?? '?'
    const b = parts[1]?.[0] ?? handle[1] ?? ''
    return (a + b).toUpperCase()
  }, [userEmail])

  function clearUserUI() {
    setUserEmail(null)
    setAvatarUrl(null)
    setMenuOpen(false)
  }

  const getUserData = async (user: { id: string; email?: string | null } | null) => {
    if (!user) {
      clearUserUI()
      return
    }

    setUserEmail(user.email ?? null)

    // protect against late responses overwriting current user
    const req = ++avatarReqId.current

    const { data, error } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) console.error('Avatar load error:', error.message)

    if (req !== avatarReqId.current) return
    setAvatarUrl(data?.avatar_url ?? null)
  }

  useEffect(() => {
    setIsMounted(true)
    let cancelled = false

    supabase.auth.getUser().then(({ data, error }) => {
      if (error) console.error('getUser error:', error.message)
      if (cancelled) return
      getUserData(data.user ? { id: data.user.id, email: data.user.email } : null)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return
      setMenuOpen(false)

      if (event === 'SIGNED_OUT' || !session?.user) {
        clearUserUI()
        return
      }

      getUserData({ id: session.user.id, email: session.user.email })
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return
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
    if (error) console.error('signOut error:', error.message)
    window.location.href = '/'
  }

  const loggedIn = isMounted && !!userEmail

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
                  <Image
                    src={avatarUrl}
                    alt="Avatar"
                    className="avatarImg"
                    width={32}
                    height={32}
                    unoptimized
                  />
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

                  <Link
                    href="/dashboard"
                    className="userMenuItem"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="userMenuItem"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  <div className="userMenuDivider" />

                  <button type="button" className="userMenuItem" role="menuitem" onClick={logout}>
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : isMounted ? (
            <Link href="/login" className="btn btnPrimary">
              Login
            </Link>
          ) : (
            // keep layout stable during first hydration tick
            <span style={{ width: 38, height: 38, display: 'inline-block' }} />
          )}
        </div>
      </nav>
    </header>
  )
}
