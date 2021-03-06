import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

// Components
import ConfirmDialog from "./ConfirmDialog";

// Types
import { IDay } from "@typings/day.types";

export type DeleteDayDialogProps = {
  /** Day being deleted */
  day: IDay | null;
  /** Whether modal is visible */
  visible: boolean;
  /** Cancel callback */
  onCancel: () => void;
  /** Confirmation callback */
  onConfirm: () => void;
};

const DeleteDayDialog = (props: DeleteDayDialogProps): ReactElement | null => {
  const { day, visible, onCancel, onConfirm } = props;

  const { t } = useTranslation(["screens"]);

  if (!day) return null;

  return (
    <ConfirmDialog
      title={t("screens:dayShared.deleteDayConfirmTitle")}
      visible={visible}
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <Text>{t("screens:dayShared.deleteDayConfirmDescription")}</Text>
      <Text style={styles.deleteDialogDay}>{day.title}</Text>
    </ConfirmDialog>
  );
};

const styles = StyleSheet.create({
  deleteDialogDay: {
    marginTop: 12,
    fontWeight: "bold",
  },
});

export default DeleteDayDialog;
