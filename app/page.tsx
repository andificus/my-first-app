'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

type Profile = {
  full_name: string | null
  bio: string | null
}

export default function Home() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  useEffect(() => {
    // Load current session
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session
      setUserEmail(session?.user?.email ?? null)
      setUserId(session?.user?.id ?? null)
    })

    // React to login/logout changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
      setUserId(session?.user?.id ?? null)
      setProfile(null)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return
      setLoadingProfile(true)

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, bio')
        .eq('user_id', userId)
        .maybeSingle()

      if (!error) setProfile(data ?? { full_name: null, bio: null })
      setLoadingProfile(false)
    }

    loadProfile()
  }, [userId])

  const signIn = async () => {
    setMessage('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    setMessage(error ? error.message : 'Check your email for the login link!')
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setMessage('Logged out.')
  }

  // ---------- Logged OUT ----------
  if (!userEmail) {
    return (
      <main style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>Welcome</h1>
        <p style={{ marginTop: 0, opacity: 0.8 }}>
          Log in to access your dashboard.
        </p>

        <div
          style={{
            marginTop: 24,
            padding: 20,
            border: '1px solid #e5e5e5',
            borderRadius: 12,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Login</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: 10,
                minWidth: 260,
                border: '1px solid #ccc',
                borderRadius: 8,
              }}
            />
            <button
              onClick={signIn}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid #ccc',
                cursor: 'pointer',
              }}
            >
              Send Login Link
            </button>
          </div>

          {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}
        </div>
      </main>
    )
  }

  // ---------- Logged IN ----------
  const displayName = profile?.full_name?.trim() ? profile.full_name : userEmail
  const profileComplete = Boolean(profile?.full_name?.trim() && profile?.bio?.trim())

  return (
    <main style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>Dashboard</h1>
          <p style={{ marginTop: 0, opacity: 0.8 }}>
            Welcome, <b>{displayName}</b>
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link
            href="/profile"
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #ccc',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Edit Profile
          </Link>
          <button
            onClick={signOut}
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            Log out
          </button>
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {/* Card 1 */}
        <div style={{ padding: 18, border: '1px solid #e5e5e5', borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Account</h2>
          <p style={{ margin: '8px 0' }}>
            Signed in as:
            <br />
            <b>{userEmail}</b>
          </p>
          <p style={{ margin: '8px 0', opacity: 0.8 }}>
            Status: {profileComplete ? 'Profile complete ✅' : 'Profile incomplete ⚠️'}
          </p>
        </div>

        {/* Card 2 */}
        <div style={{ padding: 18, border: '1px solid #e5e5e5', borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Profile</h2>
          {loadingProfile ? (
            <p>Loading profile…</p>
          ) : (
            <>
              <p style={{ margin: '8px 0' }}>
                Name: <b>{profile?.full_name ?? '—'}</b>
              </p>
              <p style={{ margin: '8px 0' }}>
                Bio:
                <br />
                <span style={{ opacity: 0.9 }}>{profile?.bio ?? '—'}</span>
              </p>
            </>
          )}
        </div>

        {/* Card 3 */}
        <div style={{ padding: 18, border: '1px solid #e5e5e5', borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Next steps</h2>
          <ol style={{ margin: 0, paddingLeft: 18, opacity: 0.9 }}>
            <li>Add a “Notes” feature</li>
            <li>Make it mobile-friendly</li>
            <li>Add a Pro feature toggle</li>
          </ol>
          <p style={{ marginTop: 12 }}>
            Want to build Notes next? (It’s the best “real app” upgrade.)
          </p>
        </div>
      </div>

      {message ? <p style={{ marginTop: 18 }}>{message}</p> : null}
    </main>
  )
}
