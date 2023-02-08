import dayjs from "dayjs";
import React, { type ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

import ConfirmDialog from "./ConfirmDialog";

import type { Day } from "@typings/day.types";

type AddSharedDayDialogProps = {
  /** Day being shared */
  day: Day | null;
  /** Whether modal is visible */
  visible: boolean;
  /** Cancel callback */
  onCancel: () => void;
  /** Confirmation callback */
  onConfirm: () => void;
};

const AddSharedDayDialog = (props: AddSharedDayDialogProps): ReactElement | null => {
  const { day, visible, onCancel, onConfirm } = props;

  const { t } = useTranslation(["screens"]);

  if (!day) return null;

  return (
    <ConfirmDialog
      title={t("screens:daySharedLink.dayAddConfirmTitle", { title: day.title })}
      visible={visible}
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <Text style={styles.dialogDayTitle} variant="bodyMedium">
        {day.title}
      </Text>
      <Text style={styles.dialogDayDate} variant="bodySmall">
        {t("screens:daySharedLink.dayAddConfirmDate", { date: dayjs(day.date) })}
      </Text>
    </ConfirmDialog>
  );
};

const styles = StyleSheet.create({
  dialogDayDate: {
    marginTop: 8,
    opacity: 0.8,
  },
  dialogDayTitle: {
    fontWeight: "700",
  },
});

export default AddSharedDayDialog;
