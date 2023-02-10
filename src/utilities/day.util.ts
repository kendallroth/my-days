import dayjs from "dayjs";

import { type Day } from "@typings/day.types";

import { DATE_FORMAT_ISO_SHORT } from "./date.util";

interface DayCountDisplay {
  /** Day count value (can be negative if invalid!) */
  count: number;
  /**
   * Whether count is moving towards or away from date
   *
   * NOTE: Today is considered to still be a countdown.
   */
  direction: "down" | "up";
  /** Day count label (ie. "days", etc) */
  label: string;
  /** Whether date is today */
  today: boolean;
  stats: {
    days: number;
    weeks: number;
    months: number;
    years: number;
  };
}

/**
 * Count days since a countdown/countup
 *
 * @param   targetDate - Target date
 * @param   startDate  - Optional start date (defaults to today)
 * @returns Day count since date
 */
const getDayCounter = (targetDate: Day, startDate?: string): number => {
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
const getDayDisplay = (targetDate: Day, startDate?: string): DayCountDisplay => {
  const maxDecimalMultiplier = 1000;
  const dayCount = getDayCounter(targetDate, startDate);
  const weekCount = Math.round((dayCount / 7) * maxDecimalMultiplier) / maxDecimalMultiplier;
  const monthCount = Math.round((dayCount / 30.417) * maxDecimalMultiplier) / maxDecimalMultiplier;
  const yearCount = Math.round((dayCount / 365) * maxDecimalMultiplier) / maxDecimalMultiplier;

  return {
    // TODO: Modify count to consider selected day unit
    count: dayCount,
    direction: dayCount >= 0 ? "down" : "up",
    label: "days",
    today: dayCount === 0,
    stats: {
      days: dayCount,
      weeks: weekCount,
      months: monthCount,
      years: yearCount,
    },
  };
};

export { getDayCounter, getDayDisplay };
