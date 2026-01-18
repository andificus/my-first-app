'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/dashboard')
    })
  }, [router])

  const signIn = async () => {
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  const resetPassword = async () => {
  setMessage('')

  // 👇 put it here
  if (!email.trim()) {
    setMessage('Enter your email first.')
    return
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  setMessage(error ? error.message : 'Check your email to set a password.')
}


  const signUp = async () => {
    setMessage('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    setMessage(error ? error.message : 'Account created. Check your email to verify.')
  }

  return (
    <main style={{ padding: 40, maxWidth: 420, margin: '80px auto' }}>
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Sign in</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          style={{ marginBottom: 10 }}
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          style={{ marginBottom: 18 }}
          autoComplete="current-password"
        />

        <button className="btn btnPrimary" onClick={signIn} style={{ width: '100%' }}>
          Log in
        </button>

        <button className="btn btnGhost" onClick={resetPassword} style={{ width: '100%', marginTop: 10 }}>
          Forgot password?
        </button>

        <button className="btn btnGhost" onClick={signUp} style={{ width: '100%', marginTop: 10 }}>
          Create account
        </button>

        {message && (
          <p style={{ marginTop: 14, color: 'var(--muted)' }}>
            {message}
          </p>
        )}
      </div>
    </main>
  )
}
