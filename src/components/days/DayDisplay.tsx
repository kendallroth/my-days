import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import React, { ReactElement } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Surface, Text, Title, useTheme } from "react-native-paper";

// Utilities
import { lightColors, sharedColors } from "@styles/theme";
import { DATE_FORMAT_LONG, formatDateString } from "@utilities/date.util";
import { getDayDisplay } from "@utilities/day.util";

// Types
import { IDayBase } from "@typings/day.types";

type DayDisplayProps = {
  day: IDayBase;
  style?: StyleProp<ViewStyle>;
};

const DayDisplay = (props: DayDisplayProps): ReactElement => {
  const { day, style } = props;

  const theme = useTheme();

  // TODO: Potentially format date differently based on meta
  const dateDisplay = formatDateString(day.date, DATE_FORMAT_LONG);
  const dateCount = getDayDisplay(day);

  const countdown = day.type === "countdown";

  return (
    <Surface style={[style, styles.day]}>
      <View style={styles.dayHeader}>
        <Title numberOfLines={1} style={styles.dayHeaderTitle}>
          {day.title}
        </Title>
      </View>
      <View style={styles.dayContent}>
        <Icon
          color={dateCount.valid ? theme.colors.primary : theme.colors.error}
          name={countdown ? "arrow-down" : "arrow-up"}
          style={styles.dayContentIcon}
        />
        <Title style={styles.dayContentCount}>{dateCount.count}</Title>
        <Title style={styles.dayContentLabel}>{dateCount.label}</Title>
      </View>
      <View style={styles.dayFooter}>
        <Text style={styles.dayFooterDate}>{dateDisplay}</Text>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  day: {
    borderRadius: 12,
    overflow: "hidden",
  },
  dayContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  dayContentCount: {
    fontSize: 32,
    lineHeight: 32 * 1.25,
    fontWeight: "800",
  },
  dayContentIcon: {
    marginRight: 4,
    fontSize: 24,
  },
  dayContentLabel: {
    marginLeft: 8,
    fontSize: 24,
    color: sharedColors.grey.dark,
    lineHeight: 24 * 1.25,
  },
  dayHeader: {
    padding: 8,
    backgroundColor: lightColors.accent,
  },
  dayHeaderTitle: {
    textAlign: "center",
    fontSize: 18,
    lineHeight: 18 * 1.25,
    fontWeight: "700",
    color: sharedColors.white,
  },
  dayFooter: {
    padding: 8,
    borderTopWidth: 0.8,
    borderTopColor: sharedColors.grey.lightest,
  },
  dayFooterDate: {
    textAlign: "center",
  },
});

export default DayDisplay;
