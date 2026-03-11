export const serviceOptions = [
  "KOL Influencer Marketing",
  "Livestream Marketing",
  "Photo / Video Creation",
  "Digital Marketing",
  "Event Marketing & Planning",
  "Launch & Appearance Events",
  "Collaboration Sponsored",
  "Brand Ambassadors",
] as const;

export const channelOptions = [
  "Facebook",
  "Instagram",
  "TikTok",
  "Onsite (Offline Appearance)",
  "Others",
] as const;

export type ServiceOption = (typeof serviceOptions)[number];
export type ChannelOption = (typeof channelOptions)[number];
