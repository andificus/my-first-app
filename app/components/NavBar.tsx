'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function NavBar() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false) // Fix hydration

  const menuRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)

  // ... (Your initials logic is fine)

  useEffect(() => {
    setIsMounted(true)
    let cancelled = false

    const getUserData = async (user: any) => {
      if (!user) {
        clearUserUI()
        return
      }
      setUserEmail(user.email ?? null)
      
      // Load avatar
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('user_id', user.id)
        .maybeSingle()
      
      if (!cancelled && data) setAvatarUrl(data.avatar_url)
    }

    // Initial check
    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) getUserData(data.user)
    })

    // Listen for changes
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!cancelled) {
        if (event === 'SIGNED_OUT') {
          clearUserUI()
        } else if (session?.user) {
          getUserData(session.user)
        }
      }
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  // ... (Your outside click logic is fine)

  const logout = async () => {
    setMenuOpen(false)
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  // Prevent rendering auth-dependent UI until mounted to stop flickering
  if (!isMounted) return <header className="navbar"><nav className="navbarInner" /></header>

  const loggedIn = !!userEmail

  return (
    <header className="navbar">
      <nav className="navbarInner">
        {/* Logo and other code... */}
        
        {loggedIn && (
          <div className="navbarLinks">
            {/* Nav links... */}
          </div>
        )}

        <div className="navbarRight">
          {loggedIn ? (
            <div className="avatarMenuWrap">
              <button ref={btnRef} onClick={() => setMenuOpen(!menuOpen)} className="avatarButton">
                {avatarUrl ? (
                  <Image 
                    src={avatarUrl} 
                    alt="Avatar" 
                    width={32} 
                    height={32} 
                    className="avatarImg" 
                    unoptimized // Profiles often use external URLs or S3
                  />
                ) : (
                  <span className="avatarInitials">{initials}</span>
                )}
              </button>
              {/* Menu code... */}
            </div>
          ) : (
            <Link href="/login" className="btn btnPrimary">Login</Link>
          )}
        </div>
      </nav>
    </header>
  )
}
