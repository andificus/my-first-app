'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function NavBar() {
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        padding: '12px 20px',
        borderBottom: '1px solid #e5e5e5',
      }}
    >
      <Link href="/" style={{ fontWeight: 700 }}>
        My App
      </Link>

      <Link href="/">Dashboard</Link>
      <Link href="/profile">Profile</Link>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
        {userEmail ? (
          <>
            <span style={{ fontSize: 14, opacity: 0.8 }}>{userEmail}</span>
            <button onClick={logout}>Log out</button>
          </>
        ) : (
          <span style={{ fontSize: 14, opacity: 0.8 }}>Not logged in</span>
        )}
      </div>
    </div>
  )
}
