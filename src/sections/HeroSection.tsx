import { useState } from "react";

export function HeroSection() {
  const [muted, setMuted] = useState(true);

  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
      <video
        src="/videos/hero-video.mp4"
        autoPlay
        loop
        muted={muted}
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 text-center w-full max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <h1 className="font-display text-xl tracking-tight text-white sm:text-5xl md:text-[65px]">
          The Epicenter of Gaming, Youth Culture & Lifestyle Convergence
        </h1>
        <a
          href="#what-we-offer"
          className="group inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-violet-500 to-accent px-6 py-2 font-semibold text-white shadow-[0_0_32px_rgba(139,92,246,0.45)] transition hover:from-violet-600 hover:to-accent-hover hover:shadow-[0_0_40px_rgba(139,92,246,0.55)] md:text-[32px]"
        >
          Discover Now
          <img
            src="/icons/arrow-down-fill.svg"
            alt=""
            className="transition group-hover:-translate-y-0.5 h-5 w-5 md:h-8 md:w-8"
          />
        </a>
      </div>
      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        className="absolute bottom-6 right-6 z-10 rounded-full p-2 text-white/90 transition hover:bg-white/10 hover:text-white"
        aria-label={muted ? "Unmute video" : "Mute video"}
      >
        {muted ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
    </section>
  );
}
