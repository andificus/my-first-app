'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type Profile = {
  full_name: string | null
  bio: string | null
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [profile, setProfile] = useState<Profile>({ full_name: '', bio: '' })
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setStatus('')

      const { data: sessionData } = await supabase.auth.getSession()
      const session = sessionData.session
      if (!session) {
        setStatus('You must be logged in to view this page.')
        setLoading(false)
        return
      }

      setUserId(session.user.id)

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, bio')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (error) {
        setStatus(error.message)
      } else if (data) {
        setProfile({ full_name: data.full_name, bio: data.bio })
      }

      setLoading(false)
    }

    load()
  }, [])

  const save = async () => {
    if (!userId) return
    setStatus('Saving...')

    const { error } = await supabase.from('profiles').upsert({
      user_id: userId,
      full_name: profile.full_name,
      bio: profile.bio,
      updated_at: new Date().toISOString(),
    })

    setStatus(error ? error.message : 'Saved!')
  }

  return (
    <main style={{ padding: 40, maxWidth: 700 }}>
      <h1>Profile</h1>

      {loading ? (
        <p>Loading...</p>
      ) : !userId ? (
        <p>{status}</p>
      ) : (
        <>
          <label>
            Full name
            <br />
            <input
              value={profile.full_name ?? ''}
              onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
              style={{ padding: 8, width: '100%' }}
            />
          </label>

          <br /><br />

          <label>
            Bio
            <br />
            <textarea
              value={profile.bio ?? ''}
              onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
              style={{ padding: 8, width: '100%', minHeight: 120 }}
            />
          </label>

          <br /><br />

          <button onClick={save}>Save</button>
          <p>{status}</p>
        </>
      )}
    </main>
  )
}
