import React, { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

// Components
import { DayDisplay } from "@components/days";
import { Alert } from "@components/typography";

// Utilities
import { useAppSelector, useSnackbar } from "@hooks";
import { selectDays } from "@store/slices/days";
import { lightColors, sharedColors } from "@styles/theme";

// Types
import { IDayBase } from "@typings/day.types";

const fakeDay: IDayBase = {
  date: "2022-05-12",
  id: "app-inception",
  repeats: null,
  title: "App Inception",
  type: "countup",
};

const DayDashboard = (): ReactElement | null => {
  const { notifyError } = useSnackbar();
  const days = useAppSelector(selectDays);
  const { t } = useTranslation(["common", "screens"]);

  return (
    <View style={styles.dashboard}>
      <DayDisplay day={fakeDay} />
    </View>
  );
};

const styles = StyleSheet.create({
  dashboard: {
    padding: 24,
  },
});

export default DayDashboard;
