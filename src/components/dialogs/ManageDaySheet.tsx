import { yupResolver } from "@hookform/resolvers/yup";
import React, { forwardRef, ReactElement, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { TFunction, useTranslation } from "react-i18next";
import { TextInput as RNTextInput, StyleSheet, View } from "react-native";
import { Button, Dialog, useTheme } from "react-native-paper";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";

import { DateTimeInput, TextInput } from "@components/form";

import BottomSheet from "./BottomSheet";

import type { BottomSheetRef } from "./BottomSheet";
import type { Day, DayBase } from "@typings/day.types";

interface IFormData {
  date: string;
  title: string;
}

type ManageDaySheetProps = {
  /** Day to update */
  day?: Day | null;
  /** Add day callback */
  onAdd?: (day: DayBase) => void;
  /** Cancellation callback */
  onCancel: () => void;
  /** Update day callback */
  onEdit?: (day: Day) => void;
};

const getSchema = (t: TFunction<("common" | "screens")[], undefined>) => {
  return yup.object({
    date: yup
      .string()
      .label(t("screens:dayAddEdit.dayDateLabel"))
      .required()
      .matches(/^\d{4}-\d{2}-\d{2}$/, t("screens:dayAddEdit.dayDateFormatError")),
    title: yup.string().label(t("screens:dayAddEdit.dayTitleLabel")).required().min(2),
  });
};

const ManageDaySheet = forwardRef<BottomSheetRef, ManageDaySheetProps>(
  (props: ManageDaySheetProps, ref): ReactElement => {
    const { day, onAdd, onCancel, onEdit } = props;

    const titleRef = useRef<RNTextInput | null>(null);
    const dateRef = useRef<RNTextInput | null>(null);

    const { colors } = useTheme();
    const { t } = useTranslation(["common", "screens"]);
    const form = useForm<IFormData>({
      defaultValues: {
        date: day?.date ?? "",
        title: day?.title ?? "",
      },
      resolver: yupResolver(getSchema(t)),
    });

    const editing = Boolean(day);

    // Clear form whenever edited day changes (when editing or adding)
    useEffect(() => {
      form.reset({
        date: day?.date ?? "",
        title: day?.title ?? "",
      });
    }, [day, form]);

    /**
     * Prepare modal when opened
     */
    const onOpen = (): void => {
      // NOTE: Short timeout necessary to access ref and open keyboard!
      setTimeout(() => {
        titleRef.current?.focus();
      }, 250);

      // NOTE: Form is also reset by "visibility" (necessary for editing day)
      form.reset();
    };

    /**
     * Add/update the entered day
     *
     * @param data - Submitted form data
     */
    const onSubmit = (data: IFormData): void => {
      // NOTE: Must use 'day' rather than 'editing' due to TypeScript inference
      if (!day) {
        if (!onAdd) return;
        onAdd({
          ...data,
          id: uuidv4(),
          repeats: false,
        });
      } else {
        if (!onEdit) return;
        onEdit({
          ...day,
          ...data,
        });
      }
    };

    return (
      <BottomSheet
        ref={ref}
        style={styles.sheetContent}
        title={editing ? t("screens:dayAddEdit.titleEdit") : t("screens:dayAddEdit.titleAdd")}
        onOpen={onOpen}
      >
        <TextInput
          autoCapitalize="words"
          // Prevent keyboard from flickering when moving to next field
          blurOnSubmit={false}
          control={form.control}
          innerRef={titleRef}
          label={t("screens:dayAddEdit.dayTitleLabel")}
          name="title"
          returnKeyType="next"
          onSubmitEditing={(): void => dateRef.current?.focus()}
        />
        <View style={styles.sheetFormRow}>
          <DateTimeInput
            // Prevent keyboard from flickering when moving to next field
            blurOnSubmit={false}
            control={form.control}
            innerRef={dateRef}
            label={t("screens:dayAddEdit.dayDateLabel")}
            name="date"
            returnKeyType="next"
            onSelect={(): void => {
              // TODO: Move to next field
              /*setTimeout(
                  () => costRef.current?.focus(),
                  // NOTE: Delay needed on iOS to prevent picker from re-opening (unknown)
                  Platform.OS === "ios" ? 400 : 0,
                );*/
            }}
            // TODO: Move to next field
            // onSubmitEditing={(): void => costRef.current?.focus()}
          />
        </View>
        <Dialog.Actions style={styles.sheetActions}>
          <Button color={colors.grey.dark} onPress={onCancel}>
            {t("common:choices.cancel")}
          </Button>
          <Button onPress={form.handleSubmit(onSubmit)}>
            {editing ? t("common:actions.save") : t("common:actions.add")}
          </Button>
        </Dialog.Actions>
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  sheetActions: {
    marginTop: 8,
    padding: 0,
  },
  sheetContent: {},
  sheetFormRow: {
    flexDirection: "row",
    marginTop: 4,
  },
});

export default ManageDaySheet;
