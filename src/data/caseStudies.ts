export interface CaseStudyStat {
  value: string;
  label: string;
}

export interface CaseStudySlide {
  title: string;
  description: string;
  tags: string[];
  stats: CaseStudyStat[];
  image: string;
}

export interface CaseStudy {
  id: string;
  tabLabel: string;
  slides: CaseStudySlide[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: "mobile-legends",
    tabLabel: "Mobile Legends",
    slides: [
      {
        title: "Mobile Legends Professional League Singapore (MPL SG)",
        description:
          "National Tournament - MPL SG S9&S10 - Moonton (2025). The country’s only professional tournament of MLBB held officially. Service Provided:",
        tags: [
          "Tournament Design",
          "Strategy Planning",
          "Marketing",
          "Brand Collaboration",
          "E-sports Team Management",
          "Event Management",
        ],
        stats: [
          { value: "7.1 Billion", label: "Total Media Impressions" },
          { value: "67,000", label: "Peak Concurrent Users" },
          { value: "487,000", label: "Total Watch Hours" },
        ],
        image: "/images/case-studies/mobile-legends.png",
      },
      {
        title: "MLBB X Mediacorp (2024)",
        description:
          "MCC is an initiative designed to engage the younger generation and revitalize brands through gaming tournaments and shopping mall activations. Service Provided:",
        tags: [
          "Tournament design",
          "Strategy planning",
          "Marketing",
          "Esport team management",
          "Event Management",
          "Event execution",
        ],
        stats: [
          { value: "1.78 Million", label: "Total Impressions" },
          { value: "~500", label: "Total Attendees" },
        ],
        image: "/images/case-studies/mlbb-mediacorp.png",
      },
    ],
  },
  {
    id: "terminull-brigade",
    tabLabel: "Terminull Brigade",
    slides: [
      {
        title: "Terminull Brigade SEA Launch",
        description:
          "Support official launch of Tencent new games in South East Asia. Service Provided:",
        tags: [
          "Offline Activation",
          "PC Bar Collaboration",
          "Campus Club Collaboration",
          "Community Tournament",
          "Digital and Social Media",
        ],
        stats: [
          { value: "470K", label: "Total Impressions" },
          { value: "~300", label: "Total Attendees" },
        ],
        image: "/images/case-studies/terminull-brigade.png",
      },
    ],
  },
  {
    id: "project-sekai",
    tabLabel: "Project Sekai",
    slides: [
      {
        title: "Project Sekai - Bytedance",
        description:
          "Celebrate Project Sekai’s 2 Year Anniversary at anime cafe in Seoul and Busan. Service Provided:",
        tags: [
          "Venue Booking",
          "Venue Design and Branding",
          "KOL Marketing",
          "Onsite Management",
          "Merchandise",
        ],
        stats: [
          { value: "320K", label: "Total Impressions" },
          { value: "~1200", label: "Total Attendees" },
        ],
        image: "/images/case-studies/project-sekai-bytedance.png",
      },
      {
        title: "Project Sekai AGF",
        description:
          "Celebrate Project Sekai’s 1.5 Year Anniversary at the Anime x Games Festival 2023 happening in Ilsan. Service Provided:",
        tags: [
          "Venue Booking",
          "Booth Design",
          "KOL Marketing",
          "Onsite Management",
          "Merchandise",
        ],
        stats: [
          { value: "1.2M", label: "Total Impressions" },
          { value: "~3000", label: "Total Attendees" },
        ],
        image: "/images/case-studies/project-sekai-agf.png",
      },
    ],
  },
  {
    id: "oppo",
    tabLabel: "Oppo",
    slides: [
      {
        title: "MLBB X OPPO",
        description:
          "MLBB community tournament held in OPPO store to help the brand expand the influence and build the brand image. Service Provided:",
        tags: [
          "Tournament design",
          "Strategy planning",
          "Marketing",
          "Esport team management",
          "Event management",
          "Event execution",
        ],
        stats: [
          { value: "386K", label: "Total Impressions" },
          { value: "~350", label: "Total Attendees" },
        ],
        image: "/images/case-studies/mlbb-oppo.png",
      },
    ],
  },
  {
    id: "omniheroes",
    tabLabel: "Omniheroes",
    slides: [
      {
        title: "Omniheroes Global launch",
        description:
          "Omniheroes is a mobile game published by Omni Games; It’s global launch engages various KOLs among multiple regions. Service Provided:",
        tags: [
          "KOL Sourcing",
          "Contracting",
          "Content Strategy",
          "Communication Messaging Planning",
          "Execution",
        ],
        stats: [
          { value: "2.7M", label: "Total Viewership" },
          { value: "35", label: "KOL Engaged" },
        ],
        image: "/images/case-studies/omniheroes-global-launch.png",
      },
    ],
  },
];
