import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Service } from "../data/services";
import { services } from "../data/services";
import "swiper/css/bundle";

const clipPath = "polygon(4% 0, 100% 0, 96% 100%, 0 100%)";
const clipPathInset =
  "polygon(calc(4% + 2px) 2px, calc(100% - 2px) 2px, calc(96% - 2px) calc(100% - 2px), 2px calc(100% - 2px))";
const borderGradient = "linear-gradient(135deg, #8E76D9, #63B5CC, #3EC4C0)";

function ServiceCard({ service }: { service: Service }) {
  const bgStyle = service.imageUrl
    ? {
      backgroundImage: `url(${service.imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }
    : undefined;

  return (
    <div className="relative service-card-outer">
      <div
        className="service-card-border absolute inset-0 transition-opacity duration-300"
        style={{ clipPath, background: borderGradient }}
      />
      <div
        className="relative service-card-inner flex min-h-[400px] w-full overflow-hidden bg-[#1a0a24] transition-opacity duration-300 md:min-h-[420px]"
        style={{ ...bgStyle, clipPath: clipPathInset }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/60 to-black/80" />
        {/* Inactive slide: solid overlay #161616 on top of content, no bg image (via CSS) */}
        <div
          className="service-card-inactive-overlay pointer-events-none absolute inset-0 z-[20] opacity-0 transition-opacity duration-300"
          style={{
            clipPath: clipPathInset,
            background: "rgba(22, 22, 22, 0.85)",
          }}
          aria-hidden
        />
        <div className="relative z-10 flex flex-col md:justify-between px-10 py-6 text-left md:px-16 md:py-10 lg:px-20 lg:py-12">
          <div>
            <h3 className="font-display text-lg font-bold leading-tight text-white md:text-4xl lg:text-[40px]">
              {service.title}
            </h3>
            <p className="mt-4  text-[12px] leading-relaxed text-white text-shadow-2xs md:text-[20px]">
              {service.description}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 md:gap-3">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className=" bg-accent px-4 py-2 text-[11px] font-medium text-[#12011D] md:text-lg"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServicesSection() {
  return (
    <section id="services" className="relative overflow-hidden bg-[#12011D] px-4 pt-16 pb-12 md:pb-16 lg:pb-20">
      <div className="absolute left-1/2 top-1/2 h-[500px] lg:h-[800px] w-[1400px] -translate-x-1/2 -translate-y-1/4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#AC42FB_0%,#8b5cf6_25%,#6d28d9_45%,transparent_70%)] opacity-70 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <h2 className="font-display text-3xl font-bold leading-normal tracking-tight sm:text-4xl md:text-5xl lg:text-[56px] bg-linear-to-r from-white via-white via-40% to-accent bg-clip-text text-transparent">
          Built to Execute. Designed to Scale.
        </h2>
        <div className="mx-auto mt-4 max-w-5xl space-y-6 text-lg text-white md:text-2xl">
          <p className="text-base md:text-2xl">
            Our services support gaming brands at every stage — from one-off
            activations to long-term growth across creators, communities, and
            platforms.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-16 max-w-[1671px] pb-8 md:pb-10 lg:pb-12">
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".services-swiper-prev",
            nextEl: ".services-swiper-next",
          }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            768: {
              slidesPerView: 1.4,
            },
            1024: {
              slidesPerView: 1.4,
            },
          }}
          centeredSlides={true}
          loop
          className="services-swiper overflow-visible!"
        >
          {services.map((service) => (
            <SwiperSlide key={service.id}>
              <ServiceCard service={service} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="mt-12 flex justify-center gap-4">
          <button
            type="button"
            className="services-swiper-prev flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full border border-white  text-white shadow-[0_0_16px_rgba(172,66,251,0.2)] transition hover:border-accent hover:bg-accent/10 hover:text-accent disabled:opacity-40"
            aria-label="Previous slide"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            className="services-swiper-next flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full border border-white  text-white shadow-[0_0_16px_rgba(172,66,251,0.2)] transition hover:border-accent hover:bg-accent/10 hover:text-accent disabled:opacity-40"
            aria-label="Next slide"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
