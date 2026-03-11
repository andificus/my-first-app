'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Note = {
  id: string
  content: string
  created_at: string
}

type Props = {
  userId: string
}

export default function Notes({ userId }: Props) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [newContent, setNewContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const editRef = useRef<HTMLTextAreaElement>(null)

  // ── Load notes ──────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const { data, error } = await supabase
        .from('dashboard_notes')
        .select('id, content, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (cancelled) return
      if (error) {
        setError(error.message)
      } else {
        setNotes(data ?? [])
      }
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [userId])

  // Focus edit textarea when editing starts
  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus()
      // move cursor to end
      const len = editRef.current.value.length
      editRef.current.setSelectionRange(len, len)
    }
  }, [editingId])

  // ── Create ───────────────────────────────────────────────────────────────
  const createNote = async () => {
    const content = newContent.trim()
    if (!content) return

    setSaving(true)
    setError(null)

    const { data, error } = await supabase
      .from('dashboard_notes')
      .insert({ user_id: userId, content })
      .select('id, content, created_at')
      .single()

    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    setNotes((prev) => [data, ...prev])
    setNewContent('')
  }

  const handleCreateKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl + Enter to submit
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      createNote()
    }
  }

  // ── Edit ─────────────────────────────────────────────────────────────────
  const startEdit = (note: Note) => {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditContent('')
  }

  const saveEdit = async () => {
    const content = editContent.trim()
    if (!content || !editingId) return

    setError(null)

    const { error } = await supabase
      .from('dashboard_notes')
      .update({ content })
      .eq('id', editingId)
      .eq('user_id', userId)

    if (error) {
      setError(error.message)
      return
    }

    setNotes((prev) =>
      prev.map((n) => (n.id === editingId ? { ...n, content } : n))
    )
    setEditingId(null)
    setEditContent('')
  }

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      saveEdit()
    }
    if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  // ── Delete ───────────────────────────────────────────────────────────────
  const deleteNote = async (id: string) => {
    setDeletingId(id)
    setError(null)

    const { error } = await supabase
      .from('dashboard_notes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    setDeletingId(null)

    if (error) {
      setError(error.message)
      return
    }

    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h2 style={{ marginTop: 0, marginBottom: 16 }}>Notes</h2>

      {/* ── Compose area ── */}
      <div style={{ marginBottom: 20 }}>
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          onKeyDown={handleCreateKeyDown}
          placeholder="Write a note…"
          rows={3}
          className="input"
          style={{
            resize: 'vertical',
            fontFamily: 'inherit',
            fontSize: 14,
            lineHeight: 1.6,
            marginBottom: 8,
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className="btn btnPrimary"
            onClick={createNote}
            disabled={saving || !newContent.trim()}
            style={{ opacity: saving || !newContent.trim() ? 0.5 : 1 }}
          >
            {saving ? 'Saving…' : 'Add note'}
          </button>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>
            or ⌘↵ / Ctrl↵
          </span>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <p style={{ color: 'var(--status-error)', fontSize: 13, marginBottom: 12 }}>
          {error}
        </p>
      )}

      {/* ── Notes list ── */}
      {loading ? (
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading notes…</p>
      ) : notes.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          No notes yet. Add one above.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {notes.map((note) => (
            <div
              key={note.id}
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'var(--input-bg)',
                transition: 'opacity 0.15s ease',
                opacity: deletingId === note.id ? 0.4 : 1,
              }}
            >
              {editingId === note.id ? (
                /* ── Edit mode ── */
                <div>
                  <textarea
                    ref={editRef}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyDown={handleEditKeyDown}
                    rows={3}
                    className="input"
                    style={{
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      fontSize: 14,
                      lineHeight: 1.6,
                      marginBottom: 8,
                    }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btnPrimary"
                      onClick={saveEdit}
                      disabled={!editContent.trim()}
                      style={{ fontSize: 13, padding: '6px 12px', opacity: !editContent.trim() ? 0.5 : 1 }}
                    >
                      Save
                    </button>
                    <button
                      className="btn btnGhost"
                      onClick={cancelEdit}
                      style={{ fontSize: 13, padding: '6px 12px' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* ── View mode ── */
                <div>
                  <p style={{
                    margin: '0 0 10px 0',
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: 'var(--text)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {note.content}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {formatDate(note.created_at)}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn btnGhost"
                        onClick={() => startEdit(note)}
                        style={{ fontSize: 12, padding: '4px 10px' }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btnGhost"
                        onClick={() => deleteNote(note.id)}
                        disabled={deletingId === note.id}
                        style={{
                          fontSize: 12,
                          padding: '4px 10px',
                          color: 'var(--status-error)',
                          opacity: deletingId === note.id ? 0.5 : 1,
                        }}
                      >
                        {deletingId === note.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
