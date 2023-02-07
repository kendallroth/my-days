import { MaterialCommunityIcons as MuiIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { type QueryParams } from "expo-linking";
import { v4 as uuid, validate as validateUuid } from "uuid";

import { CodedError } from "@errors";
import { type MaterialCommunityIcons } from "@typings/app.types";

import { DATE_FORMAT_ISO_SHORT } from "./date.util";

import type { Day, DayUnit } from "@typings/day.types";

/**
 * Shared day config schema version
 *
 * When parsing/comparing incoming shared days, any "newer" incoming versions should be rejected
 *   and prompt the user to update their app, while "older" incoming versions should be handled
 *   through a known comparison/migration step.
 */
export const SHARED_DAY_VERSION = 1;

/**
 * Parse a raw object into a valid day
 *
 * @throws Error if input is invalid (and cannot recover)
 */
const parseDay = (day: any): Day => {
  // Day config parsing can only parse shared versions less than the current supported version,
  //   as backwards compatibility/migration can only be guaranteed this way (update app otherwise).
  // Also must check versions before validating whether parsed day is valid or not
  const sharedVersion = parseInt(day.version, 10) || SHARED_DAY_VERSION;
  if (sharedVersion > SHARED_DAY_VERSION) {
    throw new CodedError("common:errors.parsing.invalidParsedDayVersion");
  }

  const linkParser = parseSharedDayLinkVersionMap[sharedVersion];
  const dayParser = parseDayVersionMap[sharedVersion];
  if (!linkParser || !dayParser) {
    throw new CodedError("common:errors.parsing.invalidParsedDayVersion");
  }

  const parsedLinkDay = linkParser(day);
  return dayParser(parsedLinkDay);
};

/** Safely parse/transform a parameterized query string */
const parseParamString = (params: QueryParams, key: string): string | undefined => {
  const raw = params[key];
  if (!raw) return undefined;

  const createdAtSingle = Array.isArray(raw) ? raw[0] : raw;
  return typeof createdAtSingle === "object" ? undefined : createdAtSingle;
};

/** Loosely parse a V1 shared day link (no validation) */
const parseSharedDayLinkV1 = (day: QueryParams): Partial<Day> => {
  return {
    createdAt: parseParamString(day, "createdAt"),
    date: parseParamString(day, "date"),
    id: parseParamString(day, "id"),
    icon: parseParamString(day, "icon") as keyof MaterialCommunityIcons | undefined,
    repeats: parseParamString(day, "repeats") === "true",
    title: parseParamString(day, "title"),
    unit: parseParamString(day, "unit") as DayUnit | undefined,
  };
};

/**
 * Parse a V1 day (using reasonable defaults and validation)
 *
 * @throws Error if input is invalid (and cannot recover)
 */
const parseDayV1 = (day: Partial<Day>): Day => {
  const title = day.title?.trim();

  // Technically date and title are the only fields that truly matter...
  const validDate = dayjs(day.date).isValid();
  if (!validDate || !title) {
    throw new CodedError("common:errors.parsing.invalidParsedDay");
  }

  const validUnits: DayUnit[] = ["day", "month", "week", "year"];

  return {
    createdAt: dayjs(dayjs(day.createdAt).isValid() ? day.createdAt : undefined).toISOString(),
    date: dayjs(day.date).format(DATE_FORMAT_ISO_SHORT),
    icon: day.icon && MuiIcons.glyphMap[day.icon] ? day.icon : undefined,
    id: day.id && validateUuid(day.id) ? day.id : uuid(),
    repeats: day.repeats ?? false,
    title,
    unit: day.unit && validUnits.includes(day.unit) ? day.unit : "day",
  };
};

const parseDayVersionMap: Record<number, typeof parseDayV1> = {
  1: parseDayV1,
};

const parseSharedDayLinkVersionMap: Record<number, typeof parseSharedDayLinkV1> = {
  1: parseSharedDayLinkV1,
};

export { parseDay };
