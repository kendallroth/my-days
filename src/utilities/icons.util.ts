import { MaterialCommunityIcons as MuiIcons } from "@expo/vector-icons";

import { type MaterialCommunityIcons } from "@typings/app.types";

interface DayIcon {
  /** MUI icon name (must match MUI icon string key) */
  name: keyof MaterialCommunityIcons;
  /** List of tags matching this icon (for better searching) */
  tags: string[];
}

export const dayIcons: DayIcon[] = [
  // Assorted
  { name: "calendar", tags: [] },
  { name: "star", tags: ["favourite"] },
  { name: "clock", tags: ["time"] },
  // Travel
  { name: "airplane", tags: [] },
  { name: "beach", tags: ["vacation"] },
  { name: "earth", tags: ["globe"] },
  { name: "bicycle", tags: ["bike"] },
  { name: "car", tags: ["truck"] },
  { name: "sail-boat", tags: ["boat"] },
  // Events
  { name: "party-popper", tags: ["birthday"] },
  { name: "campfire", tags: [] },
  { name: "silverware", tags: ["food", "cutlery"] },
  { name: "cake", tags: ["party"] },
  { name: "camera", tags: ["photo", "picture"] },
  { name: "google-controller", tags: ["game"] },
  { name: "video-vintage", tags: ["movie"] },
  { name: "cash", tags: ["money"] },
  { name: "ticket-confirmation", tags: [] },
  // Relationships
  { name: "heart", tags: ["love"] },
  { name: "account", tags: ["person", "people"] },
  { name: "account-heart", tags: ["person", "love"] },
  { name: "account-multiple", tags: ["person", "people"] },
  { name: "account-group", tags: ["person", "people"] },
  { name: "ring", tags: ["wedding", "love"] },
  // Yearly events
  { name: "fire", tags: [] },
  { name: "snowflake", tags: ["winter", "christmas"] },
  { name: "sprout", tags: ["plant", "spring"] },
  { name: "pine-tree", tags: ["christmas"] },
  { name: "gift", tags: ["christmas", "birthday"] },
  { name: "halloween", tags: ["pumpkin"] },
  { name: "egg-easter", tags: [] },
  // Life events
  { name: "baby-carriage", tags: [] },
  { name: "school", tags: ["building"] },
  { name: "cross", tags: [] },
  { name: "coffin", tags: ["funeral"] },
];

/** Check whether day icon string is valid MUI icon */
export const isDayIconValid = (icon: string): boolean => {
  return MuiIcons.glyphMap[icon as keyof typeof MuiIcons.glyphMap] ? true : false;
};
