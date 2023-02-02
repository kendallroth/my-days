import dayjs from "dayjs";

// Utilities
import { DayBase } from "@typings/day.types";
import { DATE_FORMAT_ISO_SHORT } from "./date.util";

interface IDayCountDisplay {
  /** Day count value (can be negative if invalid!) */
  count: number;
  /** Day count label (ie. "days", etc) */
  label: string;
  /** Whether today is within expected countdown/countup range */
  valid: boolean;
}

/**
 * Count days since a countdown/countup
 *
 * @param   targetDate - Target date
 * @param   startDate  - Optional start date (defaults to today)
 * @returns Day count since date
 */
const getDayCounter = (targetDate: DayBase, startDate?: string): number => {
  // NOTE: Must zero out today's date for accurate calculations!
  const baseDate = startDate ? dayjs(startDate) : dayjs(dayjs().format(DATE_FORMAT_ISO_SHORT));
  let comparison = dayjs(targetDate.date);

  if (targetDate.repeats) {
    const todayYear = baseDate.year();
    const dateInThisYear = comparison.clone().set("year", todayYear);
    // Use next year if date has already occurred this year
    if (baseDate.isSame(dateInThisYear, "day")) {
      return 0;
    } else if (baseDate.isBefore(dateInThisYear, "day")) {
      comparison = dateInThisYear;
    } else {
      comparison = dateInThisYear.add(1, "year");
    }
  }

  return comparison.diff(baseDate, "days");
};

/**
 * Calculate day display with label
 *
 * @param   targetDate - Target date
 * @param   startDate  - Optional start date (defaults to today)
 * @returns Day display label
 */
const getDayDisplay = (targetDate: DayBase, startDate?: string): IDayCountDisplay => {
  const count = getDayCounter(targetDate, startDate);

  return {
    count,
    label: "days",
    valid: count >= 0,
  };
};

export { getDayCounter, getDayDisplay };
