import dayjs from "dayjs";
import { date as fakeDate } from "faker";
import { v4 as uuidv4 } from "uuid";

// Utilities
import { DATE_FORMAT_ISO_SHORT } from "@utilities/date.util";

// Types
import { IDay } from "@typings/day.types";

type FakeDayNew = Pick<IDay, "title" | "date" | "repeats" | "type">;

/**
 * Create a fake day
 *
 * @param   day - Partial details
 * @returns Fake day
 */
const createFakeDay = (day: FakeDayNew): IDay => {
  return {
    id: uuidv4(),
    createdAt: fakeDate.past(1).toISOString(),
    pinned: false,
    ...day,
  };
};

// NOTE: Static exports are only calculated once when app loads!
//         Additionally, these values are used in fake days (caution)!
const fakeDays: IDay[] = [
  createFakeDay({
    date: dayjs("2022-05-12").format(DATE_FORMAT_ISO_SHORT),
    title: "App Creation",
    repeats: null,
    type: "countup",
  }),
  createFakeDay({
    date: dayjs("2022-04-21").format(DATE_FORMAT_ISO_SHORT),
    title: "Relationship",
    repeats: null,
    type: "countup",
  }),
  createFakeDay({
    date: dayjs("2022-10-29").format(DATE_FORMAT_ISO_SHORT),
    title: "Friend's Wedding",
    repeats: null,
    type: "countdown",
  }),
  createFakeDay({
    date: dayjs("2022-12-25").format(DATE_FORMAT_ISO_SHORT),
    title: "Christmas",
    repeats: "year",
    type: "countdown",
  }),
];

export { createFakeDay, fakeDays };
