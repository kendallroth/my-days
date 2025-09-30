import { type MaterialCommunityIcons, type Optional } from "./app.types";

export const dayUnits = ["day", "week", "month", "year"] as const;

export type DayUnit = (typeof dayUnits)[number];

/** Day shape */
export interface Day {
  id: string;
  createdAt: string;
  /** Day occurrence */
  date: string;
  icon: keyof MaterialCommunityIcons | null;
  /**
   * Whether interval repeats each year
   *
   * - With repetition: counts will use the next yearly occurance.
   * - Without repetition: counts will always use the same fixed date.
   */
  repeats: boolean;
  /** Day name/title */
  title: string;
  /** Time unit used for display purposes */
  unit: DayUnit;
}

export interface DayExtended extends Day {
  // TODO: Include calculated day offset/count

  /** Whether day details should be displayed upon opening app */
  startOpen: boolean;
}

export type DayNew = Optional<Day, "createdAt">;
