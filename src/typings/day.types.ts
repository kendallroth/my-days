import { MaterialCommunityIcons, Optional } from "./app.types";

export type DayUnit = "day" | "week" | "month" | "year";

/** Day shape */
export interface Day {
  id: string;
  createdAt: string;
  /** Day occurrence */
  date: string;
  icon?: keyof MaterialCommunityIcons;
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

export type DayNew = Optional<Day, "createdAt">;
