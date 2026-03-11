export interface Stat {
  value: string;
  label: string;
  description: string;
}

export const stats: Stat[] = [
  {
    value: "< 2",
    label: "Hours Response Time",
    description:
      "Average time to respond to client inquiries and briefs with actionable feedback.",
  },
  {
    value: "50+",
    label: "Projects per Year",
    description:
      "Across gaming, esports, brand marketing, and cross-border campaigns.",
  },
  {
    value: "98%",
    label: "On-Time Project Delivery",
    description: "Consistently meeting agreed timelines and milestones.",
  },
  {
    value: "120 - 180",
    label: "Hours Invested per Project",
    description:
      "Covering strategy, planning, execution, and post-campaign review.",
  },
  {
    value: "10+",
    label: "Years of Experience",
    description:
      "A senior team with hands-on experience across gaming, esports, content, and branding.",
  },
  {
    value: "70%+",
    label: "Repeat Collaboration Rate",
    description: "Built on long-term partnerships and sustained client trust.",
  },
];
