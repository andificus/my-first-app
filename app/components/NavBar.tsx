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
    setUserEmail(null)
    closeMenu()
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
            <details ref={detailsRef} className="userDropdown">
              <summary className="avatarButton" aria-label="Open user menu">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="avatarImg"
                    width={32}
                    height={32}
                  />
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
