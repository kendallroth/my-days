import dayjs from "dayjs";

// Utilities
import { IDayBase } from "@typings/day.types";

interface IDayCountDisplay {
  count: number;
  label: string;
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
  return {
    count: getDayCounter(day),
    label: "days",
  };
};

export { getDayCounter, getDayDisplay };
