import { MaterialCommunityIcons as MuiIcons } from "@expo/vector-icons";

import { type MaterialCommunityIcons } from "@typings/app.types";

/** Explicitly supported day icons (can technically use any from MUI) */
export const dayIcons: (keyof MaterialCommunityIcons)[] = [
  // Assorted
  "calendar",
  "star",
  "clock",
  // Travel
  "airplane",
  "beach",
  "earth",
  "bicycle",
  "car",
  "sail-boat",
  // Events
  "party-popper",
  "campfire",
  "silverware",
  "cake",
  "camera",
  "video-vintage",
  // Relationships
  "heart",
  "account-multiple",
  "account-group",
  "ring",
  // Yearly events
  "fire",
  "snowflake",
  "pine-tree",
  "halloween",
  // Life events
  "baby-carriage",
  "school",
  "cross",
  "coffin",
];

/** Check whether day icon string is valid MUI icon */
export const isDayIconValid = (icon: string): boolean => {
  return MuiIcons.glyphMap[icon as keyof typeof MuiIcons.glyphMap] ? true : false;
};
