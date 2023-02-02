import dayjs from "dayjs";
import { date as fakeDate } from "faker";
import { v4 as uuidv4 } from "uuid";

// Utilities
import { DATE_FORMAT_ISO_SHORT } from "@utilities/date.util";

// Types
import { Day } from "@typings/day.types";

type FakeDayNew = Pick<Day, "title" | "date" | "repeats">;

/**
 * Create a fake day
 *
 * @param   day - Partial details
 * @returns Fake day
 */
const createFakeDay = (day: FakeDayNew): Day => {
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
    date: dayjs("2022-04-20").format(DATE_FORMAT_ISO_SHORT),
    title: "Dating",
    repeats: false,
  }),
  createFakeDay({
    date: dayjs("2022-10-29").format(DATE_FORMAT_ISO_SHORT),
    title: "Friend's Wedding",
    repeats: false,
  }),
  createFakeDay({
    date: dayjs("2000-12-25").format(DATE_FORMAT_ISO_SHORT),
    title: "Christmas",
    repeats: true,
  }),
  createFakeDay({
    date: dayjs("2023-02-13").format(DATE_FORMAT_ISO_SHORT),
    title: "Vacation Trip",
    repeats: false,
  }),
];

export { createFakeDay, fakeDays };
