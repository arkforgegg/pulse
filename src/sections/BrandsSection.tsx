import { brandsRow1, brandsRow2, type Brand } from "../data/brands";

function BrandItem({ brand }: { brand: Brand }) {
  return (
    <div className="flex shrink-0 items-center justify-center">
      <img
        src={brand.logo}
        alt={brand.name}
        decoding="sync"
        className="h-9 w-auto min-h-[28px] max-w-[120px] object-contain object-center brightness-0 invert opacity-90 md:h-10 md:max-w-[150px] [image-rendering:-webkit-optimize-contrast] transform-[translateZ(0)]"
      />
    </div>
  );
}

function MarqueeRow({
  brands: brandList,
  reverse,
}: {
  brands: Brand[];
  reverse?: boolean;
}) {
  const duplicated = [...brandList, ...brandList];
  return (
    <div className="flex overflow-hidden py-6 mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div
        className={`flex gap-6 pr-6 md:gap-8 md:pr-8 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
      >
        {duplicated.map((brand, i) => (
          <BrandItem key={i} brand={brand} />
        ))}
      </div>
    </div>
  );
}

export function BrandsSection() {
  return (
    <section className="bg-black py-8 md:py-12">
      <MarqueeRow brands={brandsRow1} />
      <MarqueeRow brands={brandsRow2} reverse />
    </section>
  );
}
