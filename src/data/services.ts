export interface Service {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
}

export const services: Service[] = [
  {
    id: "event-management",
    title: "Event Management",
    description:
      "We plan and manage gaming and esports events from concept to on-site execution. From tournaments and launches to branded activations, our team handles timelines, vendors, talent coordination, and live operations to ensure every event runs smoothly and delivers real audience impact.",
    tags: [
      "Event Planning",
      "Live Operations",
      "Tournament Management",
      "On-site Execution",
      "Vendor Coordination",
      "Audience Engagement",
      "Timeline Control",
    ],
    imageUrl: "/images/services/event-management.jpg",
  },
  {
    id: "community-management",
    title: "Community Management",
    description:
      "We help brands build and maintain active gaming communities across platforms. Through daily engagement, content planning, moderation, and event-based activations, we turn players and followers into long-term community members who stay connected beyond campaigns.",
    tags: [
      "Community Growth",
      "Player Engagement",
      "Discord Management",
      "Social Operations",
      "Moderation",
      "Content Scheduling",
      "Retention Strategy",
    ],
    imageUrl: "/images/services/community-management.jpg",
  },
  {
    id: "talent-booking",
    title: "Talent Booking",
    description:
      "We connect brands with the right creators, streamers, and esports talent. From sourcing and negotiations to scheduling and delivery, we manage the full booking process and ensure talent integrations feel authentic, aligned, and performance-driven.",
    tags: [
      "Creator Sourcing",
      "Influencer Marketing",
      "Contract Negotiation",
      "Talent Coordination",
      "Campaign Alignment",
      "Performance Tracking",
    ],
    imageUrl: "/images/services/talent-booking.jpg",
  },
  {
    id: "ip-sponsorship",
    title: "IP Sponsorship",
    description:
      "We design sponsorship strategies around gaming, esports, and entertainment IPs. By aligning brands with the right IPs, events, and communities, we create partnerships that go beyond logo placement and drive cultural relevance and long-term brand value.",
    tags: [
      "IP Partnerships",
      "Sponsorship Strategy",
      "Brand Integration",
      "Esports IP",
      "Licensing Support",
      "Activation Planning",
      "Long-term Value",
    ],
    imageUrl: "/images/services/ip-sponsorship.png",
  },
  {
    id: "public-relations",
    title: "Public Relations (PR)",
    description:
      "We deliver focused PR solutions for gaming and entertainment brands. Through strategic messaging, media outreach, and creator amplification, we help brands gain visibility, shape narratives, and build credibility within both industry and player communities.",
    tags: [
      "Media Relations",
      "Strategic Messaging",
      "Brand Visibility",
      "Thought Leadership",
      "Press Coverage",
      "Narrative Building",
      "Reputation Management",
    ],
    imageUrl: "/images/services/public-relations.jpg",
  },
  {
    id: "video-production",
    title: "Video Production",
    description:
      "We produce gaming-first video content built for performance across platforms. From trailers and livestream assets to short-form social content, our production team delivers visuals that match platform behavior and audience expectations.",
    tags: [
      "Video Production",
      "Livestream Content",
      "Short-form Video",
      "Creative Direction",
      "Post-production",
      "Platform Optimization",
      "Visual Storytelling",
    ],
    imageUrl: "/images/services/video-production.jpg",
  },
];
