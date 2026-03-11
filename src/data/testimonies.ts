export interface Testimony {
  companyName: string;
  companyLogo: string;
  quote: string;
  hasGlow?: boolean;
  colSpan?: number;
  /** Optional extra class for the logo img (e.g. to fix aspect ratio so it matches other logos) */
  logoClassName?: string;
}

export const testimonies: Testimony[] = [
  {
    companyName: "fhyx",
    companyLogo: "/images/brands/fhyx-com.png",
    quote:
      "In less than 4 weeks, Pulse Nova helped us activate 10+ campus communities and generate over 50,000 targeted impressions. Their precision in execution and local insight made the campaign highly efficient.",
    hasGlow: true,
  },
  {
    companyName: "pethea",
    companyLogo: "/images/brands/pathea.png",
    quote:
      "Working with Pulse Nova feels less like outsourcing and more like building together. The team is responsive, strategic, and genuinely invested in outcomes.",
  },
  {
    companyName: "omnidream",
    companyLogo: "/images/brands/OmniDream.png",
    quote:
      "Pulse Nova understands how to translate brand strategy into actionable campaigns. Their team moves fast, communicates clearly, and delivers with precision. In competitive markets, that reliability matters.",
    colSpan: 2,
  },
  {
    companyName: "youdao",
    companyLogo: "/images/brands/youdao.png",
    quote:
      "They don’t just execute assets — they think structurally. From community activation to sponsorship integration, every piece connects back to measurable objectives.",
    colSpan: 2,
    logoClassName: "max-w-[170px]",
  },
  {
    companyName: "tecno",
    companyLogo: "/images/brands/tecno-logo.png",
    quote:
      "Timelines were clear, reporting was transparent, and the final outcome exceeded initial projections.",
  },
  {
    companyName: "tencent",
    companyLogo: "/images/brands/tencent.png",
    quote:
      "Their regional network across Southeast Asia allowed us to scale efficiently. The team balanced local nuance with global brand alignment — which is not easy to achieve.",
    hasGlow: true,
    logoClassName: "md:max-w-[200px]",
  },
];
