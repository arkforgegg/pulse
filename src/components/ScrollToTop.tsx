import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`group fixed bottom-5 right-8 z-40 inline-flex items-center justify-center rounded-lg bg-linear-to-r from-violet-500 to-accent p-3 text-white shadow-[0_0_32px_rgba(139,92,246,0.45)] transition-all duration-300 hover:from-violet-600 hover:to-accent-hover hover:shadow-[0_0_40px_rgba(139,92,246,0.55)] ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
    >
      <img
        src="/icons/arrow-down-fill.svg"
        alt=""
        className="h-6 w-6 transition transform rotate-180 group-hover:-translate-y-0.5"
      />
    </button>
  );
}
