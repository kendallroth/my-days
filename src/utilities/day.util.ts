import dayjs from "dayjs";

import { type Day, type DayUnit } from "@typings/day.types";

import { roundNumber } from "./number.util";

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

export type DiffDayArgs = Pick<Day, "date" | "repeats">;

/**
 * Count time units since a countdown/countup
 *
 * @param   targetDate - Target date
 * @param   unit       - Unit of time to measure
 * @param   startDate  - Optional start date (defaults to today)
 * @returns Time unit count since date (positive indicates moving towards date)
 */
export const getDayDiff = (targetDate: DiffDayArgs, unit: DayUnit, startDate?: string): number => {
  // NOTE: Must zero out both target and today's date for accurate calculations!
  const baseDate = dayjs(startDate).startOf("day");
  let comparison = dayjs(targetDate.date).startOf("day");

  if (targetDate.repeats) {
    const todayYear = baseDate.year();
    const dateInThisYear = comparison.clone().set("year", todayYear);
    if (baseDate.isSame(dateInThisYear, "day")) {
      return 0;
    } else if (baseDate.isBefore(dateInThisYear, "day")) {
      comparison = dateInThisYear;
    } else {
      // Use next year if date has already occurred this year
      comparison = dateInThisYear.add(1, "year");
    }
  }

  // Must allow returning decimal values (for non-day units)
  return comparison.diff(baseDate, unit, true);
};

/**
 * Calculate day display with label
 *
 * @param   targetDate - Target date
 * @param   startDate  - Optional start date (defaults to today)
 * @returns Day display label
 */
export const getDayDisplay = (targetDate: Day, startDate?: string): DayCountDisplay => {
  // Support a maximum of 4 decimals places
  const maxDecimals = 4;
  const dayCount = roundNumber(getDayDiff(targetDate, "day", startDate), maxDecimals);
  const weekCount = roundNumber(getDayDiff(targetDate, "week", startDate), maxDecimals);
  const monthCount = roundNumber(getDayDiff(targetDate, "month", startDate), maxDecimals);
  const yearCount = roundNumber(getDayDiff(targetDate, "year", startDate), maxDecimals);

  let count = dayCount;
  switch (targetDate.unit) {
    case "week":
      count = weekCount;
      break;
    case "month":
      count = monthCount;
      break;
    case "year":
      count = yearCount;
      break;
  }

  return {
    count,
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
