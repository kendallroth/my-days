import React, { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Text } from "react-native-paper";

// Components
import { DayDisplay } from "@components/days";
import { Alert } from "@components/typography";

// Utilities
import { useAppSelector, useSnackbar } from "@hooks";
import { selectDays } from "@store/slices/days";
import { lightColors, sharedColors } from "@styles/theme";

// Types
import { IDay } from "@typings/day.types";

const gridSpacing = 24;
const DayDashboard = (): ReactElement | null => {
  const { notifyError } = useSnackbar();
  const days = useAppSelector(selectDays);
  const { t } = useTranslation(["common", "screens"]);

  const { width: screenWidth } = useWindowDimensions();
  const gridWidth = screenWidth - gridSpacing * 2;
  const gridItemWidth = (gridWidth - gridSpacing) / 2;

  const [mainDay, ...otherDays] = days;
  const otherDayRows: IDay[][] = [];
  for (let i = 0; i < otherDays.length; i += 2) {
    otherDayRows.push(otherDays.slice(i, i + 2));
  }

  return (
    <View style={styles.dashboard}>
      <DayDisplay day={mainDay} style={styles.dashboardDaysMain} />
      {otherDayRows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.dashboardDaysRow}>
          {row.map((day) => (
            <DayDisplay
              key={day.id}
              day={day}
              style={[styles.dashboardDaysRowItem, { width: gridItemWidth }]}
            />
          ))}
        </View>
      ))}
      {/* TODO: Add a "helpful" display image (undraw) */}
      {!days.length && <Alert style={styles.listEmpty}>{t("common:errors.noDays")}</Alert>}
    </View>
  );
};

const styles = StyleSheet.create({
  dashboard: {
    padding: gridSpacing,
  },
  dashboardDaysMain: {
    elevation: 2,
    marginHorizontal: gridSpacing,
    marginBottom: gridSpacing,
  },
  dashboardDaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: gridSpacing,
  },
  dashboardDaysRowItem: {},
  listEmpty: {},
});

export default DayDashboard;
