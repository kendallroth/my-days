import dayjs from "dayjs";
import { date as fakeDate } from "faker";
import { v4 as uuidv4 } from "uuid";

import { DayIcons } from "@components/icons";
import { DATE_FORMAT_ISO_SHORT } from "@utilities/date.util";

import type { Day } from "@typings/day.types";

type FakeDayNew = Pick<Day, "color" | "title" | "date" | "icon" | "repeats" | "unit">;

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
    // color: "#D01760",
    date: dayjs("2022-04-20").format(DATE_FORMAT_ISO_SHORT),
    icon: DayIcons.heart,
    title: "Dating",
    repeats: false,
    unit: "day",
  }),
  createFakeDay({
    date: dayjs("2022-10-29").format(DATE_FORMAT_ISO_SHORT),
    icon: DayIcons.wedding,
    title: "Friend's Wedding",
    repeats: false,
    unit: "day",
  }),
  createFakeDay({
    date: dayjs("2000-12-25").format(DATE_FORMAT_ISO_SHORT),
    title: "Christmas",
    repeats: true,
    unit: "day",
  }),
  createFakeDay({
    date: dayjs("2023-02-13").format(DATE_FORMAT_ISO_SHORT),
    icon: DayIcons.airplane,
    title: "Vacation Trip",
    repeats: false,
    unit: "day",
  }),
];

export { createFakeDay, fakeDays };
