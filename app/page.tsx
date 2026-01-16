'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setMessage(error.message)
    else setMessage('Check your email for the login link!')
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="email@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ padding: 8 }}
      />

      <br /><br />

      <button onClick={signIn}>
        Send Login Link
      </button>

      <p>{message}</p>
    </main>
  )
}
