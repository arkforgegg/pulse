import { useSyncExternalStore, useState } from "react";
import type { Stat } from "../data/stats";
import { stats } from "../data/stats";

function StatCard({
  stat,
  className,
  style,
  isExpanded,
  onTap,
}: {
  stat: Stat;
  className?: string;
  style?: React.CSSProperties;
  isExpanded?: boolean;
  onTap?: () => void;
}) {
  const showHoverStyle = isExpanded ?? false;
  return (
    <div
      role={onTap ? "button" : undefined}
      tabIndex={onTap ? 0 : undefined}
      onClick={onTap}
      onKeyDown={onTap ? (e) => (e.key === "Enter" || e.key === " ") && onTap() : undefined}
      className={`group relative overflow-hidden bg-[#101010] transition-colors duration-300 hover:bg-[#36F4DB] ${className ?? ""}`}
      style={{ ...style, ...(showHoverStyle ? { backgroundColor: "#36F4DB" } : {}) }}
    >
      <div
        className="relative flex h-full min-h-[120px] flex-col items-start justify-center pl-4 pr-2 lg:px-8 text-white transition-colors duration-300 group-hover:text-black md:min-h-0"
        style={showHoverStyle ? { color: "black" } : undefined}
      >
        <p className="font-display text-[20px] font-bold leading-normal md:text-[32px] lg:text-[40px] xl:text-[56px]">
          {stat.value}
        </p>
        <p className="font-display text-[10px] font-bold md:text-[18px] xl:text-[24px] 2xl:text-[28px]">
          {stat.label}
        </p>
        <p className={`mt-2 md:mt-4 overflow-hidden text-[9.7px] transition-all duration-300 lg:text-[16px] md:text-[15px] xl:text-lg ${showHoverStyle ? "max-h-40 opacity-100" : "max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100"}`}>
          {stat.description}
        </p>
      </div>
    </div>
  );
}

const desktopCards: { statIndex: number; flexClass: string; clipPath: string }[] = [
  { statIndex: 0, flexClass: "flex-456", clipPath: "polygon(0 0, 96% 0, 100% 100%, 0 100%)" },
  { statIndex: 1, flexClass: "flex-533", clipPath: "polygon(0 0, 96% 0, 100% 100%, 3% 100%)" },
  { statIndex: 2, flexClass: "flex-732", clipPath: "polygon(0 0, 100% 0, 100% 100%, 3% 100%)" },
  { statIndex: 3, flexClass: "flex-732", clipPath: "polygon(0 0, 98% 0, 100% 100%, 0 100%)" },
  { statIndex: 4, flexClass: "flex-474", clipPath: "polygon(0 0, 96% 0, 100% 100%, 3% 100%)" },
  { statIndex: 5, flexClass: "flex-524", clipPath: "polygon(0 0, 100% 0, 100% 100%, 3% 100%)" },
];

const mobileCards: { statIndex: number; flexClass: string; clipPath: string }[] = [
  { statIndex: 0, flexClass: "flex-456", clipPath: "polygon(0 0, 95% 0, 100% 100%, 0 100%)" },
  { statIndex: 1, flexClass: "flex-533", clipPath: "polygon(0 0, 100% 0, 100% 100%, 5% 100%)" },
  { statIndex: 2, flexClass: "flex-732", clipPath: "polygon(0 0, 95% 0, 100% 100%, 0 100%)" },
  { statIndex: 3, flexClass: "flex-732", clipPath: "polygon(0 0, 100% 0, 100% 100%, 5% 100%)" },
  { statIndex: 4, flexClass: "flex-474", clipPath: "polygon(0 0, 100% 0, 95% 100%, 0 100%)" },
  { statIndex: 5, flexClass: "flex-524", clipPath: "polygon(5% 0, 100% 0, 100% 100%, 0 100%)" },
];

function useIsTouchDevice() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia("(hover: none)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(hover: none)").matches,
    () => false
  );
}

export function AboutSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const isTouchDevice = useIsTouchDevice();

  const handleCardTap = (statIndex: number) => {
    if (!isTouchDevice) return;
    setExpandedIndex((prev) => (prev === statIndex ? null : statIndex));
  };

  return (
    <section className="relative overflow-hidden bg-[#12011D] px-4 py-16 md:py-24 lg:py-32 lg:pb-52">
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[1400px] -translate-x-1/2 -translate-y-1/4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#AC42FB_0%,#8b5cf6_25%,#6d28d9_45%,transparent_70%)] opacity-70 blur-[100px]" /></div>

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <h2 id="what-we-offer" className="font-display text-3xl font-bold leading-normal tracking-tight sm:text-4xl md:text-5xl lg:text-[56px] bg-linear-to-r from-white via-white via-40% to-accent bg-clip-text text-transparent">
          Empowering Influence. Creating Value.

        </h2>
        <div className="mx-auto mt-4 max-w-6xl space-y-6 text-lg text-white md:text-2xl">
          <p>
            Pulse Nova helps game studios and publishers turn creator marketing into real momentum.
          </p>
          <p className="text-base md:text-2xl">
            We work fast, scale smart, and stay hands-on from planning to delivery. No matter the timeline or campaign size, our focus stays the same: reliable execution, strong support, and results you can measure.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-16 max-w-[1671px]">
        <div className="grid grid-cols-2 gap-y-2 md:hidden">
          {mobileCards.map(({ statIndex, flexClass, clipPath }) => (
            <StatCard
              key={statIndex}
              stat={stats[statIndex]}
              className={flexClass}
              style={{ clipPath }}
              isExpanded={isTouchDevice && expandedIndex === statIndex}
              onTap={isTouchDevice ? () => handleCardTap(statIndex) : undefined}
            />
          ))}
        </div>

        <div className="hidden flex-col gap-3 md:flex">
          <div className="flex h-[261px] gap-1">
            {desktopCards.slice(0, 3).map(({ statIndex, flexClass, clipPath }) => (
              <StatCard
                key={statIndex}
                stat={stats[statIndex]}
                className={flexClass}
                style={{ clipPath }}
              />
            ))}
          </div>
          <div className="flex h-[261px] gap-1">
            {desktopCards.slice(3, 6).map(({ statIndex, flexClass, clipPath }) => (
              <StatCard
                key={statIndex}
                stat={stats[statIndex]}
                className={flexClass}
                style={{ clipPath }}
              />
            ))}
          </div>
        </div>
      </div>
    </section >
  );
}
