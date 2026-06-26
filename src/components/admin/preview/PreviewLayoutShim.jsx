'use client'

/**
 * Provides the public page's background context for previewed content WITHOUT
 * the public chrome (TopBar/Navbar/Footer/LineFAB/CookieConsent come from
 * (public)/layout.jsx and are noise inside the editor). Mirrors the public
 * layout's `bg-white` wrapper so previewed sections sit on the same backdrop
 * they will in production.
 */
export default function PreviewLayoutShim({ children }) {
  return <div className="bg-white w-full min-h-full">{children}</div>
}
