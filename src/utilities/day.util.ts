import dayjs from "dayjs";

// Utilities
import { IDayBase } from "@typings/day.types";

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
 * @param   day - Target date
 * @returns Day count since date
 */
const getDayCounter = (day: IDayBase): number => {
  const today = dayjs();
  const comparison = dayjs(day.date);

  return day.type === "countdown" ? comparison.diff(today, "days") : today.diff(comparison, "days");
};

/**
 * Calculate day display with label
 *
 * @param   day - Target date
 * @returns Day display label
 */
const getDayDisplay = (day: IDayBase): IDayCountDisplay => {
  const count = getDayCounter(day);

  return {
    count,
    label: "days",
    valid: count >= 0,
  };
};

export { getDayCounter, getDayDisplay };
