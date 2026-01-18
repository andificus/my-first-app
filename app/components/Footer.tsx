'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <span className="brand">Built By Andificus</span>
          <span className="copyright">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        <div className="footer-right">
        </div>
      </div>
    </footer>
  )
}
