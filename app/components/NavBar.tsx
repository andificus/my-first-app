'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
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
      setMenuOpen(false)

      if (!user) {
        setDisplayName(null)
        setAvatarUrl(null)
        return
      }

      await loadProfileForUser(user.id)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  // Close dropdown on outside click + Escape
  useEffect(() => {
    if (!menuOpen) return

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (menuRef.current?.contains(target)) return
      if (buttonRef.current?.contains(target)) return
      setMenuOpen(false)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const logout = async () => {
    await supabase.auth.signOut()
    setUserEmail(null)
    setDisplayName(null)
    setAvatarUrl(null)
    setMenuOpen(false)
    router.push('/')
  }

  return (
    <header className="navbar">
      <nav className="navbarInner">
        {/* Brand / Home */}
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

        {/* Primary nav (only when logged in) */}
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

        {/* Right side */}
        <div className="navbarRight">
          {userEmail ? (
            <div className="avatarMenuWrap">
              <button
                ref={buttonRef}
                type="button"
                className="avatarButton"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Open user menu"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName || userEmail || 'User'}
                    className="avatarImg"
                    width={32}
                    height={32}
                  />
                ) : (
                  <span className="avatarInitials" aria-hidden="true">
                    {initials}
                  </span>
                )}
              </button>

              {menuOpen && (
                <div ref={menuRef} className="userMenu card" role="menu" aria-label="User menu">
                  <div className="userMenuHeader">
                    <div className="userMenuName">{displayName || 'Signed in'}</div>
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
