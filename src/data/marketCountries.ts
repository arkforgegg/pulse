/** Countries in the flags panel (Figma node 506:6701). Order and flag asset key. */
export interface MarketCountry {
  name: string;
  flag: string; // path under /images/flags/
}

export const marketCountries: MarketCountry[] = [
  { name: "SINGAPORE", flag: "singapore.svg" },
  { name: "MALAYSIA", flag: "malaysia.svg" },
  { name: "MAINLAND CHINA", flag: "china.svg" },
  { name: "HONG KONG", flag: "hong-kong.svg" },
  { name: "TAIWAN", flag: "taiwan.svg" },
  { name: "JAPAN", flag: "japan.svg" },
  { name: "KOREA", flag: "south-korea.svg" },
  { name: "PHILIPPINES", flag: "philippines.svg" },
  { name: "THAILAND", flag: "thailand.svg" },
  { name: "VIETNAM", flag: "vietnam.svg" },
  { name: "INDONESIA", flag: "indonesia.svg" },
];
