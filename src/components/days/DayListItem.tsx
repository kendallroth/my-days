import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import React, { ReactElement } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Surface, Text, Title, useTheme } from "react-native-paper";

import { lightColors, sharedColors } from "@styles/theme";
import { DATE_FORMAT_LONG, formatDateString } from "@utilities/date.util";
import { getDayDisplay } from "@utilities/day.util";

import type { DayBase } from "@typings/day.types";

type DayDisplayProps = {
  day: DayBase;
  style?: StyleProp<ViewStyle>;
};

const DayListItem = (props: DayDisplayProps): ReactElement | null => {
  const { day, style } = props;

  const theme = useTheme();

  const dateDisplay = day.repeats
    ? `${formatDateString(day.date, DATE_FORMAT_LONG.split(",")[0])}`
    : formatDateString(day.date, DATE_FORMAT_LONG);
  // TODO: Recalculate based on repeats, etc
  const dateCount = getDayDisplay(day);

  const isToday = dateCount.count === 0;
  const countingDown = dateCount.count >= 0;

  return (
    <Surface style={[style, styles.day]}>
      <View style={styles.dayContent}>
        <Title numberOfLines={1} style={styles.dayContentTitle}>
          {day.title}
        </Title>
        <View style={styles.dayContentFooter}>
          <Text numberOfLines={1} style={styles.dayContentFooterDate}>
            {dateDisplay}
          </Text>
          <Icon
            color={sharedColors.grey.light}
            name={countingDown ? "calendar-end" : "calendar-start"}
            style={styles.dayContentFooterIcon}
          />
        </View>
      </View>

      <View style={styles.dayStats}>
        {!isToday && (
          <View
            style={[
              styles.dayStatsIconOutline,
              { backgroundColor: countingDown ? theme.colors.accent : theme.colors.white },
            ]}
          >
            <Icon
              color={countingDown ? theme.colors.white : theme.colors.accent}
              name={countingDown ? "chevron-down" : "chevron-up"}
              // name={countingDown ? "menu-down" : "menu-up"}
              style={styles.dayStatsIcon}
            />
          </View>
        )}
        <Title style={styles.dayStatsCount}>{Math.abs(dateCount.count)}</Title>
        <Text style={styles.dayStatsUnit}>days</Text>
      </View>
    </Surface>
  );
};

const counterWidth = 100;
const iconFontSize = 32;
const iconFontOffset = 4;

const styles = StyleSheet.create({
  day: {
    flexDirection: "row",
    borderRadius: 8,
    elevation: 1,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: lightColors.accent,
  },
  dayContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dayContentFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  dayContentFooterDate: {
    fontSize: 16,
    lineHeight: 16 * 1.1,
    color: sharedColors.grey.dark,
  },
  dayContentFooterIcon: {
    marginLeft: 8,
    fontSize: 16,
  },
  dayContentTitle: {
    fontSize: 20,
    lineHeight: 20 * 1.1,
    fontWeight: "700",
  },
  dayStats: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: counterWidth,
    backgroundColor: lightColors.accent,
  },
  dayStatsCount: {
    fontSize: 32,
    lineHeight: 32 * 1.1,
    color: sharedColors.white,
    fontWeight: "800",
  },
  dayStatsIcon: {
    fontSize: iconFontSize,
    // NOTE: This is a hack to easily align up/down arrows with current margin values
    borderWidth: 1,
    borderColor: sharedColors.transparent,
    margin: -iconFontOffset,
  },
  dayStatsIconOutline: {
    position: "absolute",
    left: -(iconFontSize / 2 - iconFontOffset),
    borderRadius: iconFontSize * 2,
  },
  dayStatsUnit: {
    position: "absolute",
    bottom: 6,
    color: sharedColors.white,
    opacity: 0.8,
  },
});

export default DayListItem;
