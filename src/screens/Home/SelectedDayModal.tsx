import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { List, Text } from "react-native-paper";

import { BottomSheet } from "@components/dialogs";
import { type BottomSheetRef } from "@components/dialogs/BottomSheet";
import { type MaterialCommunityIcons, type UpDown } from "@typings/app.types";
import { type Day } from "@typings/day.types";

type SelectedDayModalProps = {
  day: Day | null;
  dayPosition: { count: number; position: number } | null;
  onClose: () => void;
  onEdit: (day: Day) => void;
  onDelete: (day: Day) => void;
  onMove: (day: Day, direction: UpDown) => void;
  onShare: (day: Day) => void;
};

interface SelectedDayOption {
  disabled?: boolean;
  icon: keyof MaterialCommunityIcons;
  label: string;
  onPress: (day: Day) => void;
}

const SelectedDayModal = forwardRef<BottomSheetRef, SelectedDayModalProps>(
  (props: SelectedDayModalProps, ref) => {
    const { day, dayPosition, onClose, onEdit, onDelete, onMove, onShare } = props;

    const { t } = useTranslation(["screens"]);

    const selectedDayOptions: SelectedDayOption[] = [
      {
        icon: "pencil",
        label: t("screens:daySelectMenu.edit"),
        onPress: onEdit,
      },
      {
        disabled: dayPosition ? dayPosition.position <= 1 : false,
        icon: "arrow-up",
        label: t("screens:daySelectMenu.moveUp"),
        onPress: () => onMove(day!, "up"),
      },
      {
        disabled: dayPosition ? dayPosition.position >= dayPosition.count : false,
        icon: "arrow-down",
        label: t("screens:daySelectMenu.moveDown"),
        onPress: () => onMove(day!, "down"),
      },
      {
        icon: "share",
        label: t("screens:daySelectMenu.share"),
        onPress: onShare,
      },
      {
        icon: "delete",
        label: t("screens:daySelectMenu.delete"),
        onPress: onDelete,
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
            <Text style={styles.titleRight} variant="labelLarge">
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
            disabled={option.disabled || !day}
            left={(innerProps) => <List.Icon {...innerProps} icon={option.icon} />}
            title={option.label}
            onPress={day ? () => option.onPress(day) : undefined}
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
