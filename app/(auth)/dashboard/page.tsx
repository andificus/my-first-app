'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

type Profile = { full_name: string | null; bio: string | null }

export default function DashboardPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const { data } = await supabase.auth.getSession()
      const session = data.session

      if (!session) {
        router.replace('/login')
        return
      }

      setUserEmail(session.user.email ?? null)
      setUserId(session.user.id)

      const { data: p } = await supabase
        .from('profiles')
        .select('full_name, bio')
        .eq('user_id', session.user.id)
        .maybeSingle()

      setProfile(p ?? { full_name: null, bio: null })
      setLoading(false)
    }

    load()
  }, [router])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (loading) {
    return <main style={{ padding: 40 }}>Loading…</main>
  }

  const displayName = profile?.full_name?.trim() ? profile.full_name : userEmail
  const profileComplete = Boolean(profile?.full_name?.trim() && profile?.bio?.trim())

  return (
    <main style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>Dashboard</h1>
          <p style={{ marginTop: 0, color: 'var(--muted)' }}>
            Welcome, <b>{displayName}</b>
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/profile" className="btn btnGhost" style={{ borderRadius: 8 }}>
            Manage Profile
          </Link>
          <Link href="/reset-password" className="btn btnGhost" style={{ borderRadius: 8 }}>
            Change Password
          </Link>
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="card" style={{ padding: 18, borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Account</h2>
          <p style={{ margin: '8px 0', color: 'var(--muted)' }}>
            Signed in as:<br /><b>{userEmail}</b>
          </p>
          <p style={{ margin: '8px 0', color: 'var(--muted)' }}>
            Status: {profileComplete ? 'Profile complete ✅' : 'Profile incomplete ⚠️'}
          </p>
        </div>

        <div className="card" style={{ padding: 18, borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Profile</h2>
          <p style={{ margin: '8px 0' }}>Name: <b>{profile?.full_name ?? '—'}</b></p>
          <p style={{ margin: '8px 0' }}>
            Bio:<br /><span style={{ color: 'var(--text)' }}>{profile?.bio ?? '—'}</span>
          </p>
        </div>

        <div className="card" style={{ padding: 18, borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Next steps</h2>
          <ol style={{ margin: 0, paddingLeft: 18, color: 'var(--muted)' }}>
            <li>Add notes</li>
            <li>Mobile styling</li>
            <li>Pro feature toggle</li>
          </ol>
        </div>
      </div>
    </main>
  )
}
