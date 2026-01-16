'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

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

    setMessage(error ? error.message : 'Account created. You can now log in.')
  }

  return (
    <main style={{ padding: 40, maxWidth: 420, margin: '80px auto' }}>
      <h1>Sign in</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 14 }}
      />

      <button className="btn btnPrimary" onClick={signIn} style={{ width: '100%' }}>
        Log in
      </button>

      <button className="btn btnGhost" onClick={resetPassword} style={{width: '100%', marginTop: 10}}>
        Forgot Pasword?  
      </button>
      
      <button
        className="btn btnGhost"
        onClick={signUp}
        style={{ width: '100%', marginTop: 10 }}
      >
        Create account
      </button>

      {message && <p style={{ marginTop: 14 }}>{message}</p>}
    </main>
  )
}
