import { useState, useEffect } from "react"
import { navLinks, ctaLabel, ctaHref } from "../data/nav"

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">

        <nav className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-8 sm:px-8 md:px-10 lg:px-12 xl:px-16">
          <a href="#" className="flex items-center gap-2 sm:gap-3">
            <img src="/images/logo.png" alt="Pulse Nova" className="h-8 w-auto shrink-0 sm:h-9 drop-shadow-lg" />
            <img src="/images/slogan.png" alt="Slogan" className="h-6 hidden sm:block drop-shadow-lg sm:h-7" />
          </a>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-lg border border-accent  px-6 py-3 text-sm md:text-xl font-medium text-accent shadow-[0_0_12px_rgba(54,244,219,0.35)] transition hover:border-accent-hover hover:bg-accent/5 hover:text-accent-hover hover:shadow-[0_0_16px_rgba(54,244,219,0.45)]"
            >
              {ctaLabel}
            </a>
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="flex shrink-0 items-center justify-center rounded-lg border border-accent  p-3 md:p-4 text-accent shadow-[0_0_12px_rgba(54,244,219,0.35)] transition hover:border-accent-hover hover:bg-accent/5 hover:text-accent-hover hover:shadow-[0_0_16px_rgba(54,244,219,0.45)]"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-60 transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/70"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`absolute top-0 right-0 h-full w-full max-w-[min(24rem,90vw)] bg-black transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex h-full flex-col">
            <div className="flex shrink-0 justify-center pt-8">
              <button
                type="button"
                aria-label="Close menu"
                className="flex items-center justify-center text-accent transition hover:text-accent-hover"
                onClick={() => setMobileOpen(false)}
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 flex-col px-8 pt-10 pb-8">
              <nav className="flex flex-col gap-8 items-center">
                {navLinks.map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    className="text-xl font-display font-medium text-white transition hover:text-accent-hover"
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
