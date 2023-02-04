import { Optional } from "./app.types";

/** Day shape */
export interface Day {
  id: string;
  createdAt: string;
  /** Day occurrence */
  date: string;
  icon?: string;
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
  unit: "day" | "week" | "month" | "year";
}

export type DayNew = Optional<Day, "createdAt">;
