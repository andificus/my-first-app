'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'


export default function NavBar() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setUserEmail(null)
    router.push('/') // send them to Home
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(14px)',
        background: 'color-mix(in srgb, var(--card) 85%, transparent)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <nav
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
        }}
      >
        {/* Brand / Home */}
        <Link
          href="/"
          style={{
            fontWeight: 700,
            letterSpacing: '-0.02em',
            fontSize: 16,
            textDecoration: 'none',
            color: 'var(--text)',
          }}
        >
          My App
        </Link>

        {/* Primary nav (only when logged in) */}
        {userEmail && (
          <div style={{ display: 'flex', gap: 14 }}>
            <Link href="/dashboard" className="navLink">
              Dashboard
            </Link>
            <Link href="/profile" className="navLink">
              Profile
            </Link>
          </div>
        )}

        {/* Right side */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, alignItems: 'center' }}>
          {userEmail ? (
            <>
              <span
                style={{
                  fontSize: 13,
                  color: 'var(--muted)',
                  whiteSpace: 'nowrap',
                }}
              >
                {userEmail}
              </span>
              <button className="btn btnGhost" onClick={logout}>
                Log out
              </button>
            </>
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
