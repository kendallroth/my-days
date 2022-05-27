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
    archivedAt: null,
    createdAt: fakeDate.past(1).toISOString(),
    ...day,
  };
};

// NOTE: Static exports are only calculated once when app loads!
//         Additionally, these values are used in fake days (caution)!
const fakeDays: IDay[] = [
  createFakeDay({
    date: dayjs().subtract(5, "day").format(DATE_FORMAT_ISO_SHORT),
    title: "Pickup Hockey",
    repeats: null,
    type: "countup",
  }),
  createFakeDay({
    date: dayjs().subtract(2, "day").format(DATE_FORMAT_ISO_SHORT),
    title: "Painting Class",
    repeats: "year",
    type: "countdown",
  }),
  createFakeDay({
    date: dayjs().add(3, "day").format(DATE_FORMAT_ISO_SHORT),
    title: "Ice Skating",
    repeats: null,
    type: "countdown",
  }),
  createFakeDay({
    date: dayjs().add(10, "day").format(DATE_FORMAT_ISO_SHORT),
    title: "Camping Trip",
    repeats: "year",
    type: "countdown",
  }),
];

export { createFakeDay, fakeDays };
