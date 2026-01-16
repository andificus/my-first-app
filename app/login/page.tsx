'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // If already logged in, go straight to dashboard
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/dashboard')
    })
  }, [router])

  const signIn = async () => {
    setMessage('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    })

    setMessage(error ? error.message : 'Check your email for the login link!')
  }

  return (
    <main style={{ padding: 40, maxWidth: 700, margin: '0 auto' }}>
      <h1>Login</h1>

      <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10, minWidth: 260, border: '1px solid #ccc', borderRadius: 8 }}
        />
        <button
          onClick={signIn}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #ccc', cursor: 'pointer' }}
        >
          Send Login Link
        </button>
      </div>

      {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}
    </main>
  )
}
