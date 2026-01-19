'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Profile = { full_name: string | null; bio: string | null }
type Note = { id: string; content: string; created_at: string }

function formatTime(ts: string) {
  const d = new Date(ts)
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export default function DashboardPage() {
  const router = useRouter()

  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)

  const [loading, setLoading] = useState(true)
  const [notesLoading, setNotesLoading] = useState(false)

  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [noteError, setNoteError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)

      try {
        const { data: s1, error: sErr } = await supabase.auth.getSession()
        if (sErr) console.error('getSession error:', sErr.message)

        let user = s1.session?.user ?? null

        if (!user) {
          const { data: u1, error: uErr } = await supabase.auth.getUser()
          if (uErr) console.error('getUser error:', uErr.message)
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
          .select('full_name, bio')
          .eq('user_id', user.id)
          .maybeSingle()

        if (pErr) console.error('profiles error:', pErr.message)
        if (cancelled) return

        setProfile(p ?? { full_name: null, bio: null })

        // load notes after we know user is set
        await loadNotes(user.id, cancelled)
      } catch (e) {
        console.error('dashboard load crash:', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    const loadNotes = async (uid: string, cancelledFlag: boolean) => {
      setNotesLoading(true)
      try {
        const { data, error } = await supabase
          .from('dashboard_notes')
          .select('id, content, created_at')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
          .limit(20)

        if (error) {
          console.error('notes load error:', error.message)
          return
        }
        if (!cancelledFlag) setNotes((data ?? []) as Note[])
      } finally {
        if (!cancelledFlag) setNotesLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [router])

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('signOut error:', error.message)
      return
    }
    window.location.href = '/login'
  }

  const displayName = profile?.full_name?.trim() ? profile.full_name : userEmail

  const completion = useMemo(() => {
    let total = 0
    let done = 0

    total += 1
    if (userEmail) done += 1

    total += 1
    if (profile?.full_name?.trim()) done += 1

    total += 1
    if (profile?.bio?.trim()) done += 1

    const percent = total ? Math.round((done / total) * 100) : 0
    return { done, total, percent, isComplete: percent === 100 }
  }, [userEmail, profile])

  const addNote = async () => {
    setNoteError(null)

    const content = newNote.trim()
    if (!content) {
      setNoteError('Write a note first.')
      return
    }
    if (!userId) {
      setNoteError('Not signed in.')
      return
    }

    setNotesLoading(true)
    try {
      const { data, error } = await supabase
        .from('dashboard_notes')
        .insert([{ user_id: userId, content }])
        .select('id, content, created_at')
        .single()

      if (error) {
        setNoteError(error.message)
        return
      }

      setNotes((prev) => [data as Note, ...prev])
      setNewNote('')
    } finally {
      setNotesLoading(false)
    }
  }

  const deleteNote = async (id: string) => {
    if (!userId) return

    // optimistic
    const prev = notes
    setNotes((n) => n.filter((x) => x.id !== id))

    const { error } = await supabase
      .from('dashboard_notes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('delete note error:', error.message)
      setNotes(prev) // rollback
    }
  }

  if (loading) {
    return <main style={{ padding: 40 }}>Loading…</main>
  }

  return (
    <main style={{ padding: 40, maxWidth: 980, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>Dashboard</h1>
          <p style={{ marginTop: 0, color: 'var(--muted)' }}>
            Welcome, <b>{displayName}</b>
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/profile" className="btn btnGhost" style={{ borderRadius: 8 }}>
            Manage Profile
          </Link>
          <Link href="/reset-password" className="btn btnGhost" style={{ borderRadius: 8 }}>
            Change Password
          </Link>
          <button className="btn btnGhost" style={{ borderRadius: 8 }} onClick={signOut}>
            Log out
          </button>
        </div>
      </div>

      {/* Profile completion callout */}
      <div className="card" style={{ marginTop: 18, padding: 18, borderRadius: 12 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ marginTop: 0, marginBottom: 6 }}>Profile completeness</h2>
            <p style={{ margin: 0, color: 'var(--muted)' }}>
              {completion.isComplete
                ? 'You’re all set. Your profile looks complete.'
                : `You’re ${completion.percent}% done. Finish it to make the app feel “yours.”`}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ minWidth: 120, textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{completion.percent}%</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                {completion.done}/{completion.total} fields
              </div>
            </div>

            {!completion.isComplete && (
              <Link href="/profile" className="btn btnPrimary" style={{ borderRadius: 10 }}>
                Complete profile
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          marginTop: 16,
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          alignItems: 'start',
        }}
      >
        {/* Account */}
        <div className="card" style={{ padding: 18, borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Account</h2>
          <p style={{ margin: '8px 0', color: 'var(--muted)' }}>
            Signed in as:<br />
            <b>{userEmail}</b>
          </p>
          <p style={{ margin: '8px 0', color: 'var(--muted)' }}>
            User ID:<br />
            <span style={{ wordBreak: 'break-all' }}>{userId}</span>
          </p>
        </div>

        {/* Profile summary */}
        <div className="card" style={{ padding: 18, borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>Profile</h2>
          <p style={{ margin: '8px 0' }}>
            Name: <b>{profile?.full_name?.trim() ? profile.full_name : '—'}</b>
          </p>
          <p style={{ margin: '8px 0' }}>
            Bio:<br />
            <span style={{ color: 'var(--text)' }}>{profile?.bio?.trim() ? profile.bio : '—'}</span>
          </p>
          {!profile?.bio?.trim() && (
            <p style={{ marginTop: 12, color: 'var(--muted)' }}>
              Tip: Add a short bio so this dashboard feels personalized.
            </p>
          )}
        </div>

        {/* Notes (real feature) */}
        <div className="card" style={{ padding: 18, borderRadius: 12 }}>
          <h2 style={{ marginTop: 0, marginBottom: 6 }}>Notes</h2>
          <p style={{ marginTop: 0, color: 'var(--muted)' }}>
            Quick personal notes saved to your account.
          </p>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              className="input"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note…"
              style={{ flex: 1 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addNote()
              }}
            />
            <button className="btn btnPrimary" onClick={addNote} disabled={notesLoading}>
              Add
            </button>
          </div>

          {noteError && <p style={{ marginTop: 10, color: 'var(--muted)' }}>{noteError}</p>}

          <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
            {notesLoading && notes.length === 0 ? (
              <p style={{ margin: 0, color: 'var(--muted)' }}>Loading notes…</p>
            ) : notes.length === 0 ? (
              <p style={{ margin: 0, color: 'var(--muted)' }}>No notes yet. Add your first one.</p>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="card" style={{ padding: 12, borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ color: 'var(--text)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {n.content}
                      <div style={{ marginTop: 6, fontSize: 12, color: 'var(--muted)' }}>{formatTime(n.created_at)}</div>
                    </div>
                    <button className="btn btnGhost" onClick={() => deleteNote(n.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
