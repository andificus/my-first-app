'use client'

import { useEffect, useState } from 'react'
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
  const [userId, setUserId] = useState<string | null>(null) // internal UUID (keep for DB relations)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)

      try {
        // 1) try session
        const { data: s1, error: sErr } = await supabase.auth.getSession()
        if (sErr) console.error('getSession error:', sErr.message)

        let user = s1.session?.user ?? null

        // 2) fallback: getUser (but don't treat "missing session" as a real error)
        if (!user) {
          const { data: u1, error: uErr } = await supabase.auth.getUser()

          // Supabase often returns "Auth session missing!" when logged out — ignore that noise
          if (uErr && !String(uErr.message || '').toLowerCase().includes('auth session missing')) {
            console.error('getUser error:', uErr.message)
          }

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

        const { data: p, error: pErr } = await supabase
          .from('profiles')
          .select('full_name, bio, username')
          .eq('user_id', user.id)
          .maybeSingle()

        if (pErr) console.error('profiles error:', pErr.message)
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
    const { error } = await supabase.auth.signOut()
    if (error) console.error('signOut error:', error.message)
    window.location.href = '/login'
  }

  // ✅ compute display values WITHOUT hooks
  const displayName =
    profile?.full_name?.trim()
      ? profile.full_name
      : profile?.username?.trim()
        ? `@${profile.username}`
        : userEmail

  const profileComplete = Boolean(
    profile?.username?.trim() &&
    profile?.full_name?.trim() &&
    profile?.bio?.trim()
  )

  const totalFields = 3
  const doneFields =
    (profile?.username?.trim() ? 1 : 0) +
    (profile?.full_name?.trim() ? 1 : 0) +
    (profile?.bio?.trim() ? 1 : 0)

  const completionPercent = Math.round((doneFields / totalFields) * 100)

  if (loading) {
    return <main style={{ padding: 40 }}>Loading…</main>
  }

  return (
    <main style={{ padding: 40, maxWidth: 980, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>Dashboard</h1>
          <p style={{ marginTop: 0, color: 'var(--muted)' }}>
            Welcome, <b>{displayName}</b>
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

      <div style={{ marginTop: 16, display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Account</h2>

          <p style={{ margin: '8px 0', color: 'var(--muted)' }}>
            Username:<br />
            <b>{profile?.username?.trim() ? `@${profile.username}` : 'Not set'}</b>
          </p>

          <p style={{ margin: '8px 0', color: 'var(--muted)' }}>
            Email:<br />
            <b>{userEmail}</b>
          </p>

          <details style={{ marginTop: 10 }}>
            <summary style={{ color: 'var(--muted)', cursor: 'pointer' }}>Advanced</summary>
            <
