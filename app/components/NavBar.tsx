'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

type ProfileRow = {
  avatar_url: string | null
  full_name: string | null
  username: string | null
}

export default function NavBar() {
  const router = useRouter()

  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement | null>(null)
  const avatarButtonRef = useRef<HTMLButtonElement | null>(null)

  const initials = useMemo(() => {
    const base = displayName || userEmail || ''
    const cleaned = base.split('@')[0]?.trim() || ''
    if (!cleaned) return '?'
    const parts = cleaned.split(/[.\s_-]+/).filter(Boolean)
    const first = parts[0]?.[0] ?? cleaned[0]
    const second = parts[1]?.[0] ?? cleaned[1] ?? ''
    return (first + second).toUpperCase()
  }, [displayName, userEmail])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user ?? null

      setUserEmail(sessionUser?.email ?? null)

      if (!sessionUser) {
        setAvatarUrl(null)
        setDisplayName(null)
        return
      }

      // Try to fetch profile info (optional)
      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url, full_name, username')
        .eq('id', sessionUser.id)
        .maybeSingle<ProfileRow>()

      setAvatarUrl(profile?.avatar_url ?? null)
      setDisplayName(profile?.full_name ?? profile?.username ?? null)
    }

    load()

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user ?? null
      setUserEmail(sessionUser?.email ?? null)

      if (!sessionUser) {
        setAvatarUrl(null)
        setDisplayName(null)
        setMenuOpen(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url, full_name, username')
        .eq('id', sessionUser.id)
        .maybeSingle<ProfileRow>()

      setAvatarUrl(profile?.avatar_url ?? null)
      setDisplayName(profile?.full_name ?? profile?.username ?? null)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return

    const onDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (!menuRef.current) return
      if (menuRef.current.contains(target)) return
      if (avatarButtonRef.current?.contains(target)) return
      setMenuOpen(false)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const logout = async () => {
    await supabase.auth.signOut()
    setUserEmail(null)
    setAvatarUrl(null)
    setDisplayName(null)
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
                ref={avatarButtonRef}
                type="button"
                className="avatarButton"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Open user menu"
              >
                {avatarUrl ? (
                  // If you store full URL, use it directly. If you store just a path, adapt here.
                  // Keep Next Image for optimization.
                  <Image
                    src={avatarUrl}
                    alt={displayName || userEmail || 'User'}
                    width={32}
                    height={32}
                    className="avatarImg"
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

                  <Link href="/dashboard" className="userMenuItem" role="menuitem" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/profile" className="userMenuItem" role="menuitem" onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>

                  <div className="userMenuDivider" />

                  <button type="button" className="userMenuItem danger" role="menuitem" onClick={logout}>
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
