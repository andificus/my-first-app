import Link from 'next/link'

export default function Home() {
  return (
    <main
      style={{
        maxWidth: 980,
        margin: '0 auto',
        padding: '72px 28px',
      }}
    >
      {/* Hero */}
      <section style={{ marginBottom: 44 }}>
        <p style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: 12, opacity: 0.75 }}>
          Personal project
        </p>

        <h1
          style={{
            fontSize: 54,
            lineHeight: 1.05,
            margin: '10px 0 14px',
            letterSpacing: '-0.03em',
          }}
        >
          Build. Learn. Ship.
        </h1>

        <p style={{ fontSize: 18, lineHeight: 1.7, maxWidth: 720, opacity: 0.9, margin: 0 }}>
          A modern web app I’m building hands-on to expand my skill set.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
          {/* This will either work (if logged in) or redirect to login (if not) */}
          <Link href="/dashboard" className="btn btnPrimary">
            Go to Dashboard
          </Link>

          <Link href="/profile" className="btn btnGhost">
            Edit Profile
          </Link>
        </div>
      </section>

      {/* Cards */}
      <section
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        }}
      >
        <div className="card">
          <h2 className="h2">What it is</h2>
          <p className="p">
            A clean, secure foundation: authentication, user profiles, and a dashboard — built to grow into future
            features.
          </p>
        </div>

        <div className="card">
          <h2 className="h2">What I’m practicing</h2>
          <ul className="list">
            <li>Modern React + Next.js</li>
            <li>Auth + database (Supabase)</li>
            <li>Deployment (GitHub → Vercel)</li>
            <li>Product thinking + UX</li>
          </ul>
        </div>

        <div className="card">
          <h2 className="h2">What’s next</h2>
          <p className="p">
            Notes, a more advanced dashboard, mobile-friendly UI — and eventually a paid tier experiment once there’s
            real value.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: 56, paddingTop: 22, borderTop: '1px solid rgba(0,0,0,0.08)', opacity: 0.75 }}>
        <p style={{ margin: 0, fontSize: 13 }}>
          Built by Andificus.
        </p>
      </footer>
    </main>
  )
}
