import { yupResolver } from "@hookform/resolvers/yup";
import React, { forwardRef, useEffect, useRef } from "react";
import { useController, useForm } from "react-hook-form";
import { type TFunction, useTranslation } from "react-i18next";
import { type TextInput as RNPTextInput, StyleSheet, View } from "react-native";
import { Badge, Button, Dialog, IconButton, useTheme } from "react-native-paper";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";

import { Checkbox, DateTimeInput, TextInput } from "@components/form";
import { type MaterialCommunityIcons } from "@typings/app.types";
import { type Day, type DayNew } from "@typings/day.types";
import { dayIcons } from "@utilities/icons.util";

import BottomSheet from "./BottomSheet";
import { type BottomSheetRef } from "./BottomSheet";

interface IFormData {
  date: string;
  icon?: keyof MaterialCommunityIcons;
  title: string;
  repeats: boolean;
}

type ManageDaySheetProps = {
  /** Day to update */
  day?: Day | null;
  /** Add day callback */
  onAdd?: (day: DayNew) => void;
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
  (props: ManageDaySheetProps, ref) => {
    const { day, onAdd, onCancel, onEdit } = props;

    const titleRef = useRef<RNPTextInput | null>(null);
    const dateRef = useRef<RNPTextInput | null>(null);

    const { colors } = useTheme();
    const { t } = useTranslation(["common", "screens"]);
    const form = useForm<IFormData>({
      defaultValues: {
        date: day?.date ?? "",
        icon: day?.icon ?? undefined,
        title: day?.title ?? "",
        repeats: day?.repeats ?? false,
      },
      resolver: yupResolver(getSchema(t)),
    });

    // NOTE: Need dynamic access to the selected icon for display purposes
    const {
      field: { value: iconValue },
    } = useController({
      control: form.control,
      name: "icon",
    });

    const editing = Boolean(day);

    // Clear form whenever edited day changes (when editing or adding)
    useEffect(() => {
      form.reset({
        date: day?.date ?? "",
        icon: day?.icon ?? undefined,
        title: day?.title ?? "",
        repeats: day?.repeats ?? false,
      });
    }, [day, form]);

    /** Prepare modal when opened */
    const onOpen = () => {
      // NOTE: Short timeout necessary to access ref and open keyboard!
      setTimeout(() => {
        titleRef.current?.focus();
      }, 250);

      // NOTE: Form is also reset by "visibility" (necessary for editing day)
      form.reset();
    };

    const onIconClear = () => {
      form.setValue("icon", undefined);
    };

    /** Cycle through icons */
    const onIconCycle = (direction: "next" | "back") => {
      const formValues = form.getValues();

      let targetIdx = 0;
      if (formValues.icon) {
        const currentIconIdx = dayIcons.indexOf(formValues.icon);
        const wrapIdx = (idx: number, length: number) => (idx + length) % length;
        if (currentIconIdx >= 0) {
          targetIdx = direction === "next" ? currentIconIdx + 1 : currentIconIdx - 1;
          targetIdx = wrapIdx(targetIdx, dayIcons.length);
        }
      }

      form.setValue("icon", dayIcons[targetIdx]);
    };

    /** Add/update the entered day */
    const onSubmit = (data: IFormData) => {
      // NOTE: Must use 'day' rather than 'editing' due to TypeScript inference
      if (!day) {
        if (!onAdd) return;
        onAdd({
          ...data,
          id: uuidv4(),
          unit: "day",
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
        titleRight={
          <View style={styles.sheetTitleRight}>
            <IconButton
              icon="menu-left"
              size={20}
              style={{ marginVertical: -8 }}
              onPress={() => onIconCycle("back")}
            />
            <IconButton
              containerColor={iconValue ? colors.primary : colors.secondary}
              iconColor={colors.surface}
              icon={iconValue ?? "help"}
              size={24}
              style={{
                marginVertical: -8,
              }}
              onPress={() => onIconCycle("next")}
              onLongPress={onIconClear}
            />
            <Badge style={styles.sheetTitleRightBadge} size={12} visible={!iconValue} />
          </View>
        }
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
          onSubmitEditing={() => dateRef.current?.focus()}
        />
        <DateTimeInput
          // Prevent keyboard from flickering when moving to next field
          blurOnSubmit={false}
          control={form.control}
          innerRef={dateRef}
          label={t("screens:dayAddEdit.dayDateLabel")}
          name="date"
          returnKeyType="next"
          style={{ marginTop: 4 }}
        />
        <Checkbox
          control={form.control}
          hideHint
          label={t("screens:dayAddEdit.dayRepeatsLabel")}
          name="repeats"
        />
        <Dialog.Actions style={styles.sheetActions}>
          <Button textColor={colors.secondary} onPress={onCancel}>
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
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  sheetContent: {},
  sheetTitleRight: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  sheetTitleRightBadge: {
    position: "absolute",
    top: -10,
    right: 4,
  },
});

export default ManageDaySheet;
