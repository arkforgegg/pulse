import { useState } from "react";
import { marketRegions } from "../data/marketRegions";
import { marketCountries } from "../data/marketCountries";

export function OurMarketSection() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  return (
    <section className="relative overflow-hidden bg-black py-16 md:py-24 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.15] "
        aria-hidden
      >
        <img
          src="/images/markets/map-bg.png"
          alt=""
          className="absolute left-0 top-1/4 md:top-0 w-full max-w-none object-cover"
        />
      </div>

      <div
        className="pointer-events-none absolute left-2/3 top-1/2 h-[380px] w-[560px] -translate-x-1/2 -translate-y-1/2 opacity-90 md:h-[1100px] md:w-[1600px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(167, 139, 250, 0.7) 0%, rgba(139, 92, 246, 0.35) 30%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="pointer-events-none absolute left-[45%] top-1/2 h-[340px] w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-90 md:h-[1000px] md:w-[1400px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0, 194, 184, 0.55) 0%, rgba(0, 79, 74, 0.3) 40%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <h2
          id="markets"
          className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-[56px] bg-linear-to-r from-white via-white via-35% to-accent bg-clip-text text-transparent"
        >
          Our Markets
        </h2>
        <p className="mx-auto mt-4 max-w-3xl font-sans text-lg font-normal text-white md:text-2xl">
          Leverage On Talents Globally
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-8 max-w-[1150px]  sm:mt-12 sm:px-4 lg:mt-16">
        <div className="relative w-full overflow-hidden rounded-md sm:rounded-lg">
          <div className="relative w-full origin-center rounded-md sm:rounded-lg">
            <img
              src="/images/markets/map.png"
              alt="Our markets: global presence"
              className="w-full min-h-72 object-contain opacity-90"
            />
            {marketRegions.map((region) => {
              const isActive =
                selectedRegion === region.name;
              return (
                <div
                  key={region.name}
                  className="group absolute z-0 flex -translate-x-1/2 -translate-y-full cursor-pointer flex-col items-center gap-[1.839px] transition-transform duration-300 hover:scale-110"
                  style={{ left: `${region.left}%`, top: `${region.top}%` }}
                  onClick={() =>
                    setSelectedRegion(
                      isActive ? null : region.name
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" ||
                      e.key === " "
                    ) {
                      e.preventDefault();
                      setSelectedRegion(
                        isActive ? null : region.name
                      );
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  aria-label={`${region.name} region`}
                >
                  <span
                    className={`font-display whitespace-nowrap text-center text-[10px] font-bold sm:text-sm md:text-base lg:text-xl xl:text-2xl transition-colors duration-300 ${isActive
                      ? "text-accent"
                      : "text-white group-hover:text-accent"
                      }`}
                    style={{
                      textShadow:
                        "0 0 6px black, 0 0 12px black",
                    }}
                  >
                    {region.name}
                  </span>
                  <img
                    src="/images/markets/location-pin.png"
                    alt=""
                    className={`h-3 w-[10px] mix-blend-plus-lighter transition-all duration-300 sm:h-3.5 sm:w-[12px] md:h-4 md:w-[14px] lg:h-5 lg:w-[15px] xl:h-6 xl:w-[18px] ${isActive
                      ? "drop-shadow-[0_0_8px_var(--color-accent)]"
                      : "group-hover:drop-shadow-[0_0_8px_var(--color-accent)]"
                      }`}
                    width={72}
                    height={84}
                    aria-hidden
                  />
                </div>
              );
            })}

            <div className="px-2 pb-2 sm:px-3 sm:pb-3 md:px-4 md:pb-4 lg:px-5 lg:pb-5">
              <div className="overflow-hidden rounded-[5.745px] border border-[#353535] bg-[rgba(16,16,16,0.8)] py-4 sm:rounded-xl sm:border-2 sm:py-6 md:py-8">
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 px-5 sm:gap-x-6 sm:gap-y-3 sm:px-3 md:gap-x-[33px] md:gap-y-4 md:px-4">
                  {marketCountries.map((country) => (
                    <div
                      key={country.name}
                      className="flex shrink-0 items-center gap-[3.83px] sm:gap-2"
                    >
                      <img
                        src={`/images/flags/${country.flag}`}
                        alt=""
                        className="h-[18px] w-[18px] shrink-0 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-9 lg:w-9"
                        width={36}
                        height={36}
                        loading="lazy"
                      />
                      <span className="font-display text-center text-[8px] font-bold leading-normal text-white whitespace-nowrap sm:text-xs md:text-sm lg:text-base">
                        {country.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
