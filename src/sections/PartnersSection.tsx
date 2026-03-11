import { partners, partnersRows } from "../data/partners";
import type { Brand } from "../data/brands";

function PartnerLogo({ brand }: { brand: Brand }) {
  return (
    <div className="flex h-[40px] w-[72px] items-center justify-center sm:h-[44px] sm:w-[80px] md:h-[50px] md:w-[96px] lg:h-[68px] lg:w-[124px]">
      <img
        src={brand.logo}
        alt={brand.name}
        decoding="async"
        className="max-h-full max-w-full object-contain brightness-0 invert opacity-90"
      />
    </div>
  );
}

export function PartnersSection() {
  return (
    <section id="partners" className="relative overflow-hidden bg-linear-to-r from-[#12011D] to-[#0C0014] px-4 py-14 md:py-20 lg:py-28">
      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <h2 className="bg-linear-to-r from-white via-white via-40% to-accent bg-clip-text font-display text-3xl font-bold leading-normal tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-[56px]">
          Our Established Partners
        </h2>
      </div>

      <div className="relative z-10 mx-auto mt-10 max-w-[1200px] md:mt-14 lg:mt-16">
        {/* Mobile: grid 4 per row; last row in centered flex so it stays centered */}
        <div className="sm:hidden">
          <div className="grid grid-cols-4 items-center justify-items-center gap-x-2 gap-y-4">
            {partners.slice(0, Math.floor(partners.length / 4) * 4).map((brand, i) => (
              <PartnerLogo key={`${brand.name}-${i}`} brand={brand} />
            ))}
          </div>
          {partners.length % 4 !== 0 && (
            <div className="mt-4 flex justify-center gap-x-2">
              {partners.slice(Math.floor(partners.length / 4) * 4).map((brand, i) => (
                <PartnerLogo key={`${brand.name}-last-${i}`} brand={brand} />
              ))}
            </div>
          )}
        </div>
        {/* Desktop: keep 4-row layout from partnersRows */}
        <div className="hidden flex-col items-center gap-y-6 sm:flex md:gap-y-8 lg:gap-y-12">
          {partnersRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex flex-wrap items-center justify-center gap-x-2 gap-y-4 sm:gap-x-3 md:gap-x-3 lg:gap-x-7"
            >
              {row.map((brand, i) => (
                <PartnerLogo key={`${brand.name}-${rowIndex}-${i}`} brand={brand} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
