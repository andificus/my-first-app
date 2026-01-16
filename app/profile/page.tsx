'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type Profile = {
  full_name: string | null
  bio: string | null
}

const MAX_NAME = 80
const MAX_BIO = 500

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'idle' | 'error' | 'success' | 'info'; msg: string }>({
    type: 'idle',
    msg: '',
  })

  const [profile, setProfile] = useState<Profile>({ full_name: '', bio: '' })
  const [initialProfile, setInitialProfile] = useState<Profile>({ full_name: '', bio: '' })
  const [userId, setUserId] = useState<string | null>(null)

  const statusTimer = useRef<number | null>(null)

  const clearStatusSoon = (ms = 2500) => {
    if (statusTimer.current) window.clearTimeout(statusTimer.current)
    statusTimer.current = window.setTimeout(() => setStatus({ type: 'idle', msg: '' }), ms)
  }

  const dirty = useMemo(() => {
    return (profile.full_name ?? '') !== (initialProfile.full_name ?? '') || (profile.bio ?? '') !== (initialProfile.bio ?? '')
  }, [profile, initialProfile])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setStatus({ type: 'idle', msg: '' })

      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession()
      if (sessionErr) {
        setStatus({ type: 'error', msg: sessionErr.message })
        setLoading(false)
        return
      }

      const session = sessionData.session
      if (!session) {
        setStatus({ type: 'info', msg: 'You must be logged in to view this page.' })
        setUserId(null)
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
        setStatus({ type: 'error', msg: error.message })
      } else {
        const next = { full_name: data?.full_name ?? '', bio: data?.bio ?? '' }
        setProfile(next)
        setInitialProfile(next)
      }

      setLoading(false)
    }

    load()

    // Optional: respond to auth changes (logout/login in another tab, etc.)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUserId(null)
        setStatus({ type: 'info', msg: 'You must be logged in to view this page.' })
      }
    })

    return () => {
      sub.subscription.unsubscribe()
      if (statusTimer.current) window.clearTimeout(statusTimer.current)
    }
  }, [])

  const save = async () => {
    if (!userId) return
    if (!dirty) {
      setStatus({ type: 'info', msg: 'No changes to save.' })
      clearStatusSoon(1500)
      return
    }

    // simple validation
    const full_name = (profile.full_name ?? '').trim()
    const bio = (profile.bio ?? '').trim()

    if (full_name.length > MAX_NAME) {
      setStatus({ type: 'error', msg: `Full name must be ${MAX_NAME} characters or fewer.` })
      return
    }
    if (bio.length > MAX_BIO) {
      setStatus({ type: 'error', msg: `Bio must be ${MAX_BIO} characters or fewer.` })
      return
    }

    setSaving(true)
    setStatus({ type: 'info', msg: 'Saving…' })

    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          user_id: userId,
          full_name: full_name || null,
          bio: bio || null,
          // NOTE: don't send updated_at if you add the DB trigger
        },
        { onConflict: 'user_id' }
      )

    setSaving(false)

    if (error) {
      setStatus({ type: 'error', msg: error.message })
      return
    }

    // mark as saved
    const saved = { full_name: full_name || '', bio: bio || '' }
    setProfile(saved)
    setInitialProfile(saved)

    setStatus({ type: 'success', msg: 'Saved!' })
    clearStatusSoon()
  }

  return (
    <main style={{ padding: 40, maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Profile</h1>
        <p style={{ marginTop: 8, color: '#666' }}>Update your profile details.</p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : !userId ? (
        <p>{status.msg}</p>
      ) : (
        <div style={{ border: '1px solid #e5e5e5', borderRadius: 16, padding: 20 }}>
          <label style={{ display: 'block' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Full name</div>
            <input
              value={profile.full_name ?? ''}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  full_name: e.target.value,
                }))
              }
              maxLength={MAX_NAME}
              style={{ padding: 10, width: '100%', borderRadius: 10, border: '1px solid #ccc' }}
              autoComplete="name"
              placeholder="Your name"
            />
            <div style={{ fontSize: 12, color: '#777', marginTop: 6 }}>
              {(profile.full_name ?? '').trim().length}/{MAX_NAME}
            </div>
          </label>

          <div style={{ height: 18 }} />

          <label style={{ display: 'block' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Bio</div>
            <textarea
              value={profile.bio ?? ''}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  bio: e.target.value,
                }))
              }
              maxLength={MAX_BIO}
              style={{
                padding: 10,
                width: '100%',
                minHeight: 140,
                borderRadius: 10,
                border: '1px solid #ccc',
                resize: 'vertical',
              }}
              placeholder="Short bio…"
            />
            <div style={{ fontSize: 12, color: '#777', marginTop: 6 }}>
              {(profile.bio ?? '').trim().length}/{MAX_BIO}
            </div>
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
            <button
              onClick={save}
              disabled={saving || !dirty}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid #ccc',
                background: saving || !dirty ? '#f5f5f5' : '#fff',
                cursor: saving || !dirty ? 'not-allowed' : 'pointer',
                fontWeight: 600,
              }}
            >
              {saving ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
            </button>

            {status.msg ? (
              <span
                style={{
                  fontSize: 13,
                  color: status.type === 'error' ? '#b00020' : status.type === 'success' ? '#0a7a2f' : '#444',
                }}
                aria-live="polite"
              >
                {status.msg}
              </span>
            ) : null}
          </div>
        </div>
      )}
    </main>
  )
}
