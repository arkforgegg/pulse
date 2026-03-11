/** Regions shown on the big world map (Figma node 506:5782). */
export interface MarketRegion {
  name: string;
  left: number; // % of map width
  top: number; // % of map height
}

export const marketRegions: MarketRegion[] = [
  { name: "NORTH AMERICA", left: 25, top: 32.2 },
  { name: "EUROPE", left: 42.9, top: 18.5 },
  { name: "MIDDLE EAST", left: 54.6, top: 46.6 },
  { name: "ASIA", left: 74, top: 28.9 },
  { name: "OCEANIA", left: 85.2, top: 60.6 },
];
