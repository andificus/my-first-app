'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'

type Profile = {
  full_name: string | null
  bio: string | null
  username: string | null
  avatar_url: string | null
  website: string | null
  location: string | null
  theme: 'system' | 'light' | 'dark' | null
  timezone: string | null
}
type Theme = 'system' | 'light' | 'dark'

const MAX_NAME = 80
const MAX_BIO = 500
const MAX_USERNAME = 20

const normalizeUsername = (s: string) => s.trim().toLowerCase()
const isValidUsername = (s: string) => /^[a-z0-9_]{3,20}$/.test(s)

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'idle' | 'error' | 'success' | 'info'; msg: string }>({
    type: 'idle',
    msg: '',
  })

  // ✅ IMPORTANT: initialize with ALL fields (this was missing)
  const emptyProfile: Profile = {
    full_name: '',
    bio: '',
    username: '',
    avatar_url: '',
    website: '',
    location: '',
    theme: 'system',
    timezone: '',
  }

  const [profile, setProfile] = useState<Profile>(emptyProfile)
  const [initialProfile, setInitialProfile] = useState<Profile>(emptyProfile)
  const [userId, setUserId] = useState<string | null>(null)
  const [currentEmail, setCurrentEmail] = useState<string>('')
  const [newEmail, setNewEmail] = useState<string>('')
  const [updatingEmail, setUpdatingEmail] = useState(false)
  
  const statusTimer = useRef<number | null>(null)
  const clearStatusSoon = (ms = 2500) => {
    if (statusTimer.current) window.clearTimeout(statusTimer.current)
    statusTimer.current = window.setTimeout(() => setStatus({ type: 'idle', msg: '' }), ms)
  }

  // ✅ IMPORTANT: dirty check includes ALL fields (yours only did name/bio)
  const dirty = useMemo(() => {
    const keys: (keyof Profile)[] = [
      'full_name',
      'bio',
      'username',
      'avatar_url',
      'website',
      'location',
      'theme',
      'timezone',
    ]
    return keys.some((k) => (profile[k] ?? '') !== (initialProfile[k] ?? ''))
  }, [profile, initialProfile])

    // ✅ Apply theme immediately when user changes dropdown
  useEffect(() => {
    const t: 'system' | 'light' | 'dark' = profile.theme ?? 'system'
    const root = document.documentElement

    if (t === 'system') {
      const isDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
      root.dataset.theme = isDark ? 'dark' : 'light'
    } else {
      root.dataset.theme = t
    }
  }, [profile.theme])



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
      setCurrentEmail(session.user.email ?? '')

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, bio, username, avatar_url, website, location, theme, timezone')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (error) {
        setStatus({ type: 'error', msg: error.message })
      } else {
        // ✅ IMPORTANT: store ALL fields (yours only kept full_name/bio)
        const next: Profile = {
          full_name: data?.full_name ?? '',
          bio: data?.bio ?? '',
          username: data?.username ?? '',
          avatar_url: data?.avatar_url ?? '',
          website: data?.website ?? '',
          location: data?.location ?? '',
          theme: (data?.theme as Profile['theme']) ?? 'system',
          timezone: data?.timezone ?? '',
        }
        setProfile(next)
        setInitialProfile(next)
      }

      setLoading(false)
    }

    load()

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

  // ✅ ADD THIS: avatar upload function (goes near save)
  const uploadAvatar = async (file: File) => {
    if (!userId) return

    setStatus({ type: 'info', msg: 'Uploading avatar…' })

    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const path = `${userId}/avatar-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      setStatus({ type: 'error', msg: uploadError.message })
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    const publicUrl = data.publicUrl

    // update UI immediately
    setProfile((p) => ({ ...p, avatar_url: publicUrl }))

    // persist avatar url
    const { error: dbError } = await supabase
      .from('profiles')
      .upsert({ user_id: userId, avatar_url: publicUrl }, { onConflict: 'user_id' })

    if (dbError) {
      setStatus({ type: 'error', msg: dbError.message })
      return
    }

    setStatus({ type: 'success', msg: 'Avatar updated!' })
    clearStatusSoon()
  }

  // Update Email
  const updateEmail = async () => {
  const email = newEmail.trim()
  if (!email) {
    setStatus({ type: 'error', msg: 'Enter a new email address.' })
    return
  }

  setUpdatingEmail(true)
  setStatus({ type: 'info', msg: 'Sending confirmation email…' })

  const { error } = await supabase.auth.updateUser({ email })

  setUpdatingEmail(false)

  if (error) {
    setStatus({ type: 'error', msg: error.message })
    return
  }

  setStatus({
    type: 'success',
    msg: 'Check your email to confirm the change. It won’t update until confirmed.',
  })
  setNewEmail('')
  clearStatusSoon(5000)
}


  const save = async () => {
    if (!userId) return
    if (!dirty) {
      setStatus({ type: 'info', msg: 'No changes to save.' })
      clearStatusSoon(1500)
      return
    }

    // validation + normalization
    const full_name = (profile.full_name ?? '').trim()
    const bio = (profile.bio ?? '').trim()
    const usernameRaw = (profile.username ?? '').trim()
    const username = usernameRaw ? normalizeUsername(usernameRaw) : null

    const website = (profile.website ?? '').trim() || null
    const location = (profile.location ?? '').trim() || null
    const theme = profile.theme ?? 'system'
    const timezone = (profile.timezone ?? '').trim() || null

    if (full_name.length > MAX_NAME) {
      setStatus({ type: 'error', msg: `Full name must be ${MAX_NAME} characters or fewer.` })
      return
    }
    if (bio.length > MAX_BIO) {
      setStatus({ type: 'error', msg: `Bio must be ${MAX_BIO} characters or fewer.` })
      return
    }

    if (username && !isValidUsername(username)) {
      setStatus({
        type: 'error',
        msg: `Username must be 3–${MAX_USERNAME} chars and only a-z, 0-9, underscore.`,
      })
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
          username,
          avatar_url: (profile.avatar_url ?? '').trim() || null,
          website,
          location,
          theme,
          timezone,
        },
        { onConflict: 'user_id' }
      )

    setSaving(false)

    if (error) {
      if (error.code === '23505') {
        setStatus({
          type: 'error',
          msg: 'That username is already taken. Please choose another.',
        })
      } else {
        setStatus({ type: 'error', msg: error.message })
      }
      return
    }



    const saved: Profile = {
      full_name: full_name || '',
      bio: bio || '',
      username: username || '',
      avatar_url: (profile.avatar_url ?? '').trim() || '',
      website: website || '',
      location: location || '',
      theme,
      timezone: timezone || '',
    }

    setProfile(saved)
    setInitialProfile(saved)

    setStatus({ type: 'success', msg: 'Saved!' })
    clearStatusSoon()
  }

  return (
    <main style={{ padding: 40, maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Profile</h1>
        <p style={{ marginTop: 8, color: 'var(--muted)' }}>Update your profile details.</p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : !userId ? (
        <p>{status.msg}</p>
      ) : (
        <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 20, background: 'var(--card)', color: 'var(--text)' }}>

          {/* ===== Avatar ===== */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
            <img
              src={profile.avatar_url || '/default-avatar.png'}
              alt="Avatar"
              style={{
                width: 72,
                height: 72,
                borderRadius: 999,
                objectFit: 'cover',
                border: '1px solid var(--border)',
              }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Avatar</div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) uploadAvatar(f)
                }}
              />
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>PNG/JPG recommended.</div>
            </div>
          </div>

          {/* ===== Username ===== */}
          <label style={{ display: 'block', marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Username</div>
            <input
              value={profile.username ?? ''}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  username: normalizeUsername(e.target.value),
                }))
              }
              maxLength={MAX_USERNAME}
              style={{
                  padding: 10,
                  width: '100%',
                  borderRadius: 10,
                  border: '1px solid var(--input-border)',
                  background: 'var(--input-bg)',
                  color: 'var(--text)',
                }}
              placeholder="your_handle"
            />
            <div style={{ fontSize: 12, color: '#777', marginTop: 6 }}>
              3–20 chars: a-z, 0-9, underscore
            </div>
          </label>
                    {/* ===== My Account (Auth) ===== */}
          <div style={{ marginBottom: 20, border: '1px solid var(--input-border)', borderRadius: 16, padding: 16, background: 'var(--card)' }}>       
            <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 10 }}>
              Current email:{' '}
              <span style={{ fontFamily: 'monospace' }}>{currentEmail || '—'}</span>
            </div>
          
            <label style={{ display: 'block', marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>New email</div>
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                style={{
                  padding: 10,
                  width: '100%',
                  borderRadius: 10,
                  border: '1px solid var(--input-border)',
                  background: 'var(--input-bg)',
                  color: 'var(--text)',
                }}
                placeholder="new@email.com"
                autoComplete="email"
              />
            </label>
          
            <button
              onClick={updateEmail}
              disabled={updatingEmail || !newEmail.trim()}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'var(--btn-bg)',
                color: 'var(--btn-text)',
                cursor: updatingEmail ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                opacity: updatingEmail ? 0.6 : 1,
              }}
            >
              {updatingEmail ? 'Updating…' : 'Update email'}
            </button>
          
            <div style={{ fontSize: 12, color: 'var(--btn-text)', marginTop: 8 }}>
              You’ll get a confirmation email before the change takes effect.
            </div>
          </div>

          {/* ===== Full name ===== */}
          <label style={{ display: 'block' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Full name</div>
            <input
              value={profile.full_name ?? ''}
              onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
              maxLength={MAX_NAME}
              style={{
                  padding: 10,
                  width: '100%',
                  borderRadius: 10,
                  border: '1px solid var(--input-border)',
                  background: 'var(--input-bg)',
                  color: 'var(--text)',
                }}
              autoComplete="name"
              placeholder="Your name"
            />
            <div style={{ fontSize: 12, color: '#777', marginTop: 6 }}>
              {(profile.full_name ?? '').trim().length}/{MAX_NAME}
            </div>
          </label>

          <div style={{ height: 18 }} />

          {/* ===== Bio ===== */}
          <label style={{ display: 'block' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Bio</div>
            <textarea
              value={profile.bio ?? ''}
              onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
              maxLength={MAX_BIO}
              style={{
                  padding: 10,
                  width: '100%',
                  borderRadius: 10,
                  border: '1px solid var(--input-border)',
                  background: 'var(--input-bg)',
                  color: 'var(--text)',
                }}
              placeholder="Short bio…"
            />
            <div style={{ fontSize: 12, color: '#777', marginTop: 6 }}>
              {(profile.bio ?? '').trim().length}/{MAX_BIO}
            </div>
          </label>

          <div style={{ height: 18 }} />

          {/* ===== Website + Location ===== */}
          <label style={{ display: 'block', marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Website</div>
            <input
              value={profile.website ?? ''}
              onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
              style={{
                padding: 10,
                width: '100%',
                borderRadius: 10,
                border: '1px solid var(--input-border)',
                background: 'var(--input-bg)',
                color: 'var(--text)',
              }}
              placeholder="https://example.com"
            />
          </label>

          <label style={{ display: 'block', marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Location</div>
            <input
              value={profile.location ?? ''}
              onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
              style={{
                padding: 10,
                width: '100%',
                borderRadius: 10,
                border: '1px solid var(--input-border)',
                background: 'var(--input-bg)',
                color: 'var(--text)',
              }}
              placeholder="Rock Island, IL"
            />
          </label>

          {/* ===== Preferences ===== */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
            <label style={{ flex: '1 1 220px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Theme</div>
              <select
                value={profile.theme ?? 'system'}
                onChange={(e) => {
                  const t = (e.target.value as Theme)
                  setProfile((p) => ({ ...p, theme: t }))

                  // apply instantly (even before saving)
                  const root = document.documentElement
                  if (t === 'system') {
                    const isDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
                    root.dataset.theme = isDark ? 'dark' : 'light'
                  } else {
                    root.dataset.theme = t
                  }
                }}

                style={{
                  padding: 10,
                  width: '100%',
                  borderRadius: 10,
                  border: '1px solid var(--input-border)',
                  background: 'var(--input-bg)',
                  color: 'var(--text)',
                }}
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>

            <label style={{ flex: '1 1 220px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Timezone</div>
              <input
                value={profile.timezone ?? ''}
                onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))}
                style={{
                  padding: 10,
                  width: '100%',
                  borderRadius: 10,
                  border: '1px solid var(--input-border)',
                  background: 'var(--input-bg)',
                  color: 'var(--text)',
                }}
                placeholder="America/Chicago"
              />
            </label>
          </div>

          {/* ===== Save row ===== */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
            <button
              onClick={save}
              disabled={saving || !dirty}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'var(--btn-bg)',
                color: 'var(--btn-text)',
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
