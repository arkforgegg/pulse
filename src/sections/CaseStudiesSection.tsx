import { useState } from "react";
import { caseStudies } from "../data/caseStudies";

const tabClipPath = "polygon(8% 0, 100% 0, 92% 100%, 0 100%)";
const tabClipPathInset =
  "polygon(calc(8% + 2px) 2px, calc(100% - 2px) 2px, calc(92% - 2px) calc(100% - 2px), 2px calc(100% - 2px))";

function shortenStatValue(value: string): string {
  if (value === "-") return value;
  let out = value
    .replace(/\s*Billion\b/gi, "B")
    .replace(/\s*Million\b/gi, "M")
    .replace(/\s*Thousand\b/gi, "K");
  const numericPart = out.replace(/,/g, "").trim();
  const num = parseInt(numericPart, 10);
  if (/^\d+$/.test(numericPart) && num >= 1000) {
    const k = num / 1000;
    out = (k % 1 === 0 ? String(k) : k.toFixed(1)) + "K";
  }
  return out;
}

export function CaseStudiesSection() {
  const [activeGameIndex, setActiveGameIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const activeProject = caseStudies[activeGameIndex];
  const slides = activeProject.slides;
  const activeSlide = slides[activeSlideIndex];
  const hasMultipleSlides = slides.length > 1;

  const handlePrevSlide = () => {
    if (!hasMultipleSlides) return;
    setActiveSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    if (!hasMultipleSlides) return;
    setActiveSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleTabClick = (gameIndex: number) => {
    setActiveGameIndex(gameIndex);
    setActiveSlideIndex(0);
  };

  return (
    <section className="relative overflow-hidden bg-black px-4 py-16 md:py-24 lg:py-32">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[238px] w-full -translate-x-1/2 lg:w-[1442px]">
        <div className="absolute inset-[-168%_-28%] bg-[radial-gradient(ellipse_at_center,rgba(54,244,219,0.08)_0%,transparent_70%)] blur-[60px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <h2 id="case-studies" className="bg-linear-to-r from-white via-white via-40% to-accent bg-clip-text font-display text-3xl font-bold leading-normal tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-[56px]">
          Case Studies
        </h2>
        <p className="mx-auto mt-4 max-w-[1149px] text-base text-white md:text-2xl">
          From Mobile Legends to Omniheroes, see how we've helped top games
          succeed at launch and beyond.
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-10 max-w-[1260px]">
        <div className="flex justify-start md:justify-center overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex flex-nowrap shrink-0">
            {caseStudies.map((project, index) => {
              const isActive = index === activeGameIndex;
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => handleTabClick(index)}
                  className={`relative h-[53px] w-[120px] shrink-0 sm:w-[160px] md:w-[236px] ${isActive ? "z-10" : ""}`}
                >
                  <div
                    className="absolute inset-0"
                    style={{ clipPath: tabClipPath, background: "#36f4db" }}
                  />
                  <div
                    className={`relative flex h-full w-full items-center justify-center text-xs font-semibold transition-colors duration-200 sm:text-sm md:text-lg ${isActive ? "bg-accent text-black" : "bg-black/80 text-white hover:bg-white/10"
                      }`}
                    style={{ clipPath: tabClipPathInset }}
                  >
                    {project.tabLabel}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-6 max-w-[1257px]">
        <div className="relative min-h-[677px] rounded-xl border-2 border-[#353535] bg-[#101010]">
          <div className="flex flex-col lg:flex-row gap-6 py-6 px-4 md:p-8 lg:px-10 lg:py-9">
            <div className="relative h-[409px] w-full shrink-0 lg:h-[605px] lg:w-[510px]">
              <img
                src={activeSlide.image}
                alt={activeSlide.title}
                className="absolute inset-0 h-full w-full rounded-lg object-cover "
              />
            </div>

            <div className="flex flex-1 flex-col gap-5">
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
                  {activeSlide.title}
                </h3>
                <p className="text-sm leading-relaxed text-white md:text-lg lg:text-2xl">
                  {activeSlide.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {activeSlide.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-accent px-3.5 py-1 text-sm text-white md:text-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-2 flex flex-nowrap overflow-x-auto md:flex-wrap md:flex-col md:overflow-visible justify-between gap-3">
                {activeSlide.stats.map((stat, i) => (
                  <div
                    key={i}
                    className={`flex shrink-0 flex-col items-start border-l-4 border-accent pl-1 md:pl-3 min-w-0 md:w-[239px] md:shrink ${i >= 2 ? "hidden md:flex" : ""}`}
                  >
                    <div className="flex items-center gap-2 md:gap-[13px] leading-normal text-white">
                      <span className="text-base md:text-2xl font-bold shrink-0">
                        <span className="md:hidden">{shortenStatValue(stat.value)}</span>
                        <span className="hidden md:inline">{stat.value}</span>
                      </span>
                      <span className="text-[11px] md:text-lg text-white/70 shrink-0">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {hasMultipleSlides && (
                <div className="mt-4 flex justify-center gap-2.5 lg:justify-end">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-white transition hover:border-accent hover:text-accent"
                    aria-label="Previous slide"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-white transition hover:border-accent hover:text-accent"
                    aria-label="Next slide"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
