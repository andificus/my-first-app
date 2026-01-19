'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Profile = {
  full_name: string | null
  bio: string | null
  username: string | null
}

export default function DashboardPage() {
  const router = useRouter()

  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null) // internal UUID
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)

      try {
        // 1) session
        const { data: s1 } = await supabase.auth.getSession()
        let user = s1.session?.user ?? null

        // 2) fallback (refresh race protection)
        if (!user) {
          const { data: u1 } = await supabase.auth.getUser()
          user = u1.user ?? null
        }

        if (cancelled) return

        if (!user) {
          setLoading(false)
          router.replace('/login')
          return
        }

        setUserEmail(user.email ?? null)
        setUserId(user.id)

        const { data: p, error } = await supabase
          .from('profiles')
          .select('full_name, bio, username')
          .eq('user_id', user.id)
          .maybeSingle()

        if (error) console.error('profiles error:', error.message)
        if (cancelled) return

        setProfile(p ?? { full_name: null, bio: null, username: null })
      } catch (e) {
        console.error('dashboard load crash:', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [router])

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return <main style={{ padding: 40 }}>Loading…</main>
  }

  /**
   * DISPLAY LOGIC
   */
  const displayUsername =
    profile?.username?.trim()
      ? `@${profile.username}`
      : userEmail

  const profileComplete = Boolean(
    profile?.username?.trim() &&
    profile?.full_name?.trim() &&
    profile?.bio?.trim()
  )

  const completionPercent = useMemo(() => {
    let done = 0
    let total = 3

    if (profile?.username?.trim()) done++
    if (profile?.full_name?.trim()) done++
    if (profile?.bio?.trim()) done++

    return Math.round((done / total) * 100)
  }, [profile])

  return (
    <main style={{ padding: 40, maxWidth: 980, margin: '0 auto' }}>
      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>Dashboard</h1>
          <p style={{ marginTop: 0, color: 'var(--muted)' }}>
            Welcome, <b>{displayUsername}</b>
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/profile" className="btn btnGhost">
            Manage Profile
          </Link>
          <Link href="/reset-password" className="btn btnGhost">
            Change Password
          </Link>
          <button className="btn btnGhost" onClick={signOut}>
            Log out
          </button>
        </div>
      </div>

      {/* PROFILE COMPLETION */}
      <div className="card" style={{ marginTop: 18 }}>
        <h2 style={{ marginTop: 0 }}>Profile completion</h2>
        <p style={{ color: 'var(--muted)' }}>
          {profileComplete
            ? 'Your profile is complete.'
            : `You are ${completionPercent}% done. Finish your profile to personalize your dashboard.`}
        </p>

        {!profileComplete && (
          <Link href="/profile" className="btn btnPrimary">
            Complete profile
          </Link>
        )}
      </div>

      {/* GRID */}
      <div
        style={{
          marginTop: 16,
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        {/* ACCOUNT */}
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Account</h2>

          <p style={{ margin: '8px 0', color: 'var(--muted)' }}>
            Username:
            <br />
            <b>{profile?.username ?? 'Not set'}</b>
          </p>

          <p style={{ margin: '8px 0', color: 'var(--muted)' }}>
            Email:
            <br />
            <b>{userEmail}</b>
          </p>

          {/* UUID hidden by default */}
          <details style={{ marginTop: 10 }}>
            <summary style={{ color: 'var(--muted)', cursor: 'pointer' }}>
              Advanced
            </summary>
            <div
              style={{
                marginTop: 8,
                color: 'var(--muted)',
                wordBreak: 'break-all',
                fontSize: 13,
              }}
            >
              Internal ID: {userId}
            </div>
          </details>
        </div>

        {/* PROFILE SUMMARY */}
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Profile</h2>

          <p style={{ margin: '8px 0' }}>
            Name: <b>{profile?.full_name ?? '—'}</b>
          </p>

          <p style={{ margin: '8px 0' }}>
            Bio:
            <br />
            <span>{profile?.bio ?? '—'}</span>
          </p>
        </div>
      </div>
    </main>
  )
}
