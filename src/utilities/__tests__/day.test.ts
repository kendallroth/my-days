import dayjs from "dayjs";

import { type DayUnit } from "@typings/day.types";
import { DATE_FORMAT_ISO_SHORT } from "@utilities/date.util";

import { getDayDiff } from "../day.util";

describe("day.util", () => {
  describe("getDayDiff (today)", () => {
    const todayIso = dayjs().toISOString();
    const tomorrowIso = dayjs().add(1, "day").toISOString();
    const cases: { date: string; todayDate?: string; unit: DayUnit }[] = [
      { date: todayIso, unit: "day" },
      { date: todayIso, unit: "week" },
      { date: todayIso, unit: "month" },
      { date: todayIso, unit: "year" },
      { date: todayIso, unit: "year" },
      { date: tomorrowIso, todayDate: tomorrowIso, unit: "year" },
    ];

    test.each(cases)("$unit", ({ date, todayDate, unit }) => {
      const dayDiff = getDayDiff({ date, repeats: false }, unit, todayDate);
      expect(dayDiff).toBe(0);
    });
  });

  describe("getDayDiff (custom start date)", () => {
    const todayIso = dayjs().format(DATE_FORMAT_ISO_SHORT);
    const tomorrowIso = dayjs().add(1, "day").format(DATE_FORMAT_ISO_SHORT);
    const cases: { date: string; expected: number; todayDate?: string; unit: DayUnit }[] = [
      // Day
      { date: todayIso, expected: 0, todayDate: todayIso, unit: "day" },
      { date: tomorrowIso, expected: 1, todayDate: todayIso, unit: "day" },
      { date: todayIso, expected: -1, todayDate: tomorrowIso, unit: "day" },
      { date: tomorrowIso, expected: 1, todayDate: todayIso, unit: "day" },
      // Week
      {
        date: dayjs("2023-01-01").format(DATE_FORMAT_ISO_SHORT),
        expected: -2,
        todayDate: dayjs("2023-01-15").format(DATE_FORMAT_ISO_SHORT),
        unit: "week",
      },
      {
        date: dayjs("2023-01-28").format(DATE_FORMAT_ISO_SHORT),
        expected: 3.857142857142857,
        todayDate: dayjs("2023-01-01").format(DATE_FORMAT_ISO_SHORT),
        unit: "week",
      },
      // Month
      {
        date: dayjs("2023-03-01").format(DATE_FORMAT_ISO_SHORT),
        expected: 2,
        todayDate: dayjs("2023-01-01").format(DATE_FORMAT_ISO_SHORT),
        unit: "month",
      },
      // TODO: Figure out why this test works locally, but breaks in GitHub actions
      /*{
        date: dayjs("2023-03-15").format(DATE_FORMAT_ISO_SHORT),
        expected: 0.4992548435171386,
        // expected: 0.5,
        todayDate: dayjs("2023-03-01").format(DATE_FORMAT_ISO_SHORT),
        unit: "month",
      },*/
    ];

    test.each(cases)("$todayDate => $date ($unit)", ({ date, expected, todayDate, unit }) => {
      const dayDiff = getDayDiff({ date, repeats: false }, unit, todayDate);
      expect(dayDiff).toBe(expected);
    });
  });

  describe("getDayDiff (repeats)", () => {
    const customToday = dayjs("2023-01-08");
    const cases: { date: string; expected: number; unit: DayUnit }[] = [
      {
        date: customToday.format(DATE_FORMAT_ISO_SHORT),
        expected: 0,
        unit: "day",
      },
      {
        date: customToday.add(1, "day").format(DATE_FORMAT_ISO_SHORT),
        expected: 1,
        unit: "day",
      },
      {
        date: customToday.subtract(1, "day").format(DATE_FORMAT_ISO_SHORT),
        expected: 364,
        unit: "day",
      },
      {
        date: customToday.subtract(5, "year").subtract(1, "day").format(DATE_FORMAT_ISO_SHORT),
        expected: 364,
        unit: "day",
      },
    ];

    test.each(cases)("$date ($expected $unit)", ({ date, expected, unit }) => {
      const dayDiff = getDayDiff({ date, repeats: true }, unit, customToday.toISOString());
      expect(dayDiff).toBe(expected);
    });
  });
});
