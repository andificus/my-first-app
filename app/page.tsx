import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 44, marginBottom: 8 }}>My App</h1>

      <p style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.9, marginTop: 0 }}>
        A personal project where I’m learning modern web development — and building something
        I can eventually turn into a real product.
      </p>

      <div
        style={{
          marginTop: 24,
          padding: 18,
          border: '1px solid #e5e5e5',
          borderRadius: 12,
        }}
      >
        <h2 style={{ marginTop: 0 }}>What this app does</h2>
        <ul style={{ margin: 0, paddingLeft: 18, opacity: 0.9 }}>
          <li>Secure login (magic link)</li>
          <li>User profile (name + bio)</li>
          <li>Dashboard experience</li>
          <li>More features coming (notes, mobile, monetization experiments)</li>
        </ul>
      </div>

      <div
        style={{
          marginTop: 18,
          padding: 18,
          border: '1px solid #e5e5e5',
          borderRadius: 12,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Why I’m building it</h2>
        <p style={{ margin: 0, opacity: 0.9, lineHeight: 1.6 }}>
          I learn best by building hands-on. This project is my way to level up my skills and
          eventually create something that could generate income.
        </p>
      </div>
    </main>
  )
}

