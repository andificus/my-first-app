'use client'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <span className="brand">Andificus</span>
          <span className="copyright">© {new Date().getFullYear()} Andrew Wentzloff</span>
        </div>
      </div>
    </footer>
  )
}
