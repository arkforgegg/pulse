import { testimonies, type Testimony } from "../data/testimonies";

function TestimonyCard({ testimony }: { testimony: Testimony }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border-2 border-[#353535] bg-[#101010] min-h-[250px] md:min-h-[309px]">
      <div className="flex flex-1 flex-col items-center justify-evenly px-3 pt-3 pb-4 md:px-4 md:pt-4 md:pb-5">
        <img
          src={testimony.companyLogo}
          alt={testimony.companyName}
          decoding="async"
          className={`h-8 w-auto max-w-[140px] shrink-0 object-contain object-center brightness-0 invert md:h-16 ${testimony.logoClassName ?? ""}`}
        />
        <p className="mt-2 font-sans text-[11px] leading-relaxed text-white  md:text-lg text-center">
          &ldquo;{testimony.quote}&rdquo;
        </p>
      </div>

      {testimony.hasGlow && (
        <div className="pointer-events-none absolute -bottom-16 -right-20 h-[300px] w-[400px]">
          <div className="h-full w-full rounded-full bg-[radial-gradient(ellipse_at_center,rgba(194,101,255,0.3)_0%,transparent_70%)] blur-2xl" />
        </div>
      )}
    </div>
  );
}

const mobileRows: {
  indices: [number, number];
  pattern: "narrow-wide" | "wide-narrow";
}[] = [
    { indices: [0, 1], pattern: "narrow-wide" },
    { indices: [2, 3], pattern: "wide-narrow" },
    { indices: [4, 5], pattern: "narrow-wide" },
  ];

export function TestimoniesSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-r from-[#12011D] to-[#0C0014] px-4 py-16 md:py-24 lg:py-32">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[1500px] -translate-x-1/2 -translate-y-1/2 lg:h-[1200px] lg:w-[1800px]">
        <div
          className="h-full w-full rounded-full blur-[140px]"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(54, 244, 219, 0.9) 0%, rgba(54, 244, 219, 0.1) 40%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <h2 id="testimonies" className="bg-linear-to-r from-white via-white via-40% to-accent bg-clip-text font-display text-xl font-bold leading-normal tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-[56px]">
          What They Are Saying
        </h2>
      </div>

      <div className="relative z-10 mx-auto mt-12 flex flex-col gap-[5px] md:hidden">
        {mobileRows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-2">
            {row.pattern === "narrow-wide" ? (
              <>
                <div className="w-[45%] shrink-0">
                  <TestimonyCard testimony={testimonies[row.indices[0]]} />
                </div>
                <div className="flex-1">
                  <TestimonyCard testimony={testimonies[row.indices[1]]} />
                </div>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <TestimonyCard testimony={testimonies[row.indices[0]]} />
                </div>
                <div className="w-[45%] shrink-0">
                  <TestimonyCard testimony={testimonies[row.indices[1]]} />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="relative z-10 mx-auto hidden max-w-7xl md:mt-14 md:grid md:grid-cols-10 md:gap-4 lg:mt-16">
        {testimonies.map((t, i) => (
          <div
            key={i}
            className={t.colSpan === 2 ? "col-span-4" : "col-span-3"}
          >
            <TestimonyCard testimony={t} />
          </div>
        ))}
      </div>
    </section>
  );
}
