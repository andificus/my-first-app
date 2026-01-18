import Link from 'next/link'
import Image from 'next/image'

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
      <section
        className="homeHero"
        style={{
          display: 'grid',
          gap: 24,
          gridTemplateColumns: '1.15fr 0.85fr',
          alignItems: 'center',
          marginBottom: 44,
        }}
      >
        <div>
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



        {/* Hero image (placeholder) */}
        <div className="card" style={{ padding: 14 }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', overflow: 'hidden', borderRadius: 14 }}>
            <Image
              src="/images/hero-dashboard.png"
              alt="Abstract dashboard preview"
              fill
              sizes="(max-width: 900px) 100vw, 420px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </div>
      </section>

      {/* Intro cards */}
      <section
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          marginBottom: 26,
        }}
      >
        <div className="card">
          <h2 className="h2">What it is</h2>
          <p className="p">
            A focused starter product: secure sign-in, a user profile, and a dashboard — built with the structure you’d
            want before adding “real” features.
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
            Notes, a more capable dashboard, and a smoother mobile experience — shipped in small, steady iterations.
          </p>
        </div>
      </section>

      {/* Key capabilities */}
      <section style={{ marginTop: 30, marginBottom: 18 }}>
        <h2 className="h2" style={{ margin: 0 }}>
          Key capabilities
        </h2>
        <p className="p" style={{ marginTop: 8 }}>
          The current build focuses on fundamentals: security, clarity, and a base that can evolve without rewrites.
        </p>
      </section>

      <section
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          marginBottom: 28,
        }}
      >
        <div className="card">
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', borderRadius: 14 }}>
            <Image
              src="/images/cap-auth.png"
              alt="Authentication preview"
              fill
              sizes="(max-width: 900px) 100vw, 300px"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <h3 className="h2" style={{ marginTop: 14 }}>
            Authentication
          </h3>
          <ul className="list">
            <li>Email/password sign-in</li>
            <li>Session handling + protected routes</li>
            <li>Password reset flow</li>
          </ul>
        </div>

        <div className="card">
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', borderRadius: 14 }}>
            <Image
              src="/images/cap-profile.png"
              alt="Profile system preview"
              fill
              sizes="(max-width: 900px) 100vw, 300px"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <h3 className="h2" style={{ marginTop: 14 }}>
            Profile system
          </h3>
          <ul className="list">
            <li>Edit basic user details</li>
            <li>Stored securely in the database</li>
            <li>Designed to support future fields</li>
          </ul>
        </div>

        <div className="card">
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', borderRadius: 14 }}>
            <Image
              src="/images/cap-dashboard.png"
              alt="Dashboard preview"
              fill
              sizes="(max-width: 900px) 100vw, 300px"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <h3 className="h2" style={{ marginTop: 14 }}>
            Dashboard foundation
          </h3>
          <ul className="list">
            <li>Central place for app tools</li>
            <li>Room for widgets + summaries</li>
            <li>Navigation that stays consistent</li>
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section style={{ marginTop: 34, marginBottom: 18 }}>
        <h2 className="h2" style={{ margin: 0 }}>
          How it works
        </h2>
        <p className="p" style={{ marginTop: 8 }}>
          Straightforward on purpose — the goal is a clean experience, not complexity.
        </p>
      </section>

      <section
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          marginBottom: 28,
        }}
      >
        <div className="card">
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', borderRadius: 14 }}>
            <Image
              src="/images/flow-login.png"
              alt="Sign in flow preview"
              fill
              sizes="(max-width: 900px) 100vw, 300px"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <h3 className="h2" style={{ marginTop: 14 }}>
            1) Sign in
          </h3>
          <p className="p">Authenticate securely to access your personal workspace.</p>
        </div>

        <div className="card">
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', borderRadius: 14 }}>
            <Image
              src="/images/flow-profile.png"
              alt="Profile setup preview"
              fill
              sizes="(max-width: 900px) 100vw, 300px"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <h3 className="h2" style={{ marginTop: 14 }}>
            2) Set up your profile
          </h3>
          <p className="p">Add the basics now — more fields can be added as features mature.</p>
        </div>

        <div className="card">
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', borderRadius: 14 }}>
            <Image
              src="/images/flow-dashboard.png"
              alt="Dashboard overview preview"
              fill
              sizes="(max-width: 900px) 100vw, 300px"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <h3 className="h2" style={{ marginTop: 14 }}>
            3) Use the dashboard
          </h3>
          <p className="p">Everything routes through the dashboard so the app can grow without getting messy.</p>
        </div>
      </section>

      {/* Roadmap */}
      <section style={{ marginTop: 34, marginBottom: 18 }}>
        <h2 className="h2" style={{ margin: 0 }}>
          Roadmap
        </h2>
        <p className="p" style={{ marginTop: 8 }}>
          A simple plan: ship the essentials first, then add power features once the base is solid.
        </p>
      </section>

      <section
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          marginBottom: 28,
        }}
      >
        <div className="card">
          <h3 className="h2" style={{ marginTop: 0 }}>
            Now
          </h3>
          <ul className="list">
            <li>Polish login + reset flow</li>
            <li>Improve profile UX</li>
            <li>Mobile-friendly layout pass</li>
          </ul>
        </div>

        <div className="card">
          <h3 className="h2" style={{ marginTop: 0 }}>
            Next
          </h3>
          <ul className="list">
            <li>Notes (create / edit / delete)</li>
            <li>Dashboard widgets</li>
            <li>Better navigation states</li>
          </ul>
        </div>

        <div className="card">
          <h3 className="h2" style={{ marginTop: 0 }}>
            Later
          </h3>
          <ul className="list">
            <li>Activity history</li>
            <li>Settings + preferences</li>
            <li>More advanced user roles (if needed)</li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ marginTop: 34, marginBottom: 18 }}>
        <h2 className="h2" style={{ margin: 0 }}>
          FAQ
        </h2>
      </section>

      <section style={{ display: 'grid', gap: 16, marginBottom: 10 }}>
        <div className="card">
          <h3 className="h2" style={{ marginTop: 0 }}>
            Is this a public product?
          </h3>
          <p className="p">
            Not yet. It’s a personal build that’s being shaped like a real app — clean structure, secure auth, and
            intentional UX.
          </p>
        </div>

        <div className="card">
          <h3 className="h2" style={{ marginTop: 0 }}>
            What’s the goal?
          </h3>
          <p className="p">
            Practice building production-quality fundamentals: authentication, data modeling, UI consistency, and
            deployment workflows.
          </p>
        </div>
      </section>

      {/* Small responsive tweak (keeps layout without redesigning) */}
      <div className="card" style={{ marginTop: 28 }}>
        <p className="p" style={{ margin: 0 }}>
          Tip: add your placeholder images under <strong>/public/images</strong>. This page is already wired to use them.
        </p>
      </div>

    </main>
  )
}
