import dayjs from "dayjs";
import { date as fakeDate } from "faker";
import { v4 as uuidv4 } from "uuid";

import { type Day, type DayNew } from "@typings/day.types";
import { DATE_FORMAT_ISO_SHORT } from "@utilities/date.util";

/**
 * Create a fake day
 *
 * @param   day - Partial details
 * @returns Fake day
 */
const createFakeDay = (day: Omit<DayNew, "id">): Day => {
  return {
    id: uuidv4(),
    createdAt: fakeDate.past(1).toISOString(),
    ...day,
  };
};

// NOTE: Static exports are only calculated once when app loads!
//         Additionally, these values are used in fake days (caution)!
const fakeDays: Day[] = [
  createFakeDay({
    date: dayjs().subtract(174, "days").format(DATE_FORMAT_ISO_SHORT),
    icon: "heart",
    title: "Relationship",
    repeats: false,
    unit: "day",
  }),
  createFakeDay({
    date: dayjs().add(3, "weeks").format(DATE_FORMAT_ISO_SHORT),
    icon: "airplane",
    title: "Vacation",
    repeats: false,
    unit: "day",
  }),
  createFakeDay({
    date: dayjs().add(2, "months").format(DATE_FORMAT_ISO_SHORT),
    icon: "ring",
    title: "Friend's Wedding",
    repeats: false,
    unit: "month",
  }),
  createFakeDay({
    date: dayjs().subtract(151, "days").format(DATE_FORMAT_ISO_SHORT),
    icon: "baby",
    title: "Baby!",
    repeats: false,
    unit: "week",
  }),
  createFakeDay({
    date: dayjs(dayjs()).format(DATE_FORMAT_ISO_SHORT),
    icon: "cake",
    title: "Birthday",
    repeats: true,
    unit: "day",
  }),
  createFakeDay({
    date: dayjs().subtract(1, "days").format(DATE_FORMAT_ISO_SHORT),
    title: "Diet",
    repeats: false,
    unit: "day",
  }),
  createFakeDay({
    date: dayjs("2000-12-25").format(DATE_FORMAT_ISO_SHORT),
    icon: "pine-tree",
    title: "Christmas",
    repeats: true,
    unit: "day",
  }),
  createFakeDay({
    date: dayjs().subtract(48, "years").subtract(90, "days").format(DATE_FORMAT_ISO_SHORT),
    icon: "baby",
    title: "Born...",
    repeats: true,
    unit: "day",
  }),
];

export { createFakeDay, fakeDays };
