'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // user is allowed to update password
      }
    })
  }, [])

  const updatePassword = async () => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Password updated. Redirecting…')
      setTimeout(() => router.replace('/dashboard'), 1500)
    }
  }

  return (
    <main style={{ padding: 40, maxWidth: 420, margin: '80px auto' }}>
      <h1>Set a new password</h1>

      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 14 }}
      />

      <button className="btn btnPrimary" onClick={updatePassword} style={{ width: '100%' }}>
        Set password
      </button>

      {message && <p style={{ marginTop: 14 }}>{message}</p>}
    </main>
  )
}
