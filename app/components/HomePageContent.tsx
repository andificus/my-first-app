'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FadeUp,
  StaggerGrid,
  StaggerCard,
  SectionHeading,
  HeroText,
  IllustrationFrame,
  IllustrationCard,
} from './Motion'
import {
  HeroIllustration,
  AuthIllustration,
  ProfileIllustration,
  DashboardIllustration,
  SignInIllustration,
  SetupProfileIllustration,
  UseDashboardIllustration,
} from './Illustrations'

export default function HomePageContent() {
  return (
    <main style={{ maxWidth: 980, margin: '0 auto', padding: '72px 28px' }}>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
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
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.75, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: 12 }}
          >
            In active development
          </motion.p>

          <HeroText text="Built with intent." />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 18, lineHeight: 1.7, maxWidth: 720, margin: 0 }}
          >
            A modern web app I'm building hands-on to sharpen real-world skills: authentication,
            data, and a clean foundation that's ready to scale into bigger features.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/login" className="btn btnPrimary">Get started</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/dashboard" className="btn btnGhost">View dashboard →</Link>
            </motion.div>
          </motion.div>
        </div>

        <IllustrationFrame aspectRatio="4 / 3">
          <HeroIllustration />
        </IllustrationFrame>
      </section>

      {/* ── Intro cards ────────────────────────────────────────────────── */}
      <StaggerGrid
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          marginBottom: 26,
        }}
      >
        <StaggerCard className="card">
          <h2 className="h2">What it is</h2>
          <p className="p">
            A focused starter webapp: secure sign-in, a user profile, and a dashboard — built
            with the structure before adding "real" features.
          </p>
        </StaggerCard>

        <StaggerCard className="card">
          <h2 className="h2">What I'm practicing</h2>
          <ul className="list">
            <li>Modern React + Next.js patterns</li>
            <li>Auth + database workflows (Supabase)</li>
            <li>Production deployment (GitHub → Vercel)</li>
            <li>Product thinking, UX, and consistency</li>
          </ul>
        </StaggerCard>

        <StaggerCard className="card">
          <h2 className="h2">What's next</h2>
          <p className="p">
            Notes, a more capable dashboard, and a smoother mobile experience — in small, steady
            iterations.
          </p>
        </StaggerCard>
      </StaggerGrid>

      {/* ── Key capabilities ───────────────────────────────────────────── */}
      <SectionHeading
        title="Key capabilities"
        subtitle="The current build focuses on fundamentals: security, clarity, and a base that can evolve without rewrites."
      />

      <StaggerGrid
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          marginBottom: 28,
        }}
      >
        <IllustrationCard
          title="Authentication"
          list={[
            'Email/password sign-in',
            'Session handling + protected routes',
            'Password reset flow',
          ]}
        >
          <AuthIllustration />
        </IllustrationCard>

        <IllustrationCard
          title="Profile system"
          list={[
            'Edit basic user details',
            'Stored securely in the database',
            'Designed to support future fields',
          ]}
        >
          <ProfileIllustration />
        </IllustrationCard>

        <IllustrationCard
          title="Dashboard foundation"
          list={[
            'Central place for app tools',
            'Room for widgets + summaries',
            'Navigation that stays consistent',
          ]}
        >
          <DashboardIllustration />
        </IllustrationCard>
      </StaggerGrid>

      {/* ── How it works ───────────────────────────────────────────────── */}
      <SectionHeading
        title="How it works"
        subtitle="Straightforward on purpose — the goal is a clean experience, not complexity."
      />

      <StaggerGrid
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          marginBottom: 28,
        }}
      >
        <IllustrationCard
          title="1) Sign in"
          text="Authenticate securely to access your personal workspace."
        >
          <SignInIllustration />
        </IllustrationCard>

        <IllustrationCard
          title="2) Set up your profile"
          text="Add the basics now — more fields can be added as features mature."
        >
          <SetupProfileIllustration />
        </IllustrationCard>

        <IllustrationCard
          title="3) Use the dashboard"
          text="Everything routes through the dashboard so the app can grow without getting messy."
        >
          <UseDashboardIllustration />
        </IllustrationCard>
      </StaggerGrid>

      {/* ── Roadmap ────────────────────────────────────────────────────── */}
      <SectionHeading
        title="Roadmap"
        subtitle="A simple plan: ship the essentials first, then add power features once the base is solid."
      />

      <StaggerGrid
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          marginBottom: 28,
        }}
      >
        <StaggerCard className="card">
          <h3 className="h2" style={{ marginTop: 0 }}>Now</h3>
          <ul className="list">
            <li>Polish login + reset flow</li>
            <li>Improve profile UX</li>
            <li>Mobile-friendly layout pass</li>
          </ul>
        </StaggerCard>

        <StaggerCard className="card">
          <h3 className="h2" style={{ marginTop: 0 }}>Next</h3>
          <ul className="list">
            <li>Notes (create / edit / delete)</li>
            <li>Dashboard widgets</li>
            <li>Better navigation states</li>
          </ul>
        </StaggerCard>

        <StaggerCard className="card">
          <h3 className="h2" style={{ marginTop: 0 }}>Later</h3>
          <ul className="list">
            <li>Activity history</li>
            <li>Settings + preferences</li>
            <li>More advanced user roles (if needed)</li>
          </ul>
        </StaggerCard>
      </StaggerGrid>

      {/* ── About ──────────────────────────────────────────────────────── */}
      <FadeUp>
        <div
          className="card"
          style={{
            marginTop: 34,
            marginBottom: 28,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div>
            <h2 className="h2" style={{ margin: '0 0 12px 0' }}>Andrew Wentzloff</h2>
            <p className="p" style={{ maxWidth: 640 }}>
              IT professional by trade, builder by nature. I've spent over a decade keeping
              enterprise systems running — infrastructure, identity, security, the works.
              Andificus is where I get to build my own ideas from scratch while also maintaining
              and expanding my skill base.
            </p>
          </div>

          <motion.a
            href="https://www.linkedin.com/in/andywentzloff"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btnGhost"
            style={{ alignSelf: 'flex-start' }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            LinkedIn →
          </motion.a>
        </div>
      </FadeUp>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <SectionHeading title="FAQ" />

      <StaggerGrid style={{ display: 'grid', gap: 16, marginBottom: 10 }}>
        <StaggerCard className="card">
          <h3 className="h2" style={{ marginTop: 0 }}>Is this a public product?</h3>
          <p className="p">
            Not yet. It's a personal build that's being shaped like a real app — clean structure,
            secure auth, and intentional UX.
          </p>
        </StaggerCard>

        <StaggerCard className="card">
          <h3 className="h2" style={{ marginTop: 0 }}>What's the goal?</h3>
          <p className="p">
            Practice building production-quality fundamentals: authentication, data modeling, UI
            consistency, and deployment workflows.
          </p>
        </StaggerCard>
      </StaggerGrid>

    </main>
  )
}
