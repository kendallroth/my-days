/** Base day shape */
export interface DayBase {
  id: string;
  /** Day occurrence */
  date: string;
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

export interface Day extends DayBase {
  /** When day was created */
  createdAt: string;
  color?: string;
  icon?: string;
}
