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

const STACK = [
  { name: 'Next.js 16',      category: 'Framework',       description: 'App Router, server components, and edge middleware.' },
  { name: 'React 19',        category: 'UI',              description: 'Component-based UI with hooks and client/server boundaries.' },
  { name: 'TypeScript',      category: 'Language',        description: 'Strict typing throughout — components, queries, and data shapes.' },
  { name: 'Supabase',        category: 'Backend',         description: 'Postgres database, authentication, and file storage.' },
  { name: 'Tailwind CSS v4', category: 'Styling',         description: 'Utility classes alongside a custom CSS design token system.' },
  { name: 'Framer Motion',   category: 'Animation',       description: 'Scroll-triggered reveals, stagger animations, and hover states.' },
  { name: 'Vercel',          category: 'Deployment',      description: 'Automatic deploys on every push to the main branch via GitHub.' },
  { name: 'GitHub',          category: 'Version Control', description: 'Source of truth for all code — full commit history from day one.' },
]

function StackCard({ item, index }: { item: typeof STACK[0], index: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 32 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      whileHover={{
        y: -4,
        boxShadow: '0 0 0 1.5px var(--link), 0 8px 24px var(--shadow)',
        transition: { duration: 0.2 },
      }}
      className="card"
      style={{ padding: '14px 16px', cursor: 'default' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        {/* Animated pulse dot */}
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
          style={{ display: 'inline-flex', flexShrink: 0 }}
        >
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [0.9, 0.4, 0.9] }}
            transition={{ duration: 2, delay: 0.5 + index * 0.15, repeat: 2, ease: 'easeInOut' }}
            style={{
              display: 'block',
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: 'var(--link)',
              flexShrink: 0,
            }}
          />
        </motion.span>

        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
          {item.name}
        </span>

        <span style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--link)',
          opacity: 0.75,
          marginLeft: 'auto',
        }}>
          {item.category}
        </span>
      </div>

      <p className="p" style={{ fontSize: 13, margin: 0 }}>
        {item.description}
      </p>
    </motion.div>
  )
}

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

      {/* ── Tech stack ─────────────────────────────────────────────────── */}
      <SectionHeading
        title="Tech stack"
        subtitle="Everything powering this app from code to deployment."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ visible: { transition: { staggerChildren: 0.07 } }, hidden: {} }}
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          marginBottom: 28,
        }}
      >
        {STACK.map((item, i) => (
          <StackCard key={item.name} item={item} index={i} />
        ))}
      </motion.div>

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
          <h3 className="h2" style={{ marginTop: 0 }}>✓ Shipped</h3>
          <ul className="list">
            <li>Secure auth + session handling</li>
            <li>Password reset flow</li>
            <li>User profile (edit, avatar, theme)</li>
            <li>Notes (create / edit / delete)</li>
            <li>Server-side route protection</li>
            <li>Production deployment pipeline</li>
          </ul>
        </StaggerCard>

        <StaggerCard className="card">
          <h3 className="h2" style={{ marginTop: 0 }}>→ Next</h3>
          <ul className="list">
            <li>Dashboard widgets</li>
            <li>Better navigation active states</li>
            <li>Activity history</li>
          </ul>
        </StaggerCard>

        <StaggerCard className="card">
          <h3 className="h2" style={{ marginTop: 0 }}>Later</h3>
          <ul className="list">
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
