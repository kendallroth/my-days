import { boolean, object, string } from "yup";

import { type MaterialCommunityIcons } from "@typings/app.types";
import { dayUnits } from "@typings/day.types";

import type { TFunction } from "react-i18next";
import type { InferType } from "yup";

export const maxTitleLength = 40;

export const getFormSchema = (t: TFunction<("common" | "screens")[], undefined>) => {
  return object({
    date: string()
      .label(t("screens:dayForm.dayDateLabel"))
      .required()
      .matches(/^\d{4}-\d{2}-\d{2}$/, t("screens:dayForm.dayDateFormatError")),
    icon: string<keyof MaterialCommunityIcons>().required().nullable(),
    repeats: boolean().required(),
    title: string().label(t("screens:dayForm.dayTitleLabel")).required().min(2).max(maxTitleLength),
    unit: string().oneOf(dayUnits).required(),
  });
};

export type DayForm = InferType<ReturnType<typeof getFormSchema>>;
