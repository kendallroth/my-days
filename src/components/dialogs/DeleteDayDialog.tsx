import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

import { type Day } from "@typings/day.types";

import ConfirmDialog from "./ConfirmDialog";

export type DeleteDayDialogProps = {
  /** Day being deleted */
  day: Day | null;
  /** Whether modal is visible */
  visible: boolean;
  /** Cancel callback */
  onCancel: () => void;
  /** Confirmation callback */
  onConfirm: () => void;
};

const DeleteDayDialog = (props: DeleteDayDialogProps) => {
  const { day, visible, onCancel, onConfirm } = props;

  const { t } = useTranslation(["screens"]);

  if (!day) return null;

  return (
    <ConfirmDialog
      title={t("screens:dayDelete.title")}
      visible={visible}
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <Text>{t("screens:dayDelete.description")}</Text>
      <Text style={styles.deleteDialogDay} variant="titleMedium">
        {day.title}
      </Text>
    </ConfirmDialog>
  );
};

const styles = StyleSheet.create({
  deleteDialogDay: {
    marginTop: 12,
  },
});

export default DeleteDayDialog;
