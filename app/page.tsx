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
          In active development
        </p>

        <h1
          style={{
            fontSize: 54,
            lineHeight: 1.05,
            margin: '10px 0 14px',
            letterSpacing: '-0.03em',
          }}
        >
          Build with intent.
        </h1>

        <p style={{ fontSize: 18, lineHeight: 1.7, maxWidth: 720, opacity: 0.9, margin: 0 }}>
          A modern web app I’m building hands-on to sharpen real-world skills: authentication, data, and a clean
          foundation that’s ready to scale into bigger features.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
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
            A focused starter product: secure sign-in, a user profile, and a dashboard — built with the kind of
            structure you’d want before adding “real” features.
          </p>
        </div>

        <div className="card">
          <h2 className="h2">What I’m practicing</h2>
          <ul className="list">
            <li>Modern React + Next.js patterns</li>
            <li>Auth + database workflows (Supabase)</li>
            <li>Production deployment (GitHub → Vercel)</li>
            <li>Product thinking, UX, and consistency</li>
          </ul>
        </div>

        <div className="card">
          <h2 className="h2">What’s next</h2>
          <p className="p">
            Notes, a more capable dashboard, and a smoother mobile experience — with improvements shipped in small,
            steady iterations.
          </p>
        </div>
      </section>
    </main>
  )
}
