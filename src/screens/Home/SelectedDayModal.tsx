import React, { forwardRef, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { List, Text } from "react-native-paper";

import { BottomSheet } from "@components/dialogs";

import type { BottomSheetRef } from "@components/dialogs/BottomSheet";
import type { MaterialCommunityIcons, UpDown } from "@typings/app.types";
import type { Day } from "@typings/day.types";

type SelectedDayModalProps = {
  day: Day | null;
  dayPosition: { count: number; position: number } | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (direction: UpDown) => void;
};

interface SelectedDayOption {
  disabled?: boolean;
  icon: keyof MaterialCommunityIcons;
  label: string;
  onClick: () => void;
}

const SelectedDayModal = forwardRef<BottomSheetRef, SelectedDayModalProps>(
  (props: SelectedDayModalProps, ref): ReactElement => {
    const { day, dayPosition, onClose, onEdit, onDelete, onMove } = props;

    const { t } = useTranslation(["screens"]);

    const selectedDayOptions: SelectedDayOption[] = [
      {
        icon: "pencil",
        label: t("screens:daySelectMenu.edit"),
        onClick: onEdit,
      },
      {
        disabled: dayPosition ? dayPosition.position <= 1 : false,
        icon: "arrow-up",
        label: t("screens:daySelectMenu.moveUp"),
        onClick: () => onMove("up"),
      },
      {
        disabled: dayPosition ? dayPosition.position >= dayPosition.count : false,
        icon: "arrow-down",
        label: t("screens:daySelectMenu.moveDown"),
        onClick: () => onMove("down"),
      },
      {
        icon: "delete",
        label: t("screens:daySelectMenu.delete"),
        onClick: onDelete,
      },
    ];

    return (
      <BottomSheet
        ref={ref}
        dismissable
        inset={false}
        title={day?.title ?? "N/A"}
        titleRight={
          dayPosition ? (
            <Text style={styles.titleRight}>
              {t("screens:daySelectMenu.position", {
                count: dayPosition.count,
                position: dayPosition.position,
              })}
            </Text>
          ) : undefined
        }
        onClose={onClose}
      >
        {selectedDayOptions.map((option) => (
          <List.Item
            key={option.label}
            disabled={option.disabled}
            left={(innerProps) => <List.Icon {...innerProps} icon={option.icon} />}
            title={option.label}
            onPress={option.onClick}
          />
        ))}
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  titleRight: {
    opacity: 0.8,
  },
});

export default SelectedDayModal;
