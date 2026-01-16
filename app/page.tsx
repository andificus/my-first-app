import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 40, marginBottom: 8 }}>My App</h1>
      <p style={{ opacity: 0.85 }}>
        This is my personal project to learn modern web + app development.
      </p>

      <div style={{ marginTop: 18, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link
          href="/login"
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #ccc', textDecoration: 'none' }}
        >
          Login
        </Link>
        <Link
          href="/dashboard"
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #ccc', textDecoration: 'none' }}
        >
          Dashboard
        </Link>
      </div>
    </main>
  )
}
