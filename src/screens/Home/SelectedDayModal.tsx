import React, { forwardRef, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { List } from "react-native-paper";

import { BottomSheet } from "@components/dialogs";

import type { BottomSheetRef } from "@components/dialogs/BottomSheet";
import type { MaterialCommunityIcons } from "@typings/app.types";
import type { Day } from "@typings/day.types";

type SelectedDayModalProps = {
  day: Day | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

interface SelectedDayOption {
  icon: keyof MaterialCommunityIcons;
  label: string;
  onClick: () => void;
}

const SelectedDayModal = forwardRef<BottomSheetRef, SelectedDayModalProps>(
  (props: SelectedDayModalProps, ref): ReactElement => {
    const { day, onClose, onEdit, onDelete } = props;

    const { t } = useTranslation(["screens"]);

    const selectedDayOptions: SelectedDayOption[] = [
      {
        icon: "pencil",
        label: t("screens:daySelectMenu.edit"),
        onClick: onEdit,
      },
      {
        icon: "delete",
        label: t("screens:daySelectMenu.delete"),
        onClick: onDelete,
      },
      {
        icon: "close",
        label: t("screens:daySelectMenu.cancel"),
        onClick: onClose,
      },
    ];

    return (
      <BottomSheet ref={ref} dismissable inset={false} title={day?.title ?? "N/A"}>
        {selectedDayOptions.map((option) => (
          <List.Item
            key={option.label}
            left={(innerProps) => <List.Icon {...innerProps} icon={option.icon} />}
            title={option.label}
            onPress={option.onClick}
          />
        ))}
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({});

export default SelectedDayModal;
