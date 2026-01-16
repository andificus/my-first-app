'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // On load, see if we already have a session
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user?.email ?? null)
    })

    // Listen for auth changes (login/logout)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  const signIn = async () => {
    setMessage('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })

    if (error) setMessage(error.message)
    else setMessage('Check your email for the login link!')
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setMessage('Logged out.')
  }

  // Logged-in view
  if (userEmail) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Dashboard</h1>
        <p>You’re logged in as: <b>{userEmail}</b></p>
        <button onClick={signOut}>Log out</button>
      </main>
    )
  }

  // Logged-out view
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

      <button onClick={signIn}>Send Login Link</button>

      <p>{message}</p>
    </main>
  )
}
