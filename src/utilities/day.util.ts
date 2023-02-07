import { MaterialCommunityIcons as MuiIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { v4 as uuid, validate as validateUuid } from "uuid";

import { DATE_FORMAT_ISO_SHORT } from "./date.util";

import type { Day } from "@typings/day.types";

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
const getDayDisplay = (targetDate: Day, startDate?: string): IDayCountDisplay => {
  const count = getDayCounter(targetDate, startDate);

  return {
    count,
    label: "days",
    valid: count >= 0,
  };
};

/**
 * Parse a raw object into a valid day
 *
 * @throws Error if input is invalid (and cannot recover)
 */
const parseDay = (day: any): Day => {
  const validCreatedAt = dayjs(day.createdAt).isValid();
  const validDate = dayjs(day.date).isValid();
  const validIcon = MuiIcons.glyphMap[day.icon as keyof typeof MuiIcons.glyphMap] ? day.icon : null;
  const validTitle = Boolean(day.title?.trim());

  const validUnits: Day["unit"][] = ["day", "month", "week", "year"];
  const validUnit = validUnits.includes(day.unit);

  if (!validDate || !validTitle) {
    throw new Error("Invalid parsed date");
  }

  return {
    createdAt: dayjs(validCreatedAt ? day.createdAt : undefined).toISOString(),
    date: day.date,
    icon: validIcon ? day.icon : null,
    id: validateUuid(day.id) ? day.id : uuid(),
    // Repeats should default to false
    repeats: day.repeats === "true" ? true : false,
    title: day.title?.trim(),
    unit: validUnit ? day.unit : "day",
  };
};

export { getDayCounter, getDayDisplay, parseDay };
