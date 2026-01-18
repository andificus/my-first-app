'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <span className="brand">Andificus</span>
          <span className="copyright">
            © {new Date().getFullYear()} Andificus. All rights reserved.
          </span>
        </div>

        <div className="footer-right">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
