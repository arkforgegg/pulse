export const footerEmail = "BUSINESS@PULSENOVA.GG";

export type LegalModalId = "privacy" | "terms";

export const footerLinks = [
  { label: "Privacy Policy", modalId: "privacy" as LegalModalId },
  { label: "Terms of Use", modalId: "terms" as LegalModalId },
] as const;

export const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://sg.linkedin.com/company/pulse-nova-entertainment-pte-ltd",
    icon: "/icons/linkedin.svg",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/pulsenova.ent/reels/",
    icon: "/icons/facebook.svg",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/pulsenova.ent/?hl=en",
    icon: "/icons/instagram.svg",
  },
] as const;
